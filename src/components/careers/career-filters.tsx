"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

export function CareerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/careers?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/careers");
  };

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("category") ||
    searchParams.has("salaryMin") ||
    searchParams.has("sort");

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-md">
      {/* Search bar — full width, prominent */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search careers..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParams("search", e.target.value || null)}
          className="pl-12 h-12 text-base rounded-xl border-2 border-border bg-card"
        />
      </div>

      {/* Filter row */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(v) => updateParams("category", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-2 border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(Object.entries(CAREER_CATEGORIES) as [CareerCategory, any][]).map(
              ([key, info]) => (
                <SelectItem key={key} value={key}>
                  {info.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("salaryMin") || "any"}
          onValueChange={(v) => updateParams("salaryMin", v === "any" ? null : v)}
        >
          <SelectTrigger className="w-full sm:w-[150px] rounded-xl border-2 border-border">
            <SelectValue placeholder="Min Salary" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Salary</SelectItem>
            <SelectItem value="60000">$60k+</SelectItem>
            <SelectItem value="80000">$80k+</SelectItem>
            <SelectItem value="100000">$100k+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("sort") || "title"}
          onValueChange={(v) => updateParams("sort", v)}
        >
          <SelectTrigger className="w-full sm:w-[140px] rounded-xl border-2 border-border">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">A - Z</SelectItem>
            <SelectItem value="salary">Salary</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1 rounded-xl border-2">
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
