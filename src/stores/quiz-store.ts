"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AustralianState } from "@prisma/client";
import type { SwipeAnswer, QuizResults } from "@/types";

interface QuizState {
  currentStep: number; // 0 = state, 1 = school, 2 = quiz, 3 = calculating, 4 = results
  selectedState: AustralianState | null;
  selectedGrade: string | null;
  selectedSchool: { id: string; name: string } | null;
  currentCard: number; // 0-14
  swipeAnswers: SwipeAnswer[];
  results: QuizResults | null;
  isLoading: boolean;
  skillRatings: Record<string, number>;
  deepQuizAnswers: Record<number, string[]>;

  setSelectedState: (state: AustralianState) => void;
  setGrade: (grade: string | null) => void;
  setSelectedSchool: (school: { id: string; name: string } | null) => void;
  setCurrentStep: (step: number) => void;
  setCurrentCard: (card: number) => void;
  addSwipeAnswer: (answer: SwipeAnswer) => void;
  setResults: (results: QuizResults) => void;
  setIsLoading: (loading: boolean) => void;
  setSkillRatings: (ratings: Record<string, number>) => void;
  setDeepQuizAnswers: (answers: Record<number, string[]>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  selectedState: null as AustralianState | null,
  selectedGrade: null as string | null,
  selectedSchool: null as { id: string; name: string } | null,
  currentCard: 0,
  swipeAnswers: [] as SwipeAnswer[],
  results: null as QuizResults | null,
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
      setResults: (results) => set({ results, currentStep: 4 }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setSkillRatings: (skillRatings) => set({ skillRatings }),
      setDeepQuizAnswers: (deepQuizAnswers) => set({ deepQuizAnswers }),
      reset: () => set(initialState),
    }),
    {
      name: "career-ignite-quiz",
    }
  )
);
