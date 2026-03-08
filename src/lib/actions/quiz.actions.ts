"use server";

import { prisma } from "@/lib/prisma";
import type { CareerCategory } from "@prisma/client";
import type { SwipeAnswer, QuizResults, CareerWithPathways } from "@/types";
import { SWIPE_SCENARIOS, CAREER_CATEGORIES } from "@/lib/constants";

// ── Skill-to-category mapping (for category-level boosting) ──

const SKILL_CATEGORY_MAP: Record<string, CareerCategory[]> = {
  math: ["TECHNOLOGY", "SCIENCE", "BUSINESS"],
  writing: ["EDUCATION", "CREATIVE", "BUSINESS"],
  creative: ["CREATIVE"],
  tech: ["TECHNOLOGY"],
  people: ["EDUCATION", "HEALTH", "SERVICES", "SPORTS"],
  handson: ["TRADES", "SPORTS"],
};

// ── Career skill keywords → user skill area mapping ──
// Maps keywords found in career.skills[] to the user's self-rated skill areas.
// When a career skill string contains one of these keywords, that career gets
// a fit bonus from the user's rating in that skill area.

const CAREER_SKILL_TO_USER_SKILL: { keyword: RegExp; userSkill: string }[] = [
  // math
  { keyword: /math|statistic|financial|accounting|data analysis|spreadsheet|budget/i, userSkill: "math" },
  // writing
  { keyword: /writing|communication|report|storytelling|scriptwriting|presentation|lesson planning/i, userSkill: "writing" },
  // creative
  { keyword: /creative|design|colour|color|typography|composition|visual|animation|illustration|sketching|audio|music|video production|art/i, userSkill: "creative" },
  // tech
  { keyword: /programming|software|code|sql|python|digital|network|security|game engine|cad|daw|figma|tool.*\(|systems/i, userSkill: "tech" },
  // people
  { keyword: /patient|empathy|compassion|teamwork|collaboration|customer|client|coaching|counseli?ng|listen|mentor|classroom|interview|negotiat/i, userSkill: "people" },
  // handson
  { keyword: /physical|fitness|hand.*tool|manual|welding|cutting|pipe|blueprint|mechanical|diving|field research|instrument|athletic|conditioning/i, userSkill: "handson" },
];

/**
 * Score how well a career's skills match the user's self-rated strengths.
 * Returns a bonus from -1.0 to +2.0 based on alignment.
 */
function careerSkillFit(careerSkills: string[], skillRatings: Record<string, number>): number {
  if (Object.keys(skillRatings).length === 0) return 0;

  let totalBoost = 0;
  let matchCount = 0;

  for (const careerSkill of careerSkills) {
    for (const { keyword, userSkill } of CAREER_SKILL_TO_USER_SKILL) {
      if (keyword.test(careerSkill) && skillRatings[userSkill] !== undefined) {
        // rating 1-5 → boost -0.3 to +0.3 per matched skill
        totalBoost += (skillRatings[userSkill] - 2.5) * 0.12;
        matchCount++;
        break; // one match per career skill is enough
      }
    }
  }

  return totalBoost;
}

/**
 * Rank careers by: category relevance + individual skill fit + growth rate.
 * This means two careers in the same category will be differentiated by
 * how well their specific skills match the user's strengths.
 */
function rankCareers(
  careers: CareerWithPathways[],
  categoryScores: Record<string, number>,
  skillRatings: Record<string, number> = {},
  limit = 5
) {
  return [...careers]
    .map((career) => {
      const categoryScore = categoryScores[career.category] || 0;
      const skillFit = careerSkillFit(career.skills, skillRatings);
      // Composite score: category match is primary, skill fit is secondary
      const compositeScore = categoryScore + skillFit;
      return { career, compositeScore, categoryScore };
    })
    .sort((a, b) => {
      if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
      return b.career.growthRate - a.career.growthRate; // final tie-break
    })
    .slice(0, limit)
    .map((x) => x.career);
}

function buildVibeLabel(topCategories: CareerCategory[]) {
  return (
    topCategories
      .slice(0, 2)
      .map((c) => CAREER_CATEGORIES[c].label.toUpperCase())
      .join(" + ") || "EXPLORER"
  );
}

function sortCategories(scores: Record<string, number>) {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([category]) => category as CareerCategory);
}

// ── Public actions ──

export async function getSwipeQuizResults(
  answers: SwipeAnswer[],
  skillRatings: Record<string, number> = {}
): Promise<QuizResults> {
  const categoryScores: Record<string, number> = {};

  for (const answer of answers) {
    if (!answer.liked) continue;
    const scenario = SWIPE_SCENARIOS.find((s) => s.id === answer.scenarioId);
    if (!scenario) continue;
    for (const category of scenario.categories) {
      categoryScores[category] = (categoryScores[category] || 0) + 1;
    }
  }

  const topCategories = sortCategories(categoryScores).slice(0, 3);

  const allCareers = await prisma.career.findMany({
    where: { category: { in: topCategories } },
    include: { pathways: true },
  });

  const matchedCareers = rankCareers(allCareers, categoryScores, skillRatings);

  return {
    topCategories,
    matchedCareers,
    categoryScores,
    vibeLabel: buildVibeLabel(topCategories),
  };
}

export async function refineResultsWithSkills(
  categoryScores: Record<string, number>,
  skillRatings: Record<string, number>
): Promise<QuizResults> {
  const adjusted = { ...categoryScores };

  // Boost categories based on skill strengths
  for (const [skill, rating] of Object.entries(skillRatings)) {
    const categories = SKILL_CATEGORY_MAP[skill];
    if (!categories) continue;
    const boost = (rating - 2.5) * 0.4;
    for (const cat of categories) {
      adjusted[cat] = (adjusted[cat] || 0) + boost;
    }
  }

  const topCategories = sortCategories(adjusted).slice(0, 3);

  const allCareers = await prisma.career.findMany({
    where: { category: { in: topCategories } },
    include: { pathways: true },
  });

  // Pass skillRatings so individual career skills are scored too
  const matchedCareers = rankCareers(allCareers, adjusted, skillRatings);

  return {
    topCategories,
    matchedCareers,
    categoryScores: adjusted,
    vibeLabel: buildVibeLabel(topCategories),
  };
}

export async function combineQuizResults(
  swipeScores: Record<string, number>,
  detailedAnswers: { questionId: number; selectedOptions: string[] }[],
  skillRatings: Record<string, number> = {}
): Promise<QuizResults> {
  const { DEEP_QUIZ_QUESTIONS } = await import("@/lib/constants");
  const combined = { ...swipeScores };

  for (const answer of detailedAnswers) {
    const question = DEEP_QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;
    for (const optionId of answer.selectedOptions) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const category of option.categories) {
        combined[category] = (combined[category] || 0) + 1;
      }
    }
  }

  const topCategories = sortCategories(combined).slice(0, 3);

  const allCareers = await prisma.career.findMany({
    where: { category: { in: topCategories } },
    include: { pathways: true },
  });

  const matchedCareers = rankCareers(allCareers, combined, skillRatings);

  return {
    topCategories,
    matchedCareers,
    categoryScores: combined,
    vibeLabel: buildVibeLabel(topCategories),
  };
}

// Legacy function for backwards compatibility
export async function getQuizResults(answers: { questionId: number; selectedOptions: string[] }[]): Promise<QuizResults> {
  const { QUIZ_QUESTIONS } = await import("@/lib/constants");
  const categoryScores: Record<string, number> = {};

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;
    for (const optionId of answer.selectedOptions) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const category of option.categories) {
        categoryScores[category] = (categoryScores[category] || 0) + 1;
      }
    }
  }

  const topCategories = sortCategories(categoryScores).slice(0, 3);
  const allCareers = await prisma.career.findMany({
    where: { category: { in: topCategories } },
    include: { pathways: true },
  });
  const matchedCareers = rankCareers(allCareers, categoryScores);

  return {
    topCategories,
    matchedCareers,
    categoryScores,
    vibeLabel: buildVibeLabel(topCategories),
  };
}
