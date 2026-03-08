"use client";

import { useState, useEffect } from "react";
import { getUpcomingEvents, type EventResult } from "@/lib/actions/events.actions";
import { usePlanStore } from "@/stores/plan-store";
import { Calendar, MapPin, ExternalLink, Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import type { AustralianState, CareerCategory } from "@prisma/client";
import type { TimelineStep } from "@/types";

interface UpcomingEventsProps {
  state: AustralianState;
  categories: CareerCategory[];
}

const TYPE_COLORS: Record<string, string> = {
  "Career Fair": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "Uni Open Day": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "TAFE Info Session": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "Industry Event": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
};

function eventToTimelineStep(event: EventResult, index: number): TimelineStep {
  return {
    id: `event-${event.title.replace(/\s+/g, "-").toLowerCase()}-${index}`,
    year: event.date,
    title: event.title,
    description: `${event.type} — ${event.location}`,
    type: "transition",
    details: [
      event.description,
      ...(event.url ? [`Register/info: ${event.url}`] : []),
    ],
  };
}

export function UpcomingEvents({ state, categories }: UpcomingEventsProps) {
  const [events, setEvents] = useState<EventResult[]>([]);
  const [loading, setLoading] = useState(true);
  const timeline = usePlanStore((s) => s.timeline);
  const addTimelineStep = usePlanStore((s) => s.addTimelineStep);

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getUpcomingEvents(state, categories)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [state, categories]);

  const handleAddToTimeline = (event: EventResult, index: number) => {
    const step = eventToTimelineStep(event, index);
    addTimelineStep(step);
    toast.success(`"${event.title}" added to your timeline`);
  };

  const isInTimeline = (event: EventResult, index: number) => {
    const stepId = eventToTimelineStep(event, index).id;
    return timeline.some((t) => t.id === stepId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        <span className="text-sm text-muted-foreground">Finding events near you...</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
        <Calendar className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Add careers to your plan to see relevant events.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.map((event, i) => {
        const added = isInTimeline(event, i);
        return (
          <div
            key={i}
            className="rounded-2xl border-2 border-border bg-card p-5 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span
                className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                  TYPE_COLORS[event.type] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {event.type}
              </span>
              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 shrink-0"
                >
                  Visit
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <h4 className="font-bold text-foreground mb-1">{event.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {event.description}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              </div>
              <button
                onClick={() => handleAddToTimeline(event, i)}
                disabled={added}
                className={`flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1.5 transition-all self-start sm:self-auto shrink-0 ${
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
  );
}
