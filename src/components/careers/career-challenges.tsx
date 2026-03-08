import type { CareerChallengesData } from "@/types";

interface CareerChallengesProps {
  challenges: CareerChallengesData;
}

export function CareerChallenges({ challenges }: CareerChallengesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">The Real Deal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* The Good */}
        <div className="rounded-2xl bg-card border-2 border-emerald-300 p-6 shadow-md">
          <h3 className="text-lg font-bold text-emerald-600 mb-3">
            The Good
          </h3>
          <ul className="space-y-2">
            {challenges.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-emerald-500 shrink-0">+</span>
                <span className="text-card-foreground">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The Real Talk */}
        <div className="rounded-2xl bg-card border-2 border-amber-300 p-6 shadow-md">
          <h3 className="text-lg font-bold text-amber-600 mb-3">
            The Real Talk
          </h3>
          <ul className="space-y-2">
            {challenges.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-amber-500 shrink-0">!</span>
                <span className="text-card-foreground">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
