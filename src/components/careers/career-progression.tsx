import type { CareerProgressionStep } from "@/types";

interface CareerProgressionProps {
  steps: CareerProgressionStep[];
}

export function CareerProgression({ steps }: CareerProgressionProps) {
  return (
    <div className="rounded-2xl bg-card p-8 shadow-lg">
      <h2 className="text-xl font-bold mb-6">Where This Takes You</h2>
      <div className="relative space-y-0">
        {/* Vertical line */}
        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-green-400 via-blue-400 via-purple-400 to-yellow-400" />

        {steps.map((step, index) => (
          <div key={step.level} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Colored dot */}
            <div
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md"
              style={{ backgroundColor: step.color }}
            >
              <span className="text-xs font-bold text-white">{index + 1}</span>
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <h4 className="font-bold text-base">{step.level}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                  {step.years}
                </span>
                <span className="font-semibold text-primary">{step.salary}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
