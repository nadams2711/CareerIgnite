"use client";

import { useState, useCallback } from "react";
import { usePlanStore } from "@/stores/plan-store";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Plus, X } from "lucide-react";

const typeConfig = {
  school: {
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    emoji: "\uD83D\uDCDA",
  },
  transition: {
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    emoji: "\uD83D\uDD04",
  },
  study: {
    gradient: "from-emerald-500 to-cyan-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    emoji: "\uD83C\uDF93",
  },
  work: {
    gradient: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-700 dark:text-indigo-300",
    emoji: "\uD83D\uDCBC",
  },
};

// Persist checked items to localStorage
const STORAGE_KEY = "career-ignite-timeline-checks";

function loadChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveChecks(checks: Record<string, boolean>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
}

// Persist custom actions to localStorage
const CUSTOM_KEY = "career-ignite-timeline-custom";

function loadCustomActions(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CUSTOM_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveCustomActions(actions: Record<string, string[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(actions));
}

export function Timeline() {
  const timeline = usePlanStore((s) => s.timeline);
  const [checks, setChecks] = useState<Record<string, boolean>>(loadChecks);
  const [customActions, setCustomActions] = useState<Record<string, string[]>>(loadCustomActions);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newAction, setNewAction] = useState("");

  const toggleCheck = useCallback((key: string) => {
    setChecks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveChecks(updated);
      return updated;
    });
  }, []);

  const handleAddAction = useCallback((stepId: string) => {
    const text = newAction.trim();
    if (!text) return;
    setCustomActions((prev) => {
      const updated = { ...prev, [stepId]: [...(prev[stepId] ?? []), text] };
      saveCustomActions(updated);
      return updated;
    });
    setNewAction("");
    setAddingTo(null);
  }, [newAction]);

  const handleRemoveCustom = useCallback((stepId: string, index: number) => {
    setCustomActions((prev) => {
      const list = [...(prev[stepId] ?? [])];
      list.splice(index, 1);
      const updated = { ...prev, [stepId]: list };
      saveCustomActions(updated);
      return updated;
    });
  }, []);

  if (timeline.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Add careers and tap &quot;Map My Journey&quot; to see your pathway here.
        </p>
      </div>
    );
  }

  // Calculate overall progress
  const allKeys: string[] = [];
  for (const step of timeline) {
    if (step.details) {
      for (let i = 0; i < step.details.length; i++) {
        allKeys.push(`${step.id}-${i}`);
      }
    }
    const custom = customActions[step.id] ?? [];
    for (let i = 0; i < custom.length; i++) {
      allKeys.push(`${step.id}-custom-${i}`);
    }
  }
  const totalActions = allKeys.length;
  const completedActions = allKeys.filter((k) => checks[k]).length;
  const progress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Overall progress */}
      {totalActions > 0 && (
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {completedActions} of {totalActions} actions completed
            </span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline steps */}
      <div className="relative space-y-0">
        {/* Vertical gradient line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-emerald-400 to-indigo-400" />

        {timeline.map((step) => {
          const config = typeConfig[step.type];
          const custom = customActions[step.id] ?? [];

          // Per-step progress
          const stepKeys: string[] = [];
          if (step.details) {
            for (let i = 0; i < step.details.length; i++) stepKeys.push(`${step.id}-${i}`);
          }
          for (let i = 0; i < custom.length; i++) stepKeys.push(`${step.id}-custom-${i}`);
          const stepDone = stepKeys.filter((k) => checks[k]).length;
          const stepTotal = stepKeys.length;
          const stepComplete = stepTotal > 0 && stepDone === stepTotal;

          return (
            <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
              {/* Gradient dot */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md",
                  stepComplete
                    ? "bg-emerald-500"
                    : `bg-gradient-to-br ${config.gradient}`
                )}
              >
                <span className="text-sm">{stepComplete ? "\u2713" : config.emoji}</span>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "text-xs font-semibold rounded-full px-2.5 py-0.5",
                      config.bg,
                      config.text
                    )}
                  >
                    {step.year}
                  </span>
                  {stepTotal > 0 && (
                    <span className="text-[10px] text-muted-foreground">
                      {stepDone}/{stepTotal}
                    </span>
                  )}
                </div>
                <h4 className="font-bold">{step.title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>

                {/* Checkable action items */}
                {step.details && step.details.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {step.details.map((detail, i) => {
                      const key = `${step.id}-${i}`;
                      const checked = !!checks[key];
                      return (
                        <li key={i}>
                          <button
                            onClick={() => toggleCheck(key)}
                            className="flex items-start gap-2.5 text-sm w-full text-left group"
                          >
                            {checked ? (
                              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                            <span className={checked ? "line-through text-muted-foreground" : "text-foreground"}>
                              {detail}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    {/* Custom actions for this step */}
                    {custom.map((action, i) => {
                      const key = `${step.id}-custom-${i}`;
                      const checked = !!checks[key];
                      return (
                        <li key={`custom-${i}`} className="flex items-start gap-2.5 text-sm group">
                          <button
                            onClick={() => toggleCheck(key)}
                            className="flex items-start gap-2.5 flex-1 text-left"
                          >
                            {checked ? (
                              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                            <span className={checked ? "line-through text-muted-foreground" : "text-foreground"}>
                              {action}
                            </span>
                          </button>
                          <button
                            onClick={() => handleRemoveCustom(step.id, i)}
                            className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Add custom action */}
                {addingTo === step.id ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddAction(step.id)}
                      placeholder="Add an action..."
                      autoFocus
                      className="flex-1 text-sm rounded-lg border bg-transparent px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      onClick={() => handleAddAction(step.id)}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingTo(null); setNewAction(""); }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTo(step.id)}
                    className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
