"use client";

import { useState } from "react";
import {
  getSubjectResources,
  type SubjectResource,
} from "@/lib/actions/plan-suggestions.actions";
import { usePlanStore } from "@/stores/plan-store";
import { BookOpen, ExternalLink, Loader2, Search, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TimelineStep } from "@/types";

interface SubjectResourcesProps {
  subjects: string[];
  targetGrade: string | null;
}

const PROVIDER_COLORS: Record<string, string> = {
  "Khan Academy": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  "Eddie Woo": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  "ATAR Notes": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  Edrolo: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  StudySmarter: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function resourceToTimelineStep(resource: SubjectResource, index: number): TimelineStep {
  return {
    id: `resource-${resource.title.replace(/\s+/g, "-").toLowerCase()}-${index}`,
    year: "Ongoing",
    title: resource.title,
    description: `${resource.provider} — study resource for ${resource.subject}`,
    type: "study",
    details: [
      resource.description,
      ...(resource.url ? [`Access: ${resource.url}`] : []),
    ],
  };
}

export function SubjectResources({ subjects, targetGrade }: SubjectResourcesProps) {
  const [resources, setResources] = useState<SubjectResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeline = usePlanStore((s) => s.timeline);
  const addTimelineStep = usePlanStore((s) => s.addTimelineStep);

  const handleAddToTimeline = (resource: SubjectResource, index: number) => {
    const step = resourceToTimelineStep(resource, index);
    addTimelineStep(step);
    toast.success(`"${resource.title}" added to your timeline`);
  };

  const isInTimeline = (resource: SubjectResource, index: number) => {
    const stepId = resourceToTimelineStep(resource, index).id;
    return timeline.some((t) => t.id === stepId);
  };

  const handleFetch = async () => {
    setLoading(true);
    const results = await getSubjectResources(subjects, targetGrade);
    setResources(results);
    setLoaded(true);
    setLoading(false);
  };

  if (!loaded) {
    return (
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFetch}
          disabled={loading || subjects.length === 0}
          className="gap-2 rounded-xl"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Search className="h-3.5 w-3.5" />
          )}
          {loading ? "Finding resources..." : "Find study resources"}
        </Button>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="mt-4 rounded-xl border-2 border-dashed border-border p-6 text-center">
        <BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No resource suggestions available right now.
        </p>
      </div>
    );
  }

  // Group resources by subject
  const grouped = resources.reduce<Record<string, SubjectResource[]>>(
    (acc, r) => {
      if (!acc[r.subject]) acc[r.subject] = [];
      acc[r.subject].push(r);
      return acc;
    },
    {}
  );

  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <Search className="h-3.5 w-3.5" />
        Study resources for your subjects
      </h4>
      {Object.entries(grouped).map(([subject, items]) => (
        <div key={subject}>
          <h5 className="text-sm font-bold text-foreground mb-2">{subject}</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((resource, i) => {
              const providerColor =
                PROVIDER_COLORS[resource.provider] ??
                "bg-muted text-muted-foreground";
              return (
                <div
                  key={i}
                  className="rounded-xl border-2 border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-bold rounded-full px-2.5 py-1 ${providerColor}`}
                    >
                      {resource.provider}
                    </span>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shrink-0"
                      >
                        Visit
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <h5 className="font-bold text-sm text-foreground mb-1">
                    {resource.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    {resource.description}
                  </p>
                  <button
                    onClick={() => handleAddToTimeline(resource, i)}
                    disabled={isInTimeline(resource, i)}
                    className={`flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 transition-all ${
                      isInTimeline(resource, i)
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {isInTimeline(resource, i) ? (
                      <>
                        <Check className="h-3 w-3" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        Add to Timeline
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
