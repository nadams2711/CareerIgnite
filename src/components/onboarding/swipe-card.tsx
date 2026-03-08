"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  emoji: string;
  text: string;
  onSwipe: (liked: boolean) => void;
  cardNumber: number;
  totalCards: number;
}

export function SwipeCard({ emoji, text, onSwipe, cardNumber, totalCards }: SwipeCardProps) {
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);

  const handleSwipe = (liked: boolean) => {
    setSwiping(liked ? "right" : "left");
    setTimeout(() => onSwipe(liked), 250);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Progress */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/70">
            {cardNumber} of {totalCards}
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round((cardNumber / totalCards) * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
            style={{ width: `${(cardNumber / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={cn(
          "relative w-full max-w-sm rounded-3xl bg-card border-0 shadow-xl p-8 transition-all duration-250",
          swiping === "right" && "translate-x-[120%] rotate-12 opacity-0",
          swiping === "left" && "-translate-x-[120%] -rotate-12 opacity-0",
          !swiping && "translate-x-0 rotate-0 opacity-100"
        )}
      >
        <div className="text-center">
          <span className="text-6xl mb-4 block">{emoji}</span>
          <p className="text-xl font-bold leading-relaxed mt-4">
            &quot;{text}&quot;
          </p>
        </div>
      </div>

      {/* Swipe buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => handleSwipe(false)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl shadow-lg transition-all hover:scale-110 hover:bg-muted/80 active:scale-95"
          aria-label="Not me"
        >
          <span role="img" aria-label="nah">😴</span>
        </button>
        <span className="text-sm text-white/60 font-medium">or</span>
        <button
          onClick={() => handleSwipe(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-3xl shadow-lg transition-all hover:scale-110 active:scale-95"
          aria-label="That's me"
        >
          <span role="img" aria-label="fire">🔥</span>
        </button>
      </div>

      <div className="flex items-center gap-8 text-sm text-white/70">
        <span>Nah</span>
        <span>That&apos;s me!</span>
      </div>
    </div>
  );
}
