"use client";

import { useState } from "react";
import { updateQualificationStatus } from "@/lib/actions/progress.actions";
import { Award } from "lucide-react";
import type { QualificationStatus } from "@prisma/client";

interface QualProgress {
  title: string;
  status: QualificationStatus;
}

interface QualificationTrackerProps {
  planCareerId: string;
  qualifications: string[];
  progress: QualProgress[];
}

const STATUS_CONFIG: Record<
  QualificationStatus,
  { label: string; bg: string; text: string; next: QualificationStatus }
> = {
  NOT_STARTED: {
    label: "Not Started",
    bg: "bg-muted",
    text: "text-muted-foreground",
    next: "IN_PROGRESS",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-700 dark:text-blue-300",
    next: "COMPLETED",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    next: "NOT_STARTED",
  },
};

export function QualificationTracker({
  planCareerId,
  qualifications,
  progress,
}: QualificationTrackerProps) {
  const [statuses, setStatuses] = useState<Record<string, QualificationStatus>>(
    () => {
      const map: Record<string, QualificationStatus> = {};
      for (const q of qualifications) {
        const existing = progress.find((p) => p.title === q);
        map[q] = existing?.status ?? "NOT_STARTED";
      }
      return map;
    }
  );

  const handleToggle = async (title: string) => {
    const current = statuses[title] ?? "NOT_STARTED";
    const next = STATUS_CONFIG[current].next;
    setStatuses((prev) => ({ ...prev, [title]: next }));
    if (planCareerId) {
      await updateQualificationStatus(planCareerId, title, next);
    }
  };

  if (qualifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-bold text-sm">
        <Award className="h-4 w-4" />
        Qualifications & Certs
      </h3>

      <div className="space-y-2">
        {qualifications.map((qual) => {
          const status = statuses[qual] ?? "NOT_STARTED";
          const config = STATUS_CONFIG[status];
          return (
            <button
              key={qual}
              onClick={() => handleToggle(qual)}
              className="flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all hover:shadow-sm"
            >
              <span className="text-sm font-medium">{qual}</span>
              <span
                className={`text-xs font-semibold rounded-full px-2.5 py-1 ${config.bg} ${config.text}`}
              >
                {config.label}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Tap to cycle status</p>
    </div>
  );
}
