"use client";

import Link from "next/link";
import { useQuizStore } from "@/stores/quiz-store";
import { RIASEC_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { RiasecType } from "@/types";

function computeCongruence(
  profile: Record<string, number>,
  careerCode: string
): number {
  const types = careerCode.split('') as RiasecType[];
  const maxPossible = 3 * 1.0 + 3 * 0.5;
  const score = (profile[types[0]] || 0) * 1.0 + (profile[types[1]] || 0) * 0.5;
  return Math.min(score / maxPossible, 1.0);
}

export function RiasecMatchCard({
  careerTitle,
  riasecCode,
}: {
  careerTitle: string;
  riasecCode: string | null;
}) {
  const riasecProfile = useQuizStore((s) => s.riasecProfile);

  if (!riasecCode) return null;

  // No profile yet — show CTA
  if (!riasecProfile) {
    return (
      <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg text-center">
        <p className="font-bold mb-1">Want to see how well you match?</p>
        <p className="text-sm text-muted-foreground mb-4">
          Take the quick career quiz to see your match score for {careerTitle}.
        </p>
        <Button asChild className="btn-gradient rounded-xl">
          <Link href="/onboarding">Take the Quiz</Link>
        </Button>
      </div>
    );
  }

  const congruence = computeCongruence(riasecProfile, riasecCode);
  const matchPercent = Math.round(congruence * 100);

  const types = riasecCode.split('') as RiasecType[];
  const primary = RIASEC_TYPES[types[0]];
  const secondary = RIASEC_TYPES[types[1]];

  return (
    <div className="rounded-2xl bg-card border-2 border-border p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Your Match</h3>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full text-white ${
            matchPercent >= 80
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : matchPercent >= 60
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
              : 'bg-gradient-to-r from-orange-500 to-amber-500'
          }`}
        >
          {matchPercent}% match
        </span>
      </div>

      {/* RIASEC code badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">Career type:</span>
        <div className="flex items-center gap-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: primary.color }}
          >
            {primary.emoji} {primary.teenName}
          </span>
          <span className="text-xs text-muted-foreground">+</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: secondary.color }}
          >
            {secondary.emoji} {secondary.teenName}
          </span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="space-y-2">
        {types.map((type) => {
          const info = RIASEC_TYPES[type];
          const userScore = riasecProfile[type] || 0;
          const pct = Math.round((userScore / 3) * 100);
          return (
            <div key={type} className="flex items-center gap-2">
              <span className="text-sm w-24 truncate">{info.emoji} {info.teenName}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: info.color }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{userScore}/3</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
