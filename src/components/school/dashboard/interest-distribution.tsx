"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

const COLORS = [
  "#3b82f6", "#f43f5e", "#f97316", "#a855f7", "#10b981",
  "#06b6d4", "#6366f1", "#84cc16", "#f59e0b",
];

interface InterestDistributionProps {
  interestCounts: Record<string, number>;
  studentCount: number;
}

export function InterestDistribution({ interestCounts, studentCount }: InterestDistributionProps) {
  const data = Object.entries(interestCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count], i) => ({
      name: CAREER_CATEGORIES[category as CareerCategory]?.label || category,
      value: count,
      percentage: studentCount > 0 ? Math.round((count / studentCount) * 100) : 0,
      fill: COLORS[i % COLORS.length],
    }));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No interest data yet</p>;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${Number(value)} students (${studentCount > 0 ? Math.round((Number(value) / studentCount) * 100) : 0}%)`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
