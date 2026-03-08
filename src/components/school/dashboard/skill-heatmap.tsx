"use client";

interface SkillHeatmapProps {
  skillAvgs: Record<string, number>;
}

function getHeatColor(value: number): string {
  if (value >= 4) return "bg-teal-500 text-white";
  if (value >= 3) return "bg-cyan-500 text-white";
  if (value >= 2) return "bg-blue-400 text-white";
  return "bg-slate-300 text-slate-700";
}

export function SkillHeatmap({ skillAvgs }: SkillHeatmapProps) {
  const skills = Object.entries(skillAvgs).sort(([, a], [, b]) => b - a);

  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No skill data yet</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {skills.map(([skill, avg]) => (
        <div
          key={skill}
          className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${getHeatColor(avg)}`}
        >
          <span className="text-xs font-medium capitalize truncate mr-2">{skill}</span>
          <span className="text-sm font-bold">{avg.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
