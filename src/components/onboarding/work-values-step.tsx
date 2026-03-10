"use client";

import { useState } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { getRiasecQuizResults } from "@/lib/actions/quiz.actions";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Loader2, SkipForward, Sparkles } from "lucide-react";
import { WORK_VALUES } from "@/lib/constants";

const RATING_FACES = ["\uD83D\uDE35", "\uD83D\uDE2C", "\uD83D\uDE10", "\uD83D\uDE0A", "\uD83E\uDD29"];
const RATING_LABELS = ["Not important", "A little", "Kinda", "Important", "Must have"];

export function WorkValuesStep() {
  const {
    riasecAnswers,
    skillRatings,
    setWorkValueRatings,
    setRiasecResults,
    setRiasecProfile,
    setCurrentStep,
    setIsLoading,
    selectedState,
    selectedGrade,
  } = useQuizStore();

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleRate = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const allRated = Object.keys(ratings).length === WORK_VALUES.length;

  const handleSubmit = async (valueRatings: Record<string, number>) => {
    setSubmitting(true);
    setWorkValueRatings(valueRatings);
    setCurrentStep(5); // calculating screen
    setIsLoading(true);

    try {
      const results = await getRiasecQuizResults(riasecAnswers, skillRatings, valueRatings);

      // Short delay for the animation
      await new Promise((r) => setTimeout(r, 2000));

      setRiasecProfile(results.riasecProfile);
      setRiasecResults(results); // sets currentStep to 6

      // Save to DB
      if (selectedState) {
        try {
          await updateUserProfile({
            state: selectedState,
            grade: selectedGrade ?? undefined,
            interests: results.topCategories,
            skillRatings: Object.keys(skillRatings).length > 0 ? skillRatings : undefined,
            riasecProfile: results.riasecProfile,
            workValueRatings: Object.keys(valueRatings).length > 0 ? valueRatings : undefined,
          });
        } catch {
          // User might not be logged in yet
        }
      }
    } catch (error) {
      console.error("Failed to get RIASEC results:", error);
      setCurrentStep(4); // back to values on error
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">What Matters to You?</h2>
        <p className="mt-2 text-white/70">
          Rate how important each of these is in your future career.
        </p>
      </div>

      <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg space-y-5">
        {WORK_VALUES.map((value) => (
          <div key={value.key}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{value.emoji}</span>
              <span className="text-sm font-medium">{value.label}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{value.teenDescription}</p>
            <div className="flex gap-2">
              {RATING_FACES.map((face, i) => {
                const ratingValue = i + 1;
                const isSelected = ratings[value.key] === ratingValue;
                return (
                  <button
                    key={i}
                    onClick={() => handleRate(value.key, ratingValue)}
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
          onClick={() => handleSubmit({})}
          disabled={submitting}
          className="gap-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
        <Button
          onClick={() => handleSubmit(ratings)}
          disabled={!allRated || submitting}
          className="btn-gradient rounded-xl gap-2"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              See My Results
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
