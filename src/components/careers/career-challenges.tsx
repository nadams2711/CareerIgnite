import type { CareerChallengesData } from "@/types";

interface CareerChallengesProps {
  challenges: CareerChallengesData;
}

export function CareerChallenges({ challenges }: CareerChallengesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">The Real Deal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The Good */}
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-6">
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3">
            The Good
          </h3>
          <ul className="space-y-2">
            {challenges.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-emerald-500 shrink-0">+</span>
                <span className="text-foreground">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The Real Talk */}
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-6">
          <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-3">
            The Real Talk
          </h3>
          <ul className="space-y-2">
            {challenges.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-amber-500 shrink-0">!</span>
                <span className="text-foreground">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
