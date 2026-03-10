"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendChartsProps {
  trends: {
    period: string;
    studentCount: number;
    interestCounts: Record<string, number>;
  }[];
}

export function TrendCharts({ trends }: TrendChartsProps) {
  if (trends.length < 2) {
    return <p className="text-sm text-muted-foreground text-center py-8">Need 2+ months of data for trends</p>;
  }

  const data = [...trends].reverse().map((t) => ({
    period: t.period,
    students: t.studentCount,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="period" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
