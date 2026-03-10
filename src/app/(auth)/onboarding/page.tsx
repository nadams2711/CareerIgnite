"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { StateSelector } from "@/components/onboarding/state-selector";
import { SchoolSelector } from "@/components/onboarding/school-selector";
import { RiasecQuiz } from "@/components/onboarding/riasec-quiz";
import { SkillRatingsStep } from "@/components/onboarding/skill-ratings-step";
import { WorkValuesStep } from "@/components/onboarding/work-values-step";
import { RiasecResults } from "@/components/onboarding/riasec-results";
import { QuizResults } from "@/components/onboarding/quiz-results";
import { Navbar } from "@/components/layout/navbar";
import { Loader2 } from "lucide-react";

function CalculatingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 animate-pulse" />
        <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">Calculating your vibe...</h2>
      <p className="text-white/70">Matching you with careers you&apos;ll love</p>
    </div>
  );
}

export default function OnboardingPage() {
  const currentStep = useQuizStore((s) => s.currentStep);
  const riasecResults = useQuizStore((s) => s.riasecResults);
  const legacyResults = useQuizStore((s) => s.results);
  const riasecAnswers = useQuizStore((s) => s.riasecAnswers);
  const reset = useQuizStore((s) => s.reset);

  // Detect stale state: at a late step but no quiz data to show
  useEffect(() => {
    if (currentStep >= 3 && riasecAnswers.length === 0 && !riasecResults && !legacyResults) {
      reset();
    }
  }, [currentStep, riasecAnswers.length, riasecResults, legacyResults, reset]);

  const stepLabels = ["Your State", "Your School", "Quiz", "Skills", "Values", "Results"];

  // At step 6: show RIASEC results if available, else legacy results, else reset
  const hasRiasecResults = !!riasecResults;
  const hasLegacyResults = !hasRiasecResults && !!legacyResults;

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-1.5 sm:gap-2">
          {stepLabels.map((label, i) => {
            // Map display index to step numbers:
            // 0=state, 1=school, 2=quiz, 3=skills, 4=values, 5(results)=6
            const stepIndex = i === 5 ? 6 : i;
            const isActive = currentStep >= stepIndex || (i === 5 && currentStep >= 5);
            return (
              <div key={label} className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-sm font-medium lg:inline ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
                {i < 5 && (
                  <div
                    className={`h-px w-4 sm:w-8 lg:w-12 transition-all ${
                      currentStep > stepIndex ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        {currentStep === 0 && <StateSelector />}
        {currentStep === 1 && <SchoolSelector />}
        {currentStep === 2 && <RiasecQuiz />}
        {currentStep === 3 && <SkillRatingsStep />}
        {currentStep === 4 && <WorkValuesStep />}
        {currentStep === 5 && <CalculatingScreen />}
        {currentStep === 6 && hasRiasecResults && <RiasecResults />}
        {currentStep === 6 && hasLegacyResults && <QuizResults />}
      </div>
    </div>
  );
}
