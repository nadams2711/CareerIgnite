"use client";

interface EngagementMetricsProps {
  stats: {
    totalRegistered: number;
    quizCompleted: number;
    planCreated: number;
  };
}

export function EngagementMetrics({ stats }: EngagementMetricsProps) {
  const steps = [
    { label: "Registered", count: stats.totalRegistered, color: "bg-blue-500" },
    { label: "Quiz Completed", count: stats.quizCompleted, color: "bg-cyan-500" },
    { label: "Plan Created", count: stats.planCreated, color: "bg-teal-500" },
  ];

  const max = Math.max(stats.totalRegistered, 1);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const pct = Math.round((step.count / max) * 100);
        const conversionFromPrev =
          i > 0 && steps[i - 1].count > 0
            ? Math.round((step.count / steps[i - 1].count) * 100)
            : null;

        return (
          <div key={step.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">{step.label}</span>
              <span className="text-muted-foreground">
                {step.count}
                {conversionFromPrev !== null && (
                  <span className="ml-1 text-muted-foreground">
                    ({conversionFromPrev}% conversion)
                  </span>
                )}
              </span>
            </div>
            <div className="h-6 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${step.color} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
