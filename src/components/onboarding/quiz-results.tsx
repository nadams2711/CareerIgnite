"use client";

import Link from "next/link";
import { useQuizStore } from "@/stores/quiz-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Target, Sparkles, Brain } from "lucide-react";
import { SkillsAssessment } from "./skills-assessment";
import { DeepQuiz } from "./deep-quiz";
import { ResultsSummary } from "./results-summary";
import { ParentCareerCard } from "@/components/parent/parent-career-card";
import type { QuizResults as QuizResultsType } from "@/types";

function CareerCards({ results }: { results: QuizResultsType }) {
  return (
    <div className="flex flex-col gap-3">
      {results.matchedCareers.map((career, index) => (
        <ParentCareerCard key={career.id} career={career} rank={index + 1} />
      ))}
    </div>
  );
}

export function QuizResults() {
  const { results, setResults, reset } = useQuizStore();

  if (!results) return null;

  const handleRefine = (newResults: QuizResultsType) => {
    setResults(newResults);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Vibe header */}
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500">
          <Target className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          You&apos;re a <span className="gradient-text">{results.vibeLabel}</span> vibe
        </h2>
        <p className="mt-2 text-white/70">
          Let&apos;s break down what that means for you.
        </p>
      </div>

      {/* ── Step 1: Quiz Insights ── */}
      <div className="mb-10">
        <ResultsSummary
          vibeLabel={results.vibeLabel}
          topCategories={results.topCategories}
        />
      </div>

      {/* ── Step 2: Your Career Matches ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-500">
            <Target className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold text-sm text-white">Your top career matches</h3>
        </div>
        <CareerCards results={results} />
        <p className="mt-3 text-xs text-white/60">
          Tap any career to explore it in detail. Want better matches? Keep going below.
        </p>
      </div>

      {/* ── Step 3: Rate Your Strengths ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Fine-tune with your strengths</h3>
            <p className="text-xs text-white/60">
              Rate yourself honestly — this adjusts your matches based on what you&apos;re actually good at.
            </p>
          </div>
        </div>
        <SkillsAssessment
          categoryScores={results.categoryScores}
          onRefine={handleRefine}
        />
      </div>

      {/* ── Step 4: Deep Dive Quiz ── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Go deeper</h3>
            <p className="text-xs text-white/60">
              15 questions about your interests, work style, and personality for the most accurate results.
            </p>
          </div>
        </div>
        <DeepQuiz
          categoryScores={results.categoryScores}
          onRefine={handleRefine}
        />
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild className="btn-gradient rounded-xl h-11 px-6">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl h-11 px-6 border-white/30 text-white hover:bg-white/10 hover:text-white">
          <Link href="/careers">
            Browse All Careers
          </Link>
        </Button>
        <Button variant="ghost" onClick={reset} className="gap-2 rounded-xl h-11 text-white/70 hover:text-white hover:bg-white/10">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
