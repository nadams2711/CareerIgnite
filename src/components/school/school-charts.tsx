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
import { useTheme } from "next-themes";

const COLORS = [
  "#3b82f6",
  "#f43f5e",
  "#f97316",
  "#a855f7",
  "#10b981",
  "#06b6d4",
  "#6366f1",
  "#84cc16",
  "#f59e0b",
];

interface SchoolChartsProps {
  interestCounts: Record<string, number>;
  studentCount: number;
}

export function SchoolCharts({
  interestCounts,
  studentCount,
}: SchoolChartsProps) {
  const { theme } = useTheme();

  const data = Object.entries(interestCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count], i) => ({
      name:
        CAREER_CATEGORIES[category as CareerCategory]?.label || category,
      value: count,
      percentage: Math.round((count / studentCount) * 100),
      fill: COLORS[i % COLORS.length],
    }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${Number(value)} students (${Math.round((Number(value) / studentCount) * 100)}%)`,
              name,
            ]}
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
              border: `1px solid ${theme === "dark" ? "#334155" : "#e2e8f0"}`,
              borderRadius: "8px",
              color: theme === "dark" ? "#f1f5f9" : "#0f172a",
            }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
