"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Heart,
  Wrench,
  Palette,
  Briefcase,
  GraduationCap,
  FlaskConical,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";
import { formatSalaryTeen, formatGrowthRateTeen } from "@/lib/utils";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerWithPathways } from "@/types";
import type { CareerCategory } from "@prisma/client";

const CATEGORY_ICONS: Record<CareerCategory, React.ComponentType<{ className?: string }>> = {
  TECHNOLOGY: Monitor,
  HEALTH: Heart,
  TRADES: Wrench,
  CREATIVE: Palette,
  BUSINESS: Briefcase,
  EDUCATION: GraduationCap,
  SCIENCE: FlaskConical,
  SPORTS: Dumbbell,
  SERVICES: UtensilsCrossed,
};

export function CareerCard({ career }: { career: CareerWithPathways }) {
  const categoryInfo = CAREER_CATEGORIES[career.category];
  const IconComponent = CATEGORY_ICONS[career.category];
  const [imgError, setImgError] = useState(false);
  const showImage = career.image && career.image.length > 0 && !imgError;

  return (
    <Link href={`/careers/${career.slug}`} className="block">
      <div className="group h-full rounded-2xl border-2 border-border bg-card shadow-md overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
        {/* Colored top border */}
        <div className={`h-1.5 bg-gradient-to-r ${categoryInfo.gradient}`} />

        {/* Career image — white background */}
        <div className="relative h-48 bg-white overflow-hidden">
          {showImage && (
            <Image
              src={career.image!}
              alt={career.title}
              fill
              className="object-contain object-center p-4"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          )}
          <Badge
            variant="secondary"
            className={`absolute bottom-2 left-2 text-[10px] gap-1 bg-gradient-to-r ${categoryInfo.gradient} text-white border-0`}
          >
            <IconComponent className="h-3 w-3" />
            {categoryInfo.label}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 border-t border-border">
          <h3 className="text-base font-bold group-hover:text-primary transition-colors">
            {career.title}
          </h3>
          <div className="flex items-center gap-3 text-sm mt-1.5">
            <span className="font-semibold text-foreground">
              {formatSalaryTeen(career.salaryLow, career.salaryHigh)}
            </span>
            <span className="text-muted-foreground">
              {formatGrowthRateTeen(career.growthRate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
