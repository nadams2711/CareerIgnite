import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp } from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";
import type { SchoolExplorerItem } from "@/types";

interface SchoolCardProps {
  school: SchoolExplorerItem;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const topInterestLabel = school.topInterest
    ? CAREER_CATEGORIES[school.topInterest as CareerCategory]?.label ||
      school.topInterest
    : null;

  return (
    <Link href={`/school/${school.code}/insights`}>
      <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-md transition-all hover:shadow-lg hover:border-primary/30">
        <div className="mb-3">
          <h3 className="font-heading text-base font-bold truncate">
            {school.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {school.suburb}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {school.state}
          </Badge>
          {school.hasInsights && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{school.studentCount} students</span>
            </div>
          )}
        </div>

        {school.hasInsights && topInterestLabel ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
            <span>Top interest: {topInterestLabel}</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Not enough data yet
          </p>
        )}
      </div>
    </Link>
  );
}
