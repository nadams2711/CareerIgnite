"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchSchools } from "@/lib/actions/school.actions";
import { registerSchoolAdmin } from "@/lib/actions/school-admin.actions";
import type { AustralianState } from "@prisma/client";
import { GraduationCap, Search, CheckCircle2, Loader2, School, ArrowRight, ArrowLeft } from "lucide-react";

const STATES: { value: AustralianState; label: string }[] = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

type SchoolResult = {
  id: string;
  code: string;
  name: string;
  suburb: string;
  state: AustralianState;
};

export function SchoolRegisterForm() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [selectedState, setSelectedState] = useState<AustralianState | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SchoolResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef[0]) clearTimeout(debounceRef[0]);
      if (!selectedState || value.length < 2) {
        setResults([]);
        return;
      }
      debounceRef[0] = setTimeout(async () => {
        setSearching(true);
        const res = await searchSchools(selectedState, value);
        setResults(res);
        setSearching(false);
      }, 300);
    },
    [selectedState, debounceRef],
  );

  const handleSubmit = async () => {
    if (!selectedSchool) return;
    setSubmitting(true);
    setError(null);
    const result = await registerSchoolAdmin(selectedSchool.id);
    if (result.success) {
      await update(); // refresh session with new role
      router.push(`/school/${result.schoolCode}/dashboard`);
    } else {
      setError(result.error || "Registration failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-md">
      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-gradient-to-r from-blue-500 to-teal-500" : s < step ? "w-2 bg-teal-500" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 0: Confirm Role */}
      {step === 0 && (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10">
            <GraduationCap className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">Confirm Your Role</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              School dashboards are designed for school counsellors, career advisors, and administrators.
            </p>
          </div>
          <Button onClick={() => setStep(1)} className="btn-gradient rounded-xl gap-2">
            I&apos;m a school administrator <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Search & Select School */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-center">
            <h2 className="font-heading text-xl font-semibold">Find Your School</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search by school name or suburb
            </p>
          </div>

          <Select
            value={selectedState || ""}
            onValueChange={(v) => {
              setSelectedState(v as AustralianState);
              setResults([]);
              setQuery("");
            }}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedState && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search school name or suburb..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="rounded-xl pl-10"
              />
            </div>
          )}

          {searching && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {results.map((school) => (
                <button
                  key={school.id}
                  onClick={() => {
                    setSelectedSchool(school);
                    setStep(2);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors hover:border-blue-500/50 hover:bg-blue-500/5 ${
                    selectedSchool?.id === school.id ? "border-blue-500 bg-blue-500/5" : "border-border"
                  }`}
                >
                  <School className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.suburb}, {school.state}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && !searching && results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No schools found. Try a different search term.
            </p>
          )}

          <Button variant="ghost" onClick={() => setStep(0)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      )}

      {/* Step 2: Confirm & Submit */}
      {step === 2 && selectedSchool && (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/10">
            <CheckCircle2 className="h-8 w-8 text-teal-500" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">Confirm Registration</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;re registering as admin for:
            </p>
          </div>

          <div className="rounded-xl border-2 border-border bg-background p-4">
            <p className="font-medium">{selectedSchool.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedSchool.suburb}, {selectedSchool.state}
            </p>
          </div>

          <div className="rounded-xl bg-blue-500/5 p-4 text-sm text-muted-foreground">
            You&apos;ll get a <span className="font-semibold text-foreground">14-day free trial</span> of premium analytics. Free tier includes student counts, quiz completion rates, and top interest categories.
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl gap-2">
              <ArrowLeft className="h-4 w-4" /> Change School
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-gradient rounded-xl gap-2"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Register & View Dashboard <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
