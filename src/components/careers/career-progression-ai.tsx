"use client";

import { useState, useEffect } from "react";
import { getCareerProgression } from "@/lib/actions/career.actions";
import { TrendingUp, Loader2 } from "lucide-react";
import type { CareerProgressionStep } from "@/types";

const STEP_COLORS = [
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-cyan-600",
  "from-teal-500 to-teal-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-orange-500 to-orange-600",
];

interface CareerProgressionAIProps {
  careerTitle: string;
}

export function CareerProgressionAI({ careerTitle }: CareerProgressionAIProps) {
  const [steps, setSteps] = useState<CareerProgressionStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCareerProgression(careerTitle)
      .then(setSteps)
      .finally(() => setLoading(false));
  }, [careerTitle]);

  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Where This Takes You
        </h2>
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          <span className="text-sm text-muted-foreground">Mapping your career path...</span>
        </div>
      </div>
    );
  }

  if (steps.length === 0) return null;

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-8 shadow-md">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Where This Takes You
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Your career journey from day one to the top
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-400 via-teal-400 to-amber-400" />

        <div className="space-y-0">
          {steps.map((step, index) => {
            const colorClass = STEP_COLORS[index % STEP_COLORS.length];
            return (
              <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Numbered dot */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colorClass} shadow-md`}
                >
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl border-2 border-border bg-background p-4 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <h4 className="font-bold text-foreground">{step.level}</h4>
                    <span className="text-lg font-bold gradient-text">{step.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {step.years}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
