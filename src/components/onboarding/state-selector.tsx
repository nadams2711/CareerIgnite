"use client";

import { useState } from "react";
import { useQuizStore } from "@/stores/quiz-store";
import { AUSTRALIAN_STATES } from "@/lib/constants";
import { MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AustralianState } from "@prisma/client";

const YEAR_LEVELS = [
  { value: "10", label: "Year 10" },
  { value: "11", label: "Year 11" },
  { value: "12", label: "Year 12" },
  { value: "graduate", label: "Just Graduated" },
];

export function StateSelector() {
  const setSelectedState = useQuizStore((s) => s.setSelectedState);
  const [selectedStateLocal, setSelectedStateLocal] = useState<AustralianState | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedStateLocal) {
      useQuizStore.getState().setGrade(selectedGrade);
      setSelectedState(selectedStateLocal);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500">
          <MapPin className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Let&apos;s get to know you</h2>
        <p className="mt-2 text-white/70">
          Pick your state and year level so we can show you the right stuff.
        </p>
      </div>

      {/* State selection */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-3 text-white">Your state</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AUSTRALIAN_STATES.map((state) => (
            <button
              key={state.value}
              onClick={() => setSelectedStateLocal(state.value as AustralianState)}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 bg-card p-5 shadow-md transition-all hover:scale-[1.04] hover:shadow-xl active:scale-95 ${
                selectedStateLocal === state.value
                  ? "border-blue-500 ring-2 ring-blue-500/20 shadow-blue-100"
                  : "border-border"
              }`}
            >
              <span className={`text-2xl font-bold ${selectedStateLocal === state.value ? "gradient-text" : "text-foreground"}`}>
                {state.value}
              </span>
              <span className="text-xs text-muted-foreground text-center">{state.full}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Year level selection */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Your year level
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {YEAR_LEVELS.map((year) => (
            <button
              key={year.value}
              onClick={() => setSelectedGrade(year.value)}
              className={`rounded-2xl border-2 bg-card px-4 py-3 text-sm font-semibold shadow-md transition-all hover:scale-[1.04] hover:shadow-xl active:scale-95 ${
                selectedGrade === year.value
                  ? "border-blue-500 ring-2 ring-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "border-border text-foreground"
              }`}
            >
              {year.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedStateLocal}
        className="w-full btn-gradient rounded-xl h-12 text-base font-semibold"
      >
        Continue
      </Button>
    </div>
  );
}
