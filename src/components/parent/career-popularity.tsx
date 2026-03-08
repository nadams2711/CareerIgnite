import { Users } from "lucide-react";

type CareerPopularityProps = {
  careers: { title: string; slug: string }[];
  popularity: Record<string, number>;
};

export function CareerPopularity({ careers, popularity }: CareerPopularityProps) {
  const hasData = careers.some((c) => (popularity[c.slug] || 0) > 0);
  if (!hasData) return null;

  return (
    <div className="space-y-2">
      {careers.map((career) => {
        const count = popularity[career.slug] || 0;
        if (count === 0) return null;
        return (
          <div
            key={career.slug}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{career.title}</p>
              <p className="text-xs text-muted-foreground">
                {count} student{count !== 1 ? "s" : ""} across Australia also exploring this
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
