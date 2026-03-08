import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

type InterestBarsProps = {
  data: { category: string; count: number; percentage: number }[];
  title?: string;
};

export function InterestBars({ data, title }: InterestBarsProps) {
  if (data.length === 0) return null;

  return (
    <div>
      {title && (
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h4>
      )}
      <div className="space-y-3">
        {data.map(({ category, percentage }) => {
          const catInfo = CAREER_CATEGORIES[category as CareerCategory];
          if (!catInfo) return null;
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{catInfo.label}</span>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${catInfo.gradient} transition-all duration-500`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
