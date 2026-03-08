"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePlanStore } from "@/stores/plan-store";
import { searchCareers, getCareersByIds } from "@/lib/actions/career.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { PATHWAY_TYPES, CAREER_CATEGORIES } from "@/lib/constants";
import { formatSalaryRange, formatSalaryTeen, formatGrowthRateTeen } from "@/lib/utils";
import type { CareerWithPathways } from "@/types";
import type { PathwayType } from "@prisma/client";

export function PlanBuilder() {
  const { title, setTitle, careers, addCareer, removeCareer, updatePathway, reorderCareers, refreshCareers } =
    usePlanStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CareerWithPathways[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  // Refresh stale career data (e.g. images added after store was persisted)
  const careerIds = careers.map((c) => c.career.id).join(",");
  useEffect(() => {
    if (!careerIds) return;
    const ids = careerIds.split(",");
    getCareersByIds(ids).then((fresh) => {
      if (fresh.length > 0) usePlanStore.getState().refreshCareers(fresh);
    });
  }, [careerIds]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const found = await searchCareers(query);
      setResults(found.filter((c) => !careers.some((pc) => pc.career.id === c.id)));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, careers]);

  const handleAdd = (career: CareerWithPathways) => {
    const availableTypes = [...new Set(career.pathways.map((p) => p.pathwayType))];
    addCareer(career, availableTypes[0] || ("UNIVERSITY" as PathwayType));
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Plan Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Career Plan"
          className="max-w-md text-lg font-semibold"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <label className="text-sm font-medium mb-1.5 block">Add Careers</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search careers to add..."
            className="pl-9"
          />
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border bg-popover shadow-lg">
            {results.map((career) => (
              <button
                key={career.id}
                onClick={() => handleAdd(career)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <Plus className="h-4 w-4 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{career.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSalaryRange(career.salaryLow, career.salaryHigh)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected careers */}
      {careers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Search and add careers above to start building your plan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {careers.map((entry, index) => {
            const availableTypes = [...new Set(entry.career.pathways.map((p) => p.pathwayType))];
            const catInfo = CAREER_CATEGORIES[entry.career.category];
            const showImage = entry.career.image && entry.career.image.length > 0 && !imgErrors.has(entry.career.id);
            return (
              <div key={entry.career.id} className="flex items-center gap-2">
                {/* Card */}
                <div className="group relative flex-1 rounded-2xl border-2 border-border bg-card shadow-md overflow-hidden">
                  {/* Delete button — top right */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-30 h-7 w-7 rounded-full bg-card/80 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeCareer(entry.career.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Background image */}
                  {showImage && (
                    <div className="absolute z-10 right-4 top-1/2 -translate-y-1/2 hidden sm:block w-28 h-28 sm:w-32 sm:h-32 pointer-events-none">
                      <Image
                        src={entry.career.image!}
                        alt=""
                        fill
                        className="object-contain opacity-70 group-hover:opacity-85 transition-opacity"
                        sizes="128px"
                        onError={() => setImgErrors((prev) => new Set(prev).add(entry.career.id))}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-20 flex items-center gap-3 p-4">
                    {/* Rank badge */}
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${catInfo.gradient} shadow-sm`}>
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={`bg-gradient-to-r ${catInfo.gradient} text-white border-0 text-xs`}
                        >
                          {catInfo.label}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-foreground">{entry.career.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                        <span className="font-semibold">
                          {formatSalaryTeen(entry.career.salaryLow, entry.career.salaryHigh)}
                        </span>
                        <span className="text-muted-foreground">
                          {formatGrowthRateTeen(entry.career.growthRate)}
                        </span>
                      </div>
                      <Select
                        value={entry.selectedPathway}
                        onValueChange={(v) => updatePathway(entry.career.id, v as PathwayType)}
                      >
                        <SelectTrigger className="h-8 w-full sm:w-[180px] text-xs mt-2 rounded-lg bg-card">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTypes.map((type) => (
                            <SelectItem key={type} value={type} className="text-xs">
                              {PATHWAY_TYPES[type]?.label || type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Reorder buttons — right side */}
                <div className="flex flex-col items-center gap-0.5 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-lg border-2"
                    onClick={() => reorderCareers(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-lg border-2"
                    onClick={() => reorderCareers(index, Math.min(careers.length - 1, index + 1))}
                    disabled={index === careers.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
