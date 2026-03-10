"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CAREER_CATEGORIES } from "@/lib/constants";
import { formatSalaryTeen, formatGrowthRateTeen } from "@/lib/utils";

import type { CareerCategory } from "@prisma/client";

type ParentCareerCardProps = {
  career: {
    slug: string;
    title: string;
    description: string;
    image: string | null;
    category: CareerCategory;
    salaryLow: number;
    salaryHigh: number;
    growthRate: number;
    challenges?: unknown;
    matchScore?: number;
  };
  rank: number;
  popularity?: number;
  matchScore?: number;
};

export function ParentCareerCard({ career, rank, popularity, matchScore }: ParentCareerCardProps) {
  const catInfo = CAREER_CATEGORIES[career.category];
  const challengesData = career.challenges as { pros?: string[] } | null;
  const prosCount = challengesData?.pros?.length || 0;
  const [imgError, setImgError] = useState(false);

  const showImage = career.image && career.image.length > 0 && !imgError;

  return (
    <Link href={`/careers/${career.slug}`} className="block">
      <div className="group relative rounded-2xl border-2 border-border bg-card shadow-md transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer overflow-hidden">
        {/* Background image — positioned inward so white bg blends with the card */}
        {showImage && (
          <div className="absolute right-4 top-2 bottom-2 w-24 sm:w-28 pointer-events-none">
            <Image
              src={career.image!}
              alt=""
              fill
              className="object-contain opacity-70 group-hover:opacity-85 transition-opacity"
              sizes="112px"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {/* Content — always on top */}
        <div className="relative z-20 flex items-center gap-3 p-4">
          {/* Rank badge */}
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${catInfo.gradient} shadow-sm`}>
            <span className="text-white font-bold text-sm">{rank}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="secondary"
                className={`bg-gradient-to-r ${catInfo.gradient} text-white border-0 text-xs`}
              >
                {catInfo.label}
              </Badge>
              {(matchScore ?? career.matchScore) !== undefined && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${
                    (matchScore ?? career.matchScore)! >= 80
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : (matchScore ?? career.matchScore)! >= 60
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500'
                  }`}
                >
                  {matchScore ?? career.matchScore}% match
                </span>
              )}
              {prosCount > 0 && !(matchScore ?? career.matchScore) && (
                <span className="text-xs text-muted-foreground">{prosCount} pros</span>
              )}
            </div>
            <h3 className="text-base font-bold text-foreground">{career.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-[70%]">
              {career.description}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold">
                {formatSalaryTeen(career.salaryLow, career.salaryHigh)}
              </span>
              <span className="text-muted-foreground">
                {formatGrowthRateTeen(career.growthRate)}
              </span>
            </div>
            {popularity !== undefined && popularity > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {popularity} students also exploring this
              </p>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
