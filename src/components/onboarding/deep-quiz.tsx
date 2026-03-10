"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/quiz-store";
import { DEEP_QUIZ_QUESTIONS } from "@/lib/constants";
import { refineRiasecResults } from "@/lib/actions/quiz.actions";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Check,
  RotateCcw,
} from "lucide-react";
import type { RiasecQuizResults } from "@/types";

interface DeepQuizProps {
  onRefine: (newResults: RiasecQuizResults) => void;
}

export function DeepQuiz({ onRefine }: DeepQuizProps) {
  const savedAnswers = useQuizStore((s) => s.deepQuizAnswers);
  const savedSkillRatings = useQuizStore((s) => s.skillRatings);
  const savedWorkValueRatings = useQuizStore((s) => s.workValueRatings);
  const riasecProfile = useQuizStore((s) => s.riasecProfile);
  const setDeepQuizAnswers = useQuizStore((s) => s.setDeepQuizAnswers);
  const hasCompleted = Object.keys(savedAnswers).length === DEEP_QUIZ_QUESTIONS.length;

  const [expanded, setExpanded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>(savedAnswers);
  const [submitting, setSubmitting] = useState(false);

  const questions = DEEP_QUIZ_QUESTIONS;
  const total = questions.length;
  const question = questions[currentQuestion];

  const toggleOption = (optionId: string) => {
    setAnswers((prev) => {
      const current = prev[question.id] || [];
      if (current.includes(optionId)) {
        return { ...prev, [question.id]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [question.id]: [...current, optionId] };
    });
  };

  const selectedOptions = answers[question?.id] || [];
  const canGoNext = selectedOptions.length > 0;
  const isLast = currentQuestion === total - 1;

  const sections = [...new Set(questions.map((q) => q.section))];
  const currentSection = question?.section;

  const handleSubmit = async () => {
    if (!riasecProfile) return;
    setSubmitting(true);
    try {
      const detailedAnswers = Object.entries(answers).map(([qId, opts]) => ({
        questionId: parseInt(qId),
        selectedOptions: opts,
      }));
      setDeepQuizAnswers(answers);
      const refined = await refineRiasecResults(
        riasecProfile,
        detailedAnswers,
        savedSkillRatings,
        savedWorkValueRatings
      );
      onRefine(refined);
      setExpanded(false);
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  };

  const handleRedo = () => {
    setAnswers(savedAnswers);
    setCurrentQuestion(0);
    setExpanded(true);
  };

  // Collapsed state
  if (!expanded) {
    if (hasCompleted) {
      // Count total options selected
      const totalSelected = Object.values(savedAnswers).reduce((sum, opts) => sum + opts.length, 0);
      return (
        <div className="w-full rounded-2xl bg-card border-2 border-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <Check className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Deep dive quiz completed</p>
                <p className="text-xs text-muted-foreground">
                  {total} questions answered, {totalSelected} options selected
                </p>
              </div>
            </div>
            <button onClick={handleRedo} className="flex items-center gap-1 text-xs text-primary hover:underline">
              <RotateCcw className="h-3 w-3" />
              Redo
            </button>
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
            <p className="font-bold text-sm">Take the deep dive quiz</p>
            <p className="text-sm text-muted-foreground">
              15 detailed questions to really nail your career matches
            </p>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        </div>
      </button>
    );
  }

  // Expanded state — the quiz
  return (
    <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">Deep Dive Quiz</h3>
          <p className="text-xs text-muted-foreground">{currentSection}</p>
        </div>
        <button onClick={() => setExpanded(false)}>
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Section progress */}
      <div className="flex gap-1">
        {sections.map((section) => {
          const sectionQs = questions.filter((q) => q.section === section);
          const sectionStart = questions.indexOf(sectionQs[0]);
          const sectionEnd = sectionStart + sectionQs.length - 1;
          const isActive = currentSection === section;
          const isDone = currentQuestion > sectionEnd;
          return (
            <div
              key={section}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                isDone
                  ? "bg-gradient-to-r from-blue-500 to-teal-500"
                  : isActive
                  ? "bg-blue-300"
                  : "bg-muted"
              }`}
            />
          );
        })}
      </div>

      {/* Question */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          Question {currentQuestion + 1} of {total}
        </p>
        <h4 className="text-base font-bold mb-1">{question.question}</h4>
        <p className="text-sm text-muted-foreground">{question.subtitle}</p>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`rounded-xl px-3 py-2 text-sm font-medium border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "border-border bg-card hover:border-blue-300 text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentQuestion((q) => q - 1)}
          disabled={currentQuestion === 0}
          className="gap-1 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={!canGoNext || submitting}
            className="btn-gradient rounded-xl gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Refine My Career Matches
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion((q) => q + 1)}
            disabled={!canGoNext}
            className="btn-gradient rounded-xl gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
