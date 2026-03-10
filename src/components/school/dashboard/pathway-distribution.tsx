"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PATHWAY_COLORS: Record<string, string> = {
  UNIVERSITY: "#3b82f6",
  TAFE: "#06b6d4",
  TRADE: "#f97316",
  APPRENTICESHIP: "#10b981",
  SPORTS: "#a855f7",
  ARTS: "#f43f5e",
};

const PATHWAY_LABELS: Record<string, string> = {
  UNIVERSITY: "University",
  TAFE: "TAFE",
  TRADE: "Trade",
  APPRENTICESHIP: "Apprenticeship",
  SPORTS: "Sports Pathway",
  ARTS: "Arts Pathway",
};

interface PathwayDistributionProps {
  pathwayCounts: Record<string, number>;
}

export function PathwayDistribution({ pathwayCounts }: PathwayDistributionProps) {
  const data = Object.entries(pathwayCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      name: PATHWAY_LABELS[type] || type,
      value: count,
      fill: PATHWAY_COLORS[type] || "#94a3b8",
    }));

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No pathway data yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${Number(value)} students`, ""]}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              color: "var(--card-foreground)",
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
