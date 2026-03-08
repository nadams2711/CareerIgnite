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

const STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "ACT" },
];

export function SchoolExplorerFilters() {
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
      router.push(`/schools?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = () => {
    router.push("/schools");
  };

  const hasFilters = searchParams.has("search") || searchParams.has("state");

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search schools by name or suburb..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParams("search", e.target.value || null)}
          className="h-12 pl-12 text-base rounded-xl border-2 border-border bg-card"
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={searchParams.get("state") || "all"}
          onValueChange={(v) => updateParams("state", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-full sm:w-[200px] rounded-xl border-2 border-border">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-1 rounded-xl border-2"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
