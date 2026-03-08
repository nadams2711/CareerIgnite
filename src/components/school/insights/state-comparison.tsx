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

const SKILL_LABELS: Record<string, string> = {
  math: "Math",
  writing: "Writing",
  creative: "Creative",
  tech: "Tech",
  people: "People",
  "hands-on": "Hands-on",
};

interface StateComparisonProps {
  schoolSkills: Record<string, number>;
  stateSkills: Record<string, number>;
  stateName: string;
}

export function StateComparison({
  schoolSkills,
  stateSkills,
  stateName,
}: StateComparisonProps) {
  const allSkills = new Set([
    ...Object.keys(schoolSkills),
    ...Object.keys(stateSkills),
  ]);

  const data = Array.from(allSkills).map((skill) => ({
    skill: SKILL_LABELS[skill] || skill,
    School: schoolSkills[skill] ? Math.round(schoolSkills[skill] * 10) / 10 : 0,
    [stateName]: stateSkills[skill] ? Math.round(stateSkills[skill] * 10) / 10 : 0,
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No comparison data available
      </p>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="skill"
            tick={{ fontSize: 11 }}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
            formatter={(value) => [`${value}/5`, ""]}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs">{value}</span>
            )}
          />
          <Bar dataKey="School" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
          <Bar dataKey={stateName} fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
