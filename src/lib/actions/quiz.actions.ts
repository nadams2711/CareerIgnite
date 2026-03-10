"use server";

import { prisma } from "@/lib/prisma";
import type { CareerCategory } from "@prisma/client";
import type {
  SwipeAnswer,
  QuizResults,
  CareerWithPathways,
  RiasecSwipeAnswer,
  RiasecProfile,
  RiasecQuizResults,
  RiasecMatchedCareer,
  RiasecType,
} from "@/types";
import { SWIPE_SCENARIOS, CAREER_CATEGORIES, RIASEC_TYPES, RIASEC_TO_CATEGORIES, CATEGORIES_TO_RIASEC, DEEP_QUIZ_QUESTIONS } from "@/lib/constants";

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

// ── RIASEC scoring engine ──

function buildRiasecProfile(answers: RiasecSwipeAnswer[]): RiasecProfile {
  const profile: RiasecProfile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const answer of answers) {
    if (answer.liked) {
      profile[answer.riasecType] = (profile[answer.riasecType] || 0) + 1;
    }
  }
  return profile;
}

function deriveRiasecCode(profile: RiasecProfile): string {
  const sorted = (Object.entries(profile) as [RiasecType, number][])
    .sort(([, a], [, b]) => b - a);
  return sorted[0][0] + sorted[1][0];
}

function riasecCodeLabel(code: string): string {
  const types = code.split('') as RiasecType[];
  return types.map((t) => RIASEC_TYPES[t].teenName).join(' + ');
}

function computeRiasecCongruence(profile: RiasecProfile, careerCode: string): number {
  const types = careerCode.split('') as RiasecType[];
  const primary = types[0];
  const secondary = types[1];

  // Max possible score: if user liked all 3 scenarios of primary type (3) + all 3 of secondary (3*0.5=1.5) = 4.5
  const maxPossible = 3 * 1.0 + 3 * 0.5; // 4.5
  const score = (profile[primary] || 0) * 1.0 + (profile[secondary] || 0) * 0.5;
  return Math.min(score / maxPossible, 1.0);
}

function computeSkillFit(
  userRatings: Record<string, number>,
  careerWeights: Record<string, number>
): number {
  if (Object.keys(userRatings).length === 0) return 0.5;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [skill, weight] of Object.entries(careerWeights)) {
    const userRating = userRatings[skill];
    if (userRating !== undefined) {
      const normalized = (userRating - 1) / 4; // 1-5 → 0-1
      weightedSum += normalized * weight;
      totalWeight += weight;
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

function computeValuesFit(
  userRatings: Record<string, number>,
  careerValues: Record<string, number>
): number {
  if (Object.keys(userRatings).length === 0) return 0.5;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [value, importance] of Object.entries(careerValues)) {
    const userRating = userRatings[value];
    if (userRating !== undefined) {
      const normalized = (userRating - 1) / 4; // 1-5 → 0-1
      weightedSum += normalized * importance;
      totalWeight += importance;
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

function buildMatchExplanation(
  profile: RiasecProfile,
  career: { title: string; riasecCode: string | null },
  matchScore: number
): string {
  if (!career.riasecCode) return '';

  const types = career.riasecCode.split('') as RiasecType[];
  const primary = RIASEC_TYPES[types[0]];
  const secondary = RIASEC_TYPES[types[1]];

  const strength = matchScore >= 80 ? 'Strong match'
    : matchScore >= 60 ? 'Good match'
    : 'Potential match';

  const careerTypeLabel = `${primary.teenName.replace('The ', '')}–${secondary.teenName.replace('The ', '')}`;

  // Find user's top type
  const userTop = (Object.entries(profile) as [RiasecType, number][])
    .sort(([, a], [, b]) => b - a)[0][0];
  const userTopInfo = RIASEC_TYPES[userTop];

  return `${strength}! ${career.title} is a ${careerTypeLabel} career, which lines up with your ${userTopInfo.teenName.replace('The ', '').toLowerCase()} side.`;
}

/**
 * Shared RIASEC scoring engine — scores all careers against a given profile.
 * Used by both initial quiz results and deep quiz refinement.
 */
async function scoreRiasecCareers(
  profile: RiasecProfile,
  skillRatings: Record<string, number>,
  workValueRatings: Record<string, number>
): Promise<RiasecQuizResults> {
  const riasecCode = deriveRiasecCode(profile);
  const riasecLabel = riasecCodeLabel(riasecCode);

  // Fetch all careers with RIASEC data
  const allCareers = await prisma.career.findMany({
    where: { riasecCode: { not: null } },
    include: { pathways: true },
  });

  // Score each career
  const scored: RiasecMatchedCareer[] = allCareers.map((career) => {
    const careerCode = career.riasecCode!;
    const careerSkillWeights = (career.skillWeights as Record<string, number>) ?? {};
    const careerWorkValues = (career.workValues as Record<string, number>) ?? {};

    const riasecCongruence = computeRiasecCongruence(profile, careerCode);
    const skillFit = computeSkillFit(skillRatings, careerSkillWeights);
    const valuesFit = computeValuesFit(workValueRatings, careerWorkValues);

    // Weighted composite: 50% RIASEC, 30% skills, 20% values
    const rawScore = 0.50 * riasecCongruence + 0.30 * skillFit + 0.20 * valuesFit;
    const matchScore = Math.round(rawScore * 100);

    const explanation = buildMatchExplanation(profile, career, matchScore);

    return {
      ...career,
      matchScore,
      matchBreakdown: {
        riasecCongruence: Math.round(riasecCongruence * 100),
        skillFit: Math.round(skillFit * 100),
        valuesFit: Math.round(valuesFit * 100),
      },
      matchExplanation: explanation,
    };
  });

  // Sort by matchScore, take top 10
  scored.sort((a, b) => b.matchScore - a.matchScore);
  const topCareers = scored.slice(0, 10);

  // Derive categories from RIASEC code for backward compat
  const codeTypes = riasecCode.split('') as RiasecType[];
  const categorySet = new Set<CareerCategory>();
  for (const t of codeTypes) {
    for (const cat of RIASEC_TO_CATEGORIES[t]) {
      categorySet.add(cat);
    }
  }
  const topCategories = Array.from(categorySet).slice(0, 3);

  // Build category scores from profile for backward compat
  const categoryScores: Record<string, number> = {};
  for (const [type, score] of Object.entries(profile) as [RiasecType, number][]) {
    for (const cat of RIASEC_TO_CATEGORIES[type]) {
      categoryScores[cat] = (categoryScores[cat] || 0) + score;
    }
  }

  const vibeLabel = codeTypes
    .map((t) => RIASEC_TYPES[t].teenName.replace('The ', '').toUpperCase())
    .join(' + ');

  return {
    topCategories,
    matchedCareers: topCareers,
    categoryScores,
    vibeLabel,
    riasecProfile: profile,
    riasecCode,
    riasecLabel,
  };
}

export async function getRiasecQuizResults(
  riasecAnswers: RiasecSwipeAnswer[],
  skillRatings: Record<string, number> = {},
  workValueRatings: Record<string, number> = {}
): Promise<RiasecQuizResults> {
  const profile = buildRiasecProfile(riasecAnswers);
  return scoreRiasecCareers(profile, skillRatings, workValueRatings);
}

/**
 * Refine RIASEC results using deep quiz answers.
 * Combines the original RIASEC profile (50%) with deep quiz signals (50%)
 * to produce an augmented profile, then re-scores all careers.
 */
export async function refineRiasecResults(
  riasecProfile: RiasecProfile,
  deepQuizAnswers: { questionId: number; selectedOptions: string[] }[],
  skillRatings: Record<string, number> = {},
  workValueRatings: Record<string, number> = {}
): Promise<RiasecQuizResults> {
  // 1. Build deep quiz RIASEC profile by reverse-mapping categories → RIASEC types
  const deepProfile: RiasecProfile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const answer of deepQuizAnswers) {
    const question = DEEP_QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;
    for (const optionId of answer.selectedOptions) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const category of option.categories) {
        const riasecTypes = CATEGORIES_TO_RIASEC[category];
        if (!riasecTypes) continue;
        // Split the boost across mapped RIASEC types
        const boost = 1.0 / riasecTypes.length;
        for (const t of riasecTypes) {
          deepProfile[t] += boost;
        }
      }
    }
  }

  // 2. Normalize original profile to 0-1 (max 3 per type from 3 swipe scenarios)
  const originalNorm: RiasecProfile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const t of Object.keys(originalNorm) as RiasecType[]) {
    originalNorm[t] = (riasecProfile[t] || 0) / 3;
  }

  // 3. Normalize deep quiz profile to 0-1 (relative to max score in deep profile)
  const maxDeepScore = Math.max(...Object.values(deepProfile), 1); // avoid div by 0
  const deepNorm: RiasecProfile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const t of Object.keys(deepNorm) as RiasecType[]) {
    deepNorm[t] = deepProfile[t] / maxDeepScore;
  }

  // 4. Average both (50/50 weight) and scale back to scoring range
  const combined: RiasecProfile = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const t of Object.keys(combined) as RiasecType[]) {
    combined[t] = ((originalNorm[t] + deepNorm[t]) / 2) * 3;
  }

  return scoreRiasecCareers(combined, skillRatings, workValueRatings);
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
