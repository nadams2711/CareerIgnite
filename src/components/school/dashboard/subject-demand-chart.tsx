"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SubjectDemandChartProps {
  subjectCounts: Record<string, number>;
}

export function SubjectDemandChart({ subjectCounts }: SubjectDemandChartProps) {
  const data = Object.entries(subjectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([subject, count]) => ({ subject, count }));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No subject data yet</p>;
  }

  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="subject" tick={{ fontSize: 11 }} width={80} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.subject}
                fill={entry.count > max * 0.7 ? "#3b82f6" : entry.count > max * 0.3 ? "#06b6d4" : "#94a3b8"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
