"use client";

const SKILL_LABELS: Record<string, string> = {
  math: "Mathematics",
  writing: "Writing",
  creative: "Creative Thinking",
  tech: "Technology",
  people: "People Skills",
  "hands-on": "Hands-on",
};

interface SkillStrengthsWeaknessesProps {
  strengths: { skill: string; avg: number }[];
  weaknesses: { skill: string; avg: number }[];
}

export function SkillStrengthsWeaknesses({
  strengths,
  weaknesses,
}: SkillStrengthsWeaknessesProps) {
  if (strengths.length === 0 && weaknesses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No skill data yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* Strengths */}
      <div>
        <h4 className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs">
            +
          </span>
          Strengths
        </h4>
        {strengths.length > 0 ? (
          <div className="space-y-2">
            {strengths.map(({ skill, avg }) => (
              <div
                key={skill}
                className="flex items-center justify-between rounded-xl border-2 border-emerald-200 bg-emerald-50 px-3 py-2.5"
              >
                <span className="text-sm font-medium text-emerald-800">
                  {SKILL_LABELS[skill] || skill}
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  {avg.toFixed(1)}/5
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No strong skills identified
          </p>
        )}
      </div>

      {/* Weaknesses */}
      <div>
        <h4 className="text-sm font-semibold text-amber-600 mb-3 flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs">
            !
          </span>
          Areas for Growth
        </h4>
        {weaknesses.length > 0 ? (
          <div className="space-y-2">
            {weaknesses.map(({ skill, avg }) => (
              <div
                key={skill}
                className="flex items-center justify-between rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5"
              >
                <span className="text-sm font-medium text-amber-800">
                  {SKILL_LABELS[skill] || skill}
                </span>
                <span className="text-sm font-bold text-amber-700">
                  {avg.toFixed(1)}/5
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No weak areas identified
          </p>
        )}
      </div>
    </div>
  );
}
