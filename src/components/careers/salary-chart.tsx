"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useTheme } from "next-themes";

interface SalaryChartProps {
  salaryLow: number;
  salaryHigh: number;
}

export function SalaryChart({ salaryLow, salaryHigh }: SalaryChartProps) {
  const { theme } = useTheme();
  const midSalary = Math.round((salaryLow + salaryHigh) / 2);

  const data = [
    { name: "Entry", salary: salaryLow },
    { name: "Average", salary: midSalary },
    { name: "Senior", salary: salaryHigh },
  ];

  const textColor = theme === "dark" ? "#94a3b8" : "#475569";
  const gridColor = theme === "dark" ? "#334155" : "#e2e8f0";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v / 1000}k`}
          />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(Number(value))
            }
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1e293b" : "#fff",
              border: `1px solid ${gridColor}`,
              borderRadius: "8px",
              color: theme === "dark" ? "#f1f5f9" : "#0f172a",
            }}
          />
          <ReferenceLine
            y={85000}
            stroke={gridColor}
            strokeDasharray="3 3"
            label={{ value: "National Avg", fill: textColor, fontSize: 11, position: "right" }}
          />
          <Bar dataKey="salary" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
