"use client";

import { useState } from "react";
import {
  getSkillCourses,
  type CourseSuggestion,
} from "@/lib/actions/plan-suggestions.actions";
import { usePlanStore } from "@/stores/plan-store";
import { GraduationCap, ExternalLink, Loader2, Sparkles, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TimelineStep } from "@/types";

interface SuggestedCoursesProps {
  careerTitle: string;
  skills: string[];
}

const PROVIDER_COLORS: Record<string, string> = {
  Coursera: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  TAFE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Open Universities": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "LinkedIn Learning": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Udemy: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
  "Khan Academy": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
};

function courseToTimelineStep(course: CourseSuggestion, careerTitle: string, index: number): TimelineStep {
  return {
    id: `course-${course.title.replace(/\s+/g, "-").toLowerCase()}-${index}`,
    year: "Anytime",
    title: course.title,
    description: `${course.provider} — builds ${course.skill} for ${careerTitle}`,
    type: "study",
    details: [
      course.description,
      ...(course.url ? [`Enrol/info: ${course.url}`] : []),
    ],
  };
}

export function SuggestedCourses({ careerTitle, skills }: SuggestedCoursesProps) {
  const [courses, setCourses] = useState<CourseSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timeline = usePlanStore((s) => s.timeline);
  const addTimelineStep = usePlanStore((s) => s.addTimelineStep);

  const handleAddToTimeline = (course: CourseSuggestion, index: number) => {
    const step = courseToTimelineStep(course, careerTitle, index);
    addTimelineStep(step);
    toast.success(`"${course.title}" added to your timeline`);
  };

  const isInTimeline = (course: CourseSuggestion, index: number) => {
    const stepId = courseToTimelineStep(course, careerTitle, index).id;
    return timeline.some((t) => t.id === stepId);
  };

  const handleFetch = async () => {
    setLoading(true);
    const results = await getSkillCourses(careerTitle, skills);
    setCourses(results);
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
          disabled={loading || skills.length === 0}
          className="gap-2 rounded-xl"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {loading ? "Finding courses..." : "Suggest extra courses"}
        </Button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="mt-4 rounded-xl border-2 border-dashed border-border p-6 text-center">
        <GraduationCap className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No course suggestions available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Extra courses to boost your skills
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courses.map((course, i) => {
          const providerColor =
            PROVIDER_COLORS[course.provider] ??
            "bg-muted text-muted-foreground";
          const added = isInTimeline(course, i);
          return (
            <div
              key={i}
              className="rounded-xl border-2 border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-bold rounded-full px-2.5 py-1 ${providerColor}`}
                >
                  {course.provider}
                </span>
                {course.url && (
                  <a
                    href={course.url}
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
                {course.title}
              </h5>
              <p className="text-xs text-muted-foreground mb-2">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-block text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                  {course.skill}
                </span>
                <button
                  onClick={() => handleAddToTimeline(course, i)}
                  disabled={added}
                  className={`flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 transition-all ${
                    added
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {added ? (
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
