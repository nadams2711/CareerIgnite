"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { SWIPE_SCENARIOS, CAREER_CATEGORIES, DEEP_QUIZ_QUESTIONS } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

// Personality insights per category — what it says about YOU
const CATEGORY_INSIGHTS: Record<string, {
  trait: string;
  strength: string;
}> = {
  TECHNOLOGY: {
    trait: "You love solving puzzles and figuring out how things work. You get a real buzz from cracking problems that stump other people, and you're not afraid to dig deep until you find the answer.",
    strength: "That persistence and logical thinking is exactly what tech careers need — whether it's building apps, analysing data, or protecting systems from hackers.",
  },
  TRADES: {
    trait: "You're someone who likes to work with your hands and see real, physical results. There's nothing better than stepping back and admiring something you actually built.",
    strength: "That hands-on mindset and eye for quality makes you a natural fit for trades — careers where you create, fix, and build things that last.",
  },
  CREATIVE: {
    trait: "You've got a creative spark — you see the world differently and love expressing ideas through design, art, or media. You're drawn to making things that look and feel amazing.",
    strength: "That creative vision is a genuine superpower in careers where you shape how people experience brands, stories, and visual culture.",
  },
  HEALTH: {
    trait: "You have a kind heart and genuinely want to help others. You stay calm when things get intense, and people trust you in tough moments.",
    strength: "That empathy and composure under pressure is exactly what healthcare needs — careers where you make a direct, life-changing difference for people.",
  },
  SCIENCE: {
    trait: "You're naturally curious — you want to understand why things are the way they are. You notice patterns others miss and love digging into the details.",
    strength: "That analytical mind and love of discovery is what drives science careers — where your research and insights can change how we understand the world.",
  },
  BUSINESS: {
    trait: "You're a natural organiser and leader. You see opportunities others don't, you enjoy bringing people together, and you know how to get things done.",
    strength: "That drive and people-sense is the foundation of business careers — where you'll lead teams, close deals, and build something of your own.",
  },
  EDUCATION: {
    trait: "You light up when you help someone understand something new. You're patient, you explain things well, and you genuinely care about other people's growth.",
    strength: "That gift for communication and mentoring is what makes great educators — careers where you shape the next generation and see real impact every day.",
  },
  SPORTS: {
    trait: "You're competitive, driven, and love pushing yourself physically. Whether it's training, coaching, or being in the game, you thrive on energy and performance.",
    strength: "That discipline and passion for peak performance is what sports careers are built on — from the field to the lab to the broadcast booth.",
  },
  SERVICES: {
    trait: "You're a people person who loves creating great experiences. You enjoy the buzz of a busy environment and take pride in making others happy.",
    strength: "That warmth and service mindset is perfect for hospitality and events careers — where every day is different and you bring people together.",
  },
};

// Skill rating labels for summary
const SKILL_LABELS: Record<string, string> = {
  math: "math & numbers",
  writing: "writing & communication",
  creative: "creative & design",
  tech: "tech & digital",
  people: "people & teamwork",
  handson: "hands-on & physical",
};

interface ResultsSummaryProps {
  vibeLabel: string;
  topCategories: CareerCategory[];
}

export function ResultsSummary({ vibeLabel, topCategories }: ResultsSummaryProps) {
  const swipeAnswers = useQuizStore((s) => s.swipeAnswers);
  const skillRatings = useQuizStore((s) => s.skillRatings);
  const deepQuizAnswers = useQuizStore((s) => s.deepQuizAnswers);

  const hasSkills = Object.keys(skillRatings).length > 0;
  const hasDeepQuiz = Object.keys(deepQuizAnswers).length > 0;

  if (topCategories.length === 0) return null;

  // Always use the current topCategories (these update after every refinement)
  const topInsights = topCategories
    .slice(0, 3)
    .map((c) => ({ category: c, info: CAREER_CATEGORIES[c], insight: CATEGORY_INSIGHTS[c] }))
    .filter((x) => x.info && x.insight);

  if (topInsights.length === 0) return null;

  // Build evidence lines: what inputs contributed to each category
  function getEvidence(category: string): string[] {
    const evidence: string[] = [];

    // Swipe scenarios that matched this category
    const likedForCat = swipeAnswers
      .filter((a) => a.liked)
      .map((a) => SWIPE_SCENARIOS.find((s) => s.id === a.scenarioId))
      .filter(Boolean)
      .filter((s) => s!.categories.includes(category as CareerCategory));
    if (likedForCat.length > 0) {
      const emojis = likedForCat.map((s) => s!.emoji).join(" ");
      evidence.push(`Quiz: you vibed with ${emojis}`);
    }

    // Skill ratings that boosted this category
    const SKILL_CAT_MAP: Record<string, string[]> = {
      math: ["TECHNOLOGY", "SCIENCE", "BUSINESS"],
      writing: ["EDUCATION", "CREATIVE", "BUSINESS"],
      creative: ["CREATIVE"],
      tech: ["TECHNOLOGY"],
      people: ["EDUCATION", "HEALTH", "SERVICES", "SPORTS"],
      handson: ["TRADES", "SPORTS"],
    };
    if (hasSkills) {
      const boostingSkills = Object.entries(SKILL_CAT_MAP)
        .filter(([skill, cats]) => cats.includes(category) && (skillRatings[skill] || 0) >= 4)
        .map(([skill]) => SKILL_LABELS[skill]);
      if (boostingSkills.length > 0) {
        evidence.push(`Strengths: you're crushing ${boostingSkills.join(", ")}`);
      }
    }

    // Deep quiz options that matched this category
    if (hasDeepQuiz) {
      let deepCount = 0;
      for (const [qId, optIds] of Object.entries(deepQuizAnswers)) {
        const question = DEEP_QUIZ_QUESTIONS.find((q) => q.id === parseInt(qId));
        if (!question) continue;
        for (const optId of optIds) {
          const opt = question.options.find((o) => o.id === optId);
          if (opt && opt.categories.includes(category as CareerCategory)) {
            deepCount++;
          }
        }
      }
      if (deepCount > 0) {
        evidence.push(`Deep dive: ${deepCount} answer${deepCount > 1 ? "s" : ""} pointed here`);
      }
    }

    return evidence;
  }

  // Label based on what data we have
  const subtitle = hasDeepQuiz
    ? "Based on your quiz, strengths, and deep dive — here's the full picture."
    : hasSkills
    ? "Based on your quiz and strengths — here's what stands out."
    : "Based on the scenarios you vibed with, here's what stands out.";

  return (
    <div className="rounded-2xl bg-card border-2 border-border p-5 shadow-sm mb-8">
      <h3 className="font-bold text-sm mb-1">Here&apos;s what your choices say about you</h3>
      <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      <div className="space-y-5">
        {topInsights.map(({ category, info, insight }) => {
          const evidence = getEvidence(category);
          return (
            <div key={category}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${info.gradient}`} />
                <span className={`text-xs font-semibold ${info.textColor}`}>
                  {info.label}
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.trait}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {insight.strength}
              </p>
              {evidence.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {evidence.map((e, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
