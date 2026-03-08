import Link from "next/link";
import { Lightbulb } from "lucide-react";

interface SuggestedActionsProps {
  hasState: boolean;
  quizCompleted: boolean;
  hasPlans: boolean;
}

export function SuggestedActions({ hasState, quizCompleted, hasPlans }: SuggestedActionsProps) {
  let suggestion = "";
  let href = "/onboarding";

  if (!hasState) {
    suggestion = "Start by selecting your state to get personalised pathways";
    href = "/onboarding";
  } else if (!quizCompleted) {
    suggestion = "Take the 30-second swipe quiz to discover your career vibe";
    href = "/onboarding";
  } else if (!hasPlans) {
    suggestion = "Build a roadmap with your top career picks";
    href = "/plan";
  } else {
    suggestion = "Explore more careers or retake the quiz to discover new matches";
    href = "/careers";
  }

  return (
    <Link href={href}>
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-800 p-5 shadow-md transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm mb-0.5">What&apos;s Next?</p>
          <p className="text-sm text-muted-foreground">{suggestion}</p>
        </div>
      </div>
    </Link>
  );
}
