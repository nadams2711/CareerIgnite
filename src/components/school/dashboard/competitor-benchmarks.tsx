"use client";

import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

interface CompetitorBenchmarksProps {
  competitors: {
    name: string;
    suburb: string;
    studentCount: number;
    topInterest: { category: string; percentage: number } | null;
  }[];
  schoolName: string;
}

export function CompetitorBenchmarks({ competitors, schoolName }: CompetitorBenchmarksProps) {
  if (competitors.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No competitor data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="py-2 text-left font-medium text-muted-foreground">School</th>
            <th className="py-2 text-left font-medium text-muted-foreground">Suburb</th>
            <th className="py-2 text-right font-medium text-muted-foreground">Students</th>
            <th className="py-2 text-right font-medium text-muted-foreground">Top Interest</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c) => (
            <tr key={c.name} className="border-b border-border/50">
              <td className="py-2 font-medium">{c.name}</td>
              <td className="py-2 text-muted-foreground">{c.suburb}</td>
              <td className="py-2 text-right">{c.studentCount}</td>
              <td className="py-2 text-right">
                {c.topInterest ? (
                  <span className="text-xs">
                    {CAREER_CATEGORIES[c.topInterest.category as CareerCategory]?.label || c.topInterest.category}{" "}
                    ({c.topInterest.percentage}%)
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
