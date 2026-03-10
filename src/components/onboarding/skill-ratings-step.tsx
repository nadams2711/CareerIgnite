"use client";

import { useState } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, SkipForward } from "lucide-react";

const SKILL_AREAS = [
  { key: "math", label: "Math & Numbers", emoji: "\uD83D\uDD22" },
  { key: "writing", label: "Writing & Communication", emoji: "\u270D\uFE0F" },
  { key: "creative", label: "Creative & Design", emoji: "\uD83C\uDFA8" },
  { key: "tech", label: "Tech & Digital", emoji: "\uD83D\uDCBB" },
  { key: "people", label: "People & Teamwork", emoji: "\uD83E\uDD1D" },
  { key: "handson", label: "Hands-on & Physical", emoji: "\uD83D\uDD27" },
];

const RATING_FACES = ["\uD83D\uDE35", "\uD83D\uDE2C", "\uD83D\uDE10", "\uD83D\uDE0A", "\uD83E\uDD29"];
const RATING_LABELS = ["Struggling", "Getting there", "Okay", "Good", "Crushing it"];

export function SkillRatingsStep() {
  const { skillRatings: savedRatings, setSkillRatings, setCurrentStep } = useQuizStore();
  const [ratings, setRatings] = useState<Record<string, number>>(savedRatings);

  const handleRate = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const allRated = Object.keys(ratings).length === SKILL_AREAS.length;

  const handleContinue = () => {
    setSkillRatings(ratings);
    setCurrentStep(4); // → work values
  };

  const handleSkip = () => {
    setCurrentStep(4); // → work values with empty ratings
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Rate Your Strengths</h2>
        <p className="mt-2 text-white/70">
          How good are you at each of these? Be honest — this helps match you better.
        </p>
      </div>

      <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg space-y-5">
        {SKILL_AREAS.map((skill) => (
          <div key={skill.key}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{skill.emoji}</span>
              <span className="text-sm font-medium">{skill.label}</span>
            </div>
            <div className="flex gap-2">
              {RATING_FACES.map((face, i) => {
                const value = i + 1;
                const isSelected = ratings[skill.key] === value;
                return (
                  <button
                    key={i}
                    onClick={() => handleRate(skill.key, value)}
                    className={`flex flex-col items-center gap-0.5 rounded-xl p-2 flex-1 transition-all ${
                      isSelected
                        ? "bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105"
                        : "hover:bg-muted"
                    }`}
                    title={RATING_LABELS[i]}
                  >
                    <span className="text-xl">{face}</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">
                      {RATING_LABELS[i]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!allRated}
          className="btn-gradient rounded-xl gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
