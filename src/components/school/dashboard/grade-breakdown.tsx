"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

const TOP_COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f97316", "#a855f7"];

interface GradeBreakdownProps {
  gradeCounts: Record<string, Record<string, number>>;
}

export function GradeBreakdown({ gradeCounts }: GradeBreakdownProps) {
  const grades = Object.keys(gradeCounts).sort();
  if (grades.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No grade data yet</p>;
  }

  // Find top 5 categories across all grades
  const allCats: Record<string, number> = {};
  for (const cats of Object.values(gradeCounts)) {
    for (const [cat, count] of Object.entries(cats)) {
      allCats[cat] = (allCats[cat] || 0) + count;
    }
  }
  const topCats = Object.entries(allCats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cat]) => cat);

  const data = grades.map((grade) => {
    const row: Record<string, string | number> = { grade };
    for (const cat of topCats) {
      row[cat] = gradeCounts[grade]?.[cat] || 0;
    }
    return row;
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="grade" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Legend formatter={(value) => (
            <span className="text-xs">
              {CAREER_CATEGORIES[value as CareerCategory]?.label || value}
            </span>
          )} />
          {topCats.map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={TOP_COLORS[i % TOP_COLORS.length]}
              radius={i === topCats.length - 1 ? [4, 4, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
