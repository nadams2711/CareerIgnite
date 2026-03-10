"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/stores/quiz-store";
import { DEEP_QUIZ_QUESTIONS } from "@/lib/constants";
import { refineRiasecResults } from "@/lib/actions/quiz.actions";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";
import type { RiasecQuizResults } from "@/types";

// ── Visual mappings ──

const CATEGORY_EMOJIS: Record<string, string> = {
  TECHNOLOGY: "\uD83D\uDCBB",
  HEALTH: "\u2764\uFE0F\u200D\uD83E\uDE79",
  TRADES: "\uD83D\uDD27",
  CREATIVE: "\uD83C\uDFA8",
  BUSINESS: "\uD83D\uDCBC",
  EDUCATION: "\uD83D\uDCDA",
  SCIENCE: "\uD83D\uDD2C",
  SPORTS: "\u26BD",
  SERVICES: "\u2615",
};

const CATEGORY_SELECTED_STYLES: Record<string, string> = {
  TECHNOLOGY: "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20",
  HEALTH: "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20",
  TRADES: "border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500/20",
  CREATIVE: "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20",
  BUSINESS: "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20",
  EDUCATION: "border-cyan-500 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/20",
  SCIENCE: "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20",
  SPORTS: "border-lime-500 bg-lime-500/15 text-lime-700 dark:text-lime-300 ring-2 ring-lime-500/20",
  SERVICES: "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20",
};

const SECTION_THEME: Record<string, { emoji: string; color: string; gradient: string }> = {
  "Interests & Activities": { emoji: "\uD83C\uDFAF", color: "text-blue-500", gradient: "from-blue-500 to-violet-500" },
  "Work Style": { emoji: "\u26A1", color: "text-teal-500", gradient: "from-teal-500 to-cyan-500" },
  "School & Skills": { emoji: "\uD83D\uDCDD", color: "text-emerald-500", gradient: "from-emerald-500 to-green-500" },
  "Values & Goals": { emoji: "\u2728", color: "text-amber-500", gradient: "from-amber-500 to-orange-500" },
  "Personality": { emoji: "\uD83E\uDDE0", color: "text-rose-500", gradient: "from-rose-500 to-pink-500" },
};

// ── Circular progress ring ──

function ProgressRing({ current, total }: { current: number; total: number }) {
  const size = 48;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((current + 1) / total) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-foreground">
        {current + 1}/{total}
      </span>
    </div>
  );
}

// ── Main component ──

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
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [animating, setAnimating] = useState(false);

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
  const sectionTheme = SECTION_THEME[currentSection] || SECTION_THEME["Interests & Activities"];

  // Animated question navigation
  const navigateTo = useCallback((next: number, dir: "left" | "right") => {
    if (animating) return;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentQuestion(next);
      setAnimating(false);
    }, 200);
  }, [animating]);

  const handleNext = () => {
    if (!canGoNext || isLast) return;
    navigateTo(currentQuestion + 1, "left");
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    navigateTo(currentQuestion - 1, "right");
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!expanded) return;
      if (e.key === "ArrowRight" && canGoNext && !isLast) handleNext();
      if (e.key === "ArrowLeft" && currentQuestion > 0) handleBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

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

  // Count answered questions
  const answeredCount = Object.keys(answers).length;

  // ── Collapsed: completed state ──
  if (!expanded && hasCompleted) {
    const totalSelected = Object.values(savedAnswers).reduce((sum, opts) => sum + opts.length, 0);
    return (
      <div className="w-full rounded-2xl bg-card border-2 border-border p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Deep dive complete</p>
              <p className="text-xs text-muted-foreground">
                {total} questions, {totalSelected} options selected
              </p>
            </div>
          </div>
          <button
            onClick={handleRedo}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Redo
          </button>
        </div>
      </div>
    );
  }

  // ── Collapsed: CTA state ──
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="group w-full rounded-2xl bg-card border-2 border-border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-400/50 text-left"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">
              {answeredCount > 0
                ? `Continue deep dive (${answeredCount}/${total})`
                : "Take the deep dive quiz"
              }
            </p>
            <p className="text-sm text-muted-foreground">
              15 questions to fine-tune your career matches
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors shrink-0" />
        </div>
        {/* Mini progress bar if partially answered */}
        {answeredCount > 0 && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>
        )}
      </button>
    );
  }

  // ── Expanded: the quiz ──
  return (
    <div className="rounded-2xl bg-card border-2 border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Section gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${sectionTheme.gradient} transition-all duration-500`} />

      <div className="p-6 space-y-5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{sectionTheme.emoji}</span>
            <div>
              <h3 className="font-bold text-foreground text-sm">{currentSection}</h3>
              <p className="text-xs text-muted-foreground">
                Select all that apply
              </p>
            </div>
          </div>
          <ProgressRing current={currentQuestion} total={total} />
        </div>

        {/* Section progress dots */}
        <div className="flex gap-1.5">
          {sections.map((section) => {
            const sectionQs = questions.filter((q) => q.section === section);
            const sectionStart = questions.indexOf(sectionQs[0]);
            const sectionEnd = sectionStart + sectionQs.length - 1;
            const isActive = currentSection === section;
            const isDone = currentQuestion > sectionEnd;
            const theme = SECTION_THEME[section];
            return (
              <div key={section} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                    isDone
                      ? `bg-gradient-to-r ${theme?.gradient || "from-blue-500 to-teal-500"}`
                      : isActive
                      ? "bg-gradient-to-r from-blue-400/60 to-teal-400/60"
                      : "bg-muted"
                  }`}
                />
                <span className={`text-[10px] leading-none transition-colors ${
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {theme?.emoji}
                </span>
              </div>
            );
          })}
        </div>

        {/* Question — animated */}
        <div
          className={`transition-all duration-200 ease-out ${
            animating
              ? slideDir === "left"
                ? "opacity-0 -translate-x-4"
                : "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          <h4 className="text-lg font-bold text-foreground leading-snug mb-1">
            {question.question}
          </h4>
          <p className="text-sm text-muted-foreground">{question.subtitle}</p>
        </div>

        {/* Options — animated with stagger */}
        <div
          className={`flex flex-wrap gap-2.5 transition-all duration-200 ease-out ${
            animating
              ? slideDir === "left"
                ? "opacity-0 -translate-x-4"
                : "opacity-0 translate-x-4"
              : "opacity-100 translate-x-0"
          }`}
        >
          {question.options.map((option, idx) => {
            const isSelected = selectedOptions.includes(option.id);
            const primaryCat = option.categories[0];
            const emoji = CATEGORY_EMOJIS[primaryCat] || "";
            const selectedStyle = CATEGORY_SELECTED_STYLES[primaryCat] || "";

            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`
                  group/opt flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium
                  border-2 transition-all duration-200 cursor-pointer
                  ${isSelected
                    ? selectedStyle
                    : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50 text-foreground"
                  }
                `}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                <span className={`text-base transition-transform duration-200 ${isSelected ? "scale-110" : "group-hover/opt:scale-110"}`}>
                  {emoji}
                </span>
                <span>{option.label}</span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 shrink-0 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selection count hint */}
        <div className="text-xs text-muted-foreground">
          {selectedOptions.length === 0
            ? "Pick at least one to continue"
            : `${selectedOptions.length} selected`
          }
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={currentQuestion === 0 || animating}
            className="gap-1 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {isLast ? (
            <Button
              onClick={handleSubmit}
              disabled={!canGoNext || submitting}
              className="btn-gradient rounded-xl gap-2 px-5"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Refine My Matches
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canGoNext || animating}
              className="btn-gradient rounded-xl gap-1 px-5"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
