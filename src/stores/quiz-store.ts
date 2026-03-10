"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AustralianState } from "@prisma/client";
import type {
  SwipeAnswer,
  QuizResults,
  RiasecSwipeAnswer,
  RiasecProfile,
  RiasecQuizResults,
} from "@/types";

interface QuizState {
  // Step: 0=state, 1=school, 2=riasec quiz, 3=skills, 4=values, 5=calculating, 6=results
  currentStep: number;
  selectedState: AustralianState | null;
  selectedGrade: string | null;
  selectedSchool: { id: string; name: string } | null;
  currentCard: number;
  quizVersion: 'legacy' | 'riasec';

  // Legacy swipe data
  swipeAnswers: SwipeAnswer[];
  results: QuizResults | null;

  // RIASEC data
  riasecAnswers: RiasecSwipeAnswer[];
  riasecProfile: RiasecProfile | null;
  riasecResults: RiasecQuizResults | null;
  workValueRatings: Record<string, number>;

  // Shared
  isLoading: boolean;
  skillRatings: Record<string, number>;
  deepQuizAnswers: Record<number, string[]>;

  setSelectedState: (state: AustralianState) => void;
  setGrade: (grade: string | null) => void;
  setSelectedSchool: (school: { id: string; name: string } | null) => void;
  setCurrentStep: (step: number) => void;
  setCurrentCard: (card: number) => void;
  addSwipeAnswer: (answer: SwipeAnswer) => void;
  addRiasecAnswer: (answer: RiasecSwipeAnswer) => void;
  setResults: (results: QuizResults) => void;
  setRiasecResults: (results: RiasecQuizResults) => void;
  setRiasecProfile: (profile: RiasecProfile) => void;
  setIsLoading: (loading: boolean) => void;
  setSkillRatings: (ratings: Record<string, number>) => void;
  setWorkValueRatings: (ratings: Record<string, number>) => void;
  setDeepQuizAnswers: (answers: Record<number, string[]>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  selectedState: null as AustralianState | null,
  selectedGrade: null as string | null,
  selectedSchool: null as { id: string; name: string } | null,
  currentCard: 0,
  quizVersion: 'riasec' as const,
  swipeAnswers: [] as SwipeAnswer[],
  results: null as QuizResults | null,
  riasecAnswers: [] as RiasecSwipeAnswer[],
  riasecProfile: null as RiasecProfile | null,
  riasecResults: null as RiasecQuizResults | null,
  workValueRatings: {} as Record<string, number>,
  isLoading: false,
  skillRatings: {} as Record<string, number>,
  deepQuizAnswers: {} as Record<number, string[]>,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedState: (state) => set({ selectedState: state, currentStep: 1 }),
      setGrade: (grade) => set({ selectedGrade: grade }),
      setSelectedSchool: (school) => set({ selectedSchool: school }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setCurrentCard: (card) => set({ currentCard: card }),
      addSwipeAnswer: (answer) =>
        set((s) => ({
          swipeAnswers: [...s.swipeAnswers.filter((a) => a.scenarioId !== answer.scenarioId), answer],
        })),
      addRiasecAnswer: (answer) =>
        set((s) => ({
          riasecAnswers: [...s.riasecAnswers.filter((a) => a.scenarioId !== answer.scenarioId), answer],
        })),
      setResults: (results) => set({ results, currentStep: 6 }),
      setRiasecResults: (riasecResults) =>
        set({
          riasecResults,
          // Also set legacy results for backward compat in components that read `results`
          results: {
            topCategories: riasecResults.topCategories,
            matchedCareers: riasecResults.matchedCareers,
            categoryScores: riasecResults.categoryScores,
            vibeLabel: riasecResults.vibeLabel,
          },
          currentStep: 6,
        }),
      setRiasecProfile: (riasecProfile) => set({ riasecProfile }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setSkillRatings: (skillRatings) => set({ skillRatings }),
      setWorkValueRatings: (workValueRatings) => set({ workValueRatings }),
      setDeepQuizAnswers: (deepQuizAnswers) => set({ deepQuizAnswers }),
      reset: () => set(initialState),
    }),
    {
      name: "career-ignite-quiz",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Migrate from legacy store — preserve existing data, add new fields
          return {
            ...persistedState,
            quizVersion: persistedState.swipeAnswers?.length > 0 ? 'legacy' : 'riasec',
            riasecAnswers: [],
            riasecProfile: null,
            riasecResults: null,
            workValueRatings: {},
            // Re-map old step numbers: old step 3(calc)→5, old step 4(results)→6
            currentStep: persistedState.currentStep === 4 ? 6
              : persistedState.currentStep === 3 ? 5
              : persistedState.currentStep,
          };
        }
        return persistedState as QuizState;
      },
    }
  )
);
