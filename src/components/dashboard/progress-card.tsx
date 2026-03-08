import { CheckCircle, Circle } from "lucide-react";

interface ProgressCardProps {
  hasState: boolean;
  hasPlans: boolean;
  quizCompleted: boolean;
}

export function ProgressCard({ hasState, hasPlans, quizCompleted }: ProgressCardProps) {
  const steps = [
    { label: "Quiz done", done: quizCompleted },
    { label: "State set", done: hasState },
    { label: "Plan started", done: hasPlans },
  ];

  const completed = steps.filter((s) => s.done).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">Your progress</span>
        <span className="text-sm font-bold text-primary">{progress}% explored</span>
      </div>
      <div className="h-3 w-full rounded-full bg-muted overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex flex-nowrap gap-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-1 text-xs whitespace-nowrap">
            {step.done ? (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={step.done ? "text-foreground font-medium" : "text-muted-foreground"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
