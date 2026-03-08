"use client";

import { useQuizStore } from "@/stores/quiz-store";
import { StateSelector } from "@/components/onboarding/state-selector";
import { SchoolSelector } from "@/components/onboarding/school-selector";
import { Quiz } from "@/components/onboarding/quiz";
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

  const stepLabels = ["Your State", "Your School", "Swipe Quiz", "Results"];

  return (
    <div className="min-h-screen bg-background mesh-gradient">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-6 lg:px-8">
        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {stepLabels.map((label, i) => {
            // Map display index to step numbers: 0=state, 1=school, 2=quiz, 3(results)=4
            const stepIndex = i === 3 ? 4 : i;
            const isActive = currentStep >= stepIndex || (i === 3 && currentStep >= 3);
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-blue-500 to-teal-500 text-white"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  {label}
                </span>
                {i < 3 && (
                  <div
                    className={`h-px w-8 sm:w-16 transition-all ${
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
        {currentStep === 2 && <Quiz />}
        {currentStep === 3 && <CalculatingScreen />}
        {currentStep === 4 && <QuizResults />}
      </div>
    </div>
  );
}
