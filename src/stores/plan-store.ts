"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PathwayType } from "@prisma/client";
import type { CareerWithPathways, TimelineStep } from "@/types";

interface PlanCareerEntry {
  career: CareerWithPathways;
  selectedPathway: PathwayType;
  priority: number;
}

interface PlanState {
  title: string;
  careers: PlanCareerEntry[];
  timeline: TimelineStep[];
  savedPlanId: string | null;
  planCareerIds: Record<string, string>; // careerId → PlanCareer.id

  setTitle: (title: string) => void;
  addCareer: (career: CareerWithPathways, pathway: PathwayType) => void;
  removeCareer: (careerId: string) => void;
  updatePathway: (careerId: string, pathway: PathwayType) => void;
  reorderCareers: (fromIndex: number, toIndex: number) => void;
  setTimeline: (timeline: TimelineStep[]) => void;
  addTimelineStep: (step: TimelineStep) => void;
  removeTimelineStep: (stepId: string) => void;
  refreshCareers: (freshCareers: CareerWithPathways[]) => void;
  setSavedPlanId: (id: string | null) => void;
  setPlanCareerIds: (ids: Record<string, string>) => void;
  reset: () => void;
}

const initialState = {
  title: "My Career Plan",
  careers: [] as PlanCareerEntry[],
  timeline: [] as TimelineStep[],
  savedPlanId: null as string | null,
  planCareerIds: {} as Record<string, string>,
};

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      ...initialState,
      setTitle: (title) => set({ title }),
      addCareer: (career, selectedPathway) =>
        set((s) => {
          if (s.careers.some((c) => c.career.id === career.id)) return s;
          return {
            careers: [
              ...s.careers,
              { career, selectedPathway, priority: s.careers.length },
            ],
          };
        }),
      removeCareer: (careerId) =>
        set((s) => ({
          careers: s.careers
            .filter((c) => c.career.id !== careerId)
            .map((c, i) => ({ ...c, priority: i })),
        })),
      updatePathway: (careerId, pathway) =>
        set((s) => ({
          careers: s.careers.map((c) =>
            c.career.id === careerId ? { ...c, selectedPathway: pathway } : c
          ),
        })),
      reorderCareers: (fromIndex, toIndex) =>
        set((s) => {
          const newCareers = [...s.careers];
          const [moved] = newCareers.splice(fromIndex, 1);
          newCareers.splice(toIndex, 0, moved);
          return {
            careers: newCareers.map((c, i) => ({ ...c, priority: i })),
          };
        }),
      setTimeline: (timeline) => set({ timeline }),
      addTimelineStep: (step) =>
        set((s) => {
          if (s.timeline.some((t) => t.id === step.id)) return s;
          return { timeline: [...s.timeline, step] };
        }),
      removeTimelineStep: (stepId) =>
        set((s) => ({
          timeline: s.timeline.filter((t) => t.id !== stepId),
        })),
      refreshCareers: (freshCareers) =>
        set((s) => {
          const map = new Map(freshCareers.map((c) => [c.id, c]));
          return {
            careers: s.careers.map((entry) => {
              const fresh = map.get(entry.career.id);
              return fresh ? { ...entry, career: fresh } : entry;
            }),
          };
        }),
      setSavedPlanId: (savedPlanId) => set({ savedPlanId }),
      setPlanCareerIds: (planCareerIds) => set({ planCareerIds }),
      reset: () => set(initialState),
    }),
    {
      name: "career-ignite-plan",
    }
  )
);
