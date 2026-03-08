"use client";

import { useState } from "react";
import { updateSubjectProgress } from "@/lib/actions/progress.actions";
import { BookOpen } from "lucide-react";

interface SubjectProgress {
  subject: string;
  currentGrade: string | null;
  targetGrade: string | null;
}

interface SubjectTrackerProps {
  planCareerId: string;
  subjects: string[];
  progress: SubjectProgress[];
  rankTarget?: number | null;
}

// Grade ↔ ATAR conversion (approximate, based on Australian averages)
const GRADE_ATAR_MAP: [string, number][] = [
  ["A+", 98],
  ["A",  93],
  ["A-", 88],
  ["B+", 82],
  ["B",  76],
  ["B-", 70],
  ["C+", 64],
  ["C",  58],
  ["C-", 52],
  ["D+", 45],
  ["D",  38],
  ["D-", 30],
];

function atarToGrade(atar: number): string {
  for (const [grade, minAtar] of GRADE_ATAR_MAP) {
    if (atar >= minAtar) return grade;
  }
  return "D-";
}

function gradeToAtar(grade: string): number | null {
  const g = grade.trim().toUpperCase();
  const match = GRADE_ATAR_MAP.find(([label]) => label === g);
  if (match) return match[1];
  // Also handle single-letter grades (A, B, C, D)
  const single = GRADE_ATAR_MAP.find(([label]) => label === g || label.startsWith(g + "+") || label === g);
  if (single) return single[1];
  // Try numeric percentage (e.g. "85" or "85%")
  const num = parseFloat(g.replace("%", ""));
  if (!isNaN(num) && num >= 0 && num <= 100) return num;
  return null;
}

function estimateAtar(grades: Record<string, SubjectProgress>): number | null {
  const scores: number[] = [];
  for (const entry of Object.values(grades)) {
    if (entry.currentGrade) {
      const atar = gradeToAtar(entry.currentGrade);
      if (atar !== null) scores.push(atar);
    }
  }
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function gradeColor(current: string | null, target: string | null) {
  if (!current || !target) return "text-muted-foreground";
  const c = current.toUpperCase();
  const t = target.toUpperCase();
  if (c >= t) return "text-emerald-600 dark:text-emerald-400";
  if (c.charCodeAt(0) - t.charCodeAt(0) <= 1) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function SubjectTracker({
  planCareerId,
  subjects,
  progress,
  rankTarget,
}: SubjectTrackerProps) {
  const defaultTarget = rankTarget ? atarToGrade(rankTarget) : null;

  const [grades, setGrades] = useState<Record<string, SubjectProgress>>(() => {
    const map: Record<string, SubjectProgress> = {};
    for (const sub of subjects) {
      const existing = progress.find((p) => p.subject === sub);
      map[sub] = {
        subject: sub,
        currentGrade: existing?.currentGrade ?? null,
        targetGrade: existing?.targetGrade ?? defaultTarget,
      };
    }
    return map;
  });

  const handleUpdate = async (
    subject: string,
    field: "currentGrade" | "targetGrade",
    value: string
  ) => {
    const updated = {
      ...grades[subject],
      [field]: value || null,
    };
    setGrades((prev) => ({ ...prev, [subject]: updated }));
    if (planCareerId) {
      await updateSubjectProgress(
        planCareerId,
        subject,
        updated.currentGrade,
        updated.targetGrade
      );
    }
  };

  if (subjects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select a pathway to see required subjects.
        </p>
      </div>
    );
  }

  const estimatedAtar = estimateAtar(grades);
  const onTrack = estimatedAtar !== null && rankTarget ? estimatedAtar >= rankTarget : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-sm">
          <BookOpen className="h-4 w-4" />
          Subject Tracker
        </h3>
        {rankTarget && (
          <span className="text-xs text-muted-foreground">
            ATAR target: <strong className="text-blue-600 dark:text-blue-400">{rankTarget}+</strong>
          </span>
        )}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-3 gap-0 bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Subject</span>
          <span className="text-center">Current</span>
          <span className="text-center">Target</span>
        </div>
        {subjects.map((sub) => {
          const g = grades[sub];
          return (
            <div
              key={sub}
              className="grid grid-cols-3 gap-0 px-4 py-2.5 border-t items-center"
            >
              <span className="text-sm font-medium truncate">{sub}</span>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={g?.currentGrade ?? ""}
                  onChange={(e) => handleUpdate(sub, "currentGrade", e.target.value)}
                  placeholder="—"
                  className={`w-16 text-center text-sm font-semibold rounded-lg border bg-transparent px-2 py-1 ${gradeColor(g?.currentGrade ?? null, g?.targetGrade ?? null)}`}
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={g?.targetGrade ?? ""}
                  onChange={(e) => handleUpdate(sub, "targetGrade", e.target.value)}
                  placeholder="—"
                  className="w-16 text-center text-sm font-semibold rounded-lg border bg-transparent px-2 py-1 text-muted-foreground"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated ATAR from current grades */}
      {estimatedAtar !== null && (
        <div className={`rounded-xl p-4 flex items-center justify-between ${
          onTrack
            ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
            : onTrack === false
            ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
            : "bg-muted border"
        }`}>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Estimated ATAR</p>
            <p className={`text-2xl font-bold ${
              onTrack
                ? "text-emerald-600 dark:text-emerald-400"
                : onTrack === false
                ? "text-amber-600 dark:text-amber-400"
                : "text-foreground"
            }`}>
              ~{estimatedAtar}
            </p>
          </div>
          {rankTarget && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {onTrack ? "On track!" : `Need ${rankTarget}+`}
              </p>
              {!onTrack && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {rankTarget - estimatedAtar} points to go
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        ATAR estimate is approximate, based on average grade-to-ATAR conversion.
      </p>
    </div>
  );
}
