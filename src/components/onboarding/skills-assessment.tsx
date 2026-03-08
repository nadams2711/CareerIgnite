"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/quiz-store";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { refineResultsWithSkills } from "@/lib/actions/quiz.actions";
import { ChevronDown, ChevronUp, Loader2, Sparkles, Check, RotateCcw } from "lucide-react";
import type { QuizResults } from "@/types";

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

interface SkillsAssessmentProps {
  categoryScores: Record<string, number>;
  onRefine: (newResults: QuizResults) => void;
}

export function SkillsAssessment({ categoryScores, onRefine }: SkillsAssessmentProps) {
  const savedRatings = useQuizStore((s) => s.skillRatings);
  const setSkillRatings = useQuizStore((s) => s.setSkillRatings);
  const hasCompleted = Object.keys(savedRatings).length === SKILL_AREAS.length;

  const [expanded, setExpanded] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>(savedRatings);
  const [saving, setSaving] = useState(false);

  const handleRate = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefine = async () => {
    setSaving(true);
    try {
      await updateUserProfile({ skillRatings: ratings }).catch(() => {});
      setSkillRatings(ratings);
      const refined = await refineResultsWithSkills(categoryScores, ratings);
      onRefine(refined);
      setExpanded(false);
    } catch {
      // Silently handle errors
    } finally {
      setSaving(false);
    }
  };

  const handleRedo = () => {
    setRatings(savedRatings);
    setExpanded(true);
  };

  const allRated = Object.keys(ratings).length === SKILL_AREAS.length;

  // Collapsed state
  if (!expanded) {
    if (hasCompleted) {
      // Show completed summary with option to redo
      return (
        <div className="w-full rounded-2xl bg-card border-2 border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              <p className="font-bold text-sm">Your strengths</p>
            </div>
            <button onClick={handleRedo} className="flex items-center gap-1 text-xs text-primary hover:underline">
              <RotateCcw className="h-3 w-3" />
              Redo
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SKILL_AREAS.map((skill) => {
              const rating = savedRatings[skill.key];
              if (!rating) return null;
              return (
                <div key={skill.key} className="flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs">
                  <span>{skill.emoji}</span>
                  <span className="font-medium">{skill.label}</span>
                  <span>{RATING_FACES[rating - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full rounded-2xl bg-card border-2 border-border p-5 shadow-sm transition-all hover:shadow-md text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">Want even better matches?</p>
            <p className="text-sm text-muted-foreground">
              Rate your strengths to refine your career suggestions
            </p>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </button>
    );
  }

  // Expanded state — the rating UI
  return (
    <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Rate Your Strengths</h3>
          <p className="text-sm text-muted-foreground">
            Tap to rate each area — no wrong answers!
          </p>
        </div>
        <button onClick={() => setExpanded(false)}>
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
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

      <Button
        onClick={handleRefine}
        disabled={!allRated || saving}
        className="w-full btn-gradient rounded-xl gap-2"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Refine My Career Matches
          </>
        )}
      </Button>
    </div>
  );
}
