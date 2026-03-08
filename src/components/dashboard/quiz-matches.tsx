"use client";

import { ParentCareerCard } from "@/components/parent/parent-career-card";
import type { CareerWithPathways } from "@/types";

interface QuizMatchesProps {
  careers: CareerWithPathways[];
}

export function QuizMatches({ careers }: QuizMatchesProps) {
  if (careers.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">Your Matches</h2>
      <div className="flex flex-col gap-3">
        {careers.map((career, index) => (
          <ParentCareerCard key={career.id} career={career} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}
