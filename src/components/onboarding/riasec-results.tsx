"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuizStore } from "@/stores/quiz-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, ChevronDown, Brain } from "lucide-react";
import { RIASEC_TYPES } from "@/lib/constants";
import { ParentCareerCard } from "@/components/parent/parent-career-card";
import { DeepQuiz } from "./deep-quiz";
import type { RiasecType, RiasecQuizResults } from "@/types";

function RiasecRadarChart({ profile }: { profile: Record<RiasecType, number> }) {
  const types: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const maxVal = Math.max(3, ...types.map((t) => profile[t] || 0)); // auto-scale for augmented profiles
  const size = 240;
  const center = size / 2;
  const radius = 72;

  const angles = types.map((_, i) => (Math.PI * 2 * i) / types.length - Math.PI / 2);

  // Outer hexagon points
  const outerPoints = angles
    .map((angle) => `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`)
    .join(' ');

  // Data polygon
  const dataPoints = types
    .map((type, i) => {
      const value = Math.max((profile[type] || 0) / maxVal, 0.05); // min 5% so it's visible
      const r = radius * value;
      return `${center + r * Math.cos(angles[i])},${center + r * Math.sin(angles[i])}`;
    })
    .join(' ');

  // Grid lines at 33%, 66%
  const gridLevels = [0.33, 0.66];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto" overflow="visible">
      {/* Grid */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={angles
            .map((angle) => `${center + radius * level * Math.cos(angle)},${center + radius * level * Math.sin(angle)}`)
            .join(' ')}
          fill="none"
          stroke="currentColor"
          className="text-border"
          strokeWidth="0.5"
        />
      ))}
      <polygon points={outerPoints} fill="none" stroke="currentColor" className="text-border" strokeWidth="1" />

      {/* Axes */}
      {angles.map((angle, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={center + radius * Math.cos(angle)}
          y2={center + radius * Math.sin(angle)}
          stroke="currentColor"
          className="text-border"
          strokeWidth="0.5"
        />
      ))}

      {/* Data fill */}
      <polygon
        points={dataPoints}
        fill="url(#riasecGradient)"
        fillOpacity="0.3"
        stroke="url(#riasecGradient)"
        strokeWidth="2"
      />

      {/* Data points */}
      {types.map((type, i) => {
        const value = Math.max((profile[type] || 0) / maxVal, 0.05);
        const r = radius * value;
        return (
          <circle
            key={type}
            cx={center + r * Math.cos(angles[i])}
            cy={center + r * Math.sin(angles[i])}
            r="3"
            fill={RIASEC_TYPES[type].color}
          />
        );
      })}

      {/* Labels */}
      {types.map((type, i) => {
        const labelR = radius + 28;
        const x = center + labelR * Math.cos(angles[i]);
        const y = center + labelR * Math.sin(angles[i]);
        return (
          <text
            key={type}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-foreground fill-current"
            fontSize="10"
            fontWeight="600"
          >
            {RIASEC_TYPES[type].emoji} {type}
          </text>
        );
      })}

      <defs>
        <linearGradient id="riasecGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TypeCard({ type, score }: { type: RiasecType; score: number }) {
  const info = RIASEC_TYPES[type];
  return (
    <div className="rounded-2xl bg-card border-2 border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{info.emoji}</span>
        <div>
          <p className="font-bold text-sm">{info.teenName}</p>
          <p className="text-xs text-muted-foreground">{info.label}</p>
        </div>
        <span
          className="ml-auto text-xs font-bold px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: info.color }}
        >
          {Math.round(score * 10) / 10}/3
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{info.teenDescription}</p>
    </div>
  );
}

export function RiasecResults() {
  const { riasecResults, riasecProfile, reset, setRiasecResults, setRiasecProfile } = useQuizStore();
  const [showAll, setShowAll] = useState(false);

  if (!riasecResults || !riasecProfile) return null;

  // Get top 2-3 types (use profile from results if available, to reflect deep quiz augmentation)
  const displayProfile = riasecResults.riasecProfile ?? riasecProfile;
  const sortedTypes = (Object.entries(displayProfile) as [RiasecType, number][])
    .sort(([, a], [, b]) => b - a)
    .filter(([, score]) => score > 0)
    .slice(0, 3);

  const visibleCareers = showAll
    ? riasecResults.matchedCareers
    : riasecResults.matchedCareers.slice(0, 5);
  const hasMore = riasecResults.matchedCareers.length > 5;

  const handleRefine = (newResults: RiasecQuizResults) => {
    setRiasecResults(newResults);
    // Update the profile so the radar chart reflects the augmented profile
    if (newResults.riasecProfile) {
      setRiasecProfile(newResults.riasecProfile);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* RIASEC Profile Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 rounded-2xl bg-card border-2 border-border p-6 shadow-lg overflow-visible">
          <RiasecRadarChart profile={displayProfile} />
        </div>
        <h2 className="text-3xl font-bold text-white">
          You&apos;re{' '}
          {riasecResults.riasecCode.split('').map((t) => RIASEC_TYPES[t as RiasecType].emoji).join('')}{' '}
          <span className="gradient-text">
            {riasecResults.riasecLabel}
          </span>
        </h2>
        <p className="mt-2 text-white/70">
          Here&apos;s what that means for your career path.
        </p>
      </div>

      {/* Top type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {sortedTypes.map(([type, score]) => (
          <TypeCard key={type} type={type} score={score} />
        ))}
      </div>

      {/* Top Career Matches */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-white mb-4">
          Your Top Career Matches
        </h3>
        <div className="flex flex-col gap-3">
          {visibleCareers.map((career, index) => (
            <div key={career.id} className="relative">
              <ParentCareerCard career={career} rank={index + 1} />
              {/* Match score badge */}
              <div className="absolute top-3 right-3 z-30">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${
                    career.matchScore >= 80
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : career.matchScore >= 60
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}
                >
                  {career.matchScore}% match
                </span>
              </div>
              {career.matchExplanation && (
                <p className="text-xs text-white/60 mt-1 ml-12 mb-1">
                  {career.matchExplanation}
                </p>
              )}
            </div>
          ))}
        </div>
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 flex items-center gap-1 text-sm text-primary hover:underline mx-auto"
          >
            <ChevronDown className="h-4 w-4" />
            Show {riasecResults.matchedCareers.length - 5} more matches
          </button>
        )}
      </div>

      {/* Deep Dive Refinement */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Want better matches?</h3>
            <p className="text-xs text-white/60">
              15 detailed questions about your interests, work style, and personality.
            </p>
          </div>
        </div>
        <DeepQuiz
          onRefine={handleRefine}
        />
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild className="btn-gradient rounded-xl h-11 px-6">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl h-11 px-6 border-white/30 text-white hover:bg-white/10 hover:text-white">
          <Link href="/careers">
            Browse All Careers
          </Link>
        </Button>
        <Button variant="ghost" onClick={reset} className="gap-2 rounded-xl h-11 text-white/70 hover:text-white hover:bg-white/10">
          <RotateCcw className="h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
