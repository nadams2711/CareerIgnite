"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, School, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { searchSchools, updateUserSchool } from "@/lib/actions/school.actions";
import { useQuizStore } from "@/stores/quiz-store";

interface SchoolInfo {
  id: string;
  code: string;
  name: string;
  suburb: string;
  state: string;
}

export function SchoolSelector() {
  const selectedState = useQuizStore((s) => s.selectedState);
  const setSelectedSchool = useQuizStore((s) => s.setSelectedSchool);
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SchoolInfo | null>(null);
  const [sharePeers, setSharePeers] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(
    async (q: string) => {
      if (!selectedState || q.length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setIsSearching(true);
      try {
        const schools = await searchSchools(selectedState, q);
        setResults(schools);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    },
    [selectedState],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const handleContinue = async () => {
    if (selected) {
      setSelectedSchool({ id: selected.id, name: selected.name });
      try {
        await updateUserSchool(selected.id, sharePeers);
      } catch {
        // User might not be logged in yet, store for later
      }
    }
    useQuizStore.getState().setCurrentStep(2);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
          <School className="h-7 w-7 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-xl font-bold font-heading text-white">Select Your School</h2>
        <p className="mt-1 text-sm text-white/70">
          Optional — see what peers at your school are interested in.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          placeholder="Type your school name or suburb..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 rounded-xl border-blue-200 focus-visible:ring-blue-500 dark:border-blue-800 bg-card text-card-foreground"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
        )}
      </div>

      <div className="max-h-56 overflow-y-auto space-y-1.5 mb-4 rounded-2xl border border-blue-200 dark:border-blue-800 p-2 bg-card text-card-foreground">
        {query.length < 2 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Type at least 2 characters to search...
          </p>
        ) : isSearching ? (
          <div className="flex items-center justify-center gap-2 py-6">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <span className="text-sm text-muted-foreground">Searching...</span>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No schools found — try a different name or suburb
          </p>
        ) : (
          results.map((school) => (
            <button
              key={school.id}
              onClick={() => setSelected(school)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm transition-all ${
                selected?.id === school.id
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-300 dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-700"
                  : "hover:bg-blue-50 dark:hover:bg-blue-950/30"
              }`}
            >
              {selected?.id === school.id ? (
                <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
              ) : (
                <School className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{school.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {school.suburb}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {selected && (
        <label className="flex items-start gap-3 p-3 rounded-xl border border-blue-200 dark:border-blue-800 mb-4 cursor-pointer bg-card text-card-foreground">
          <input
            type="checkbox"
            checked={sharePeers}
            onChange={(e) => setSharePeers(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <div>
            <p className="text-sm font-medium">Share anonymously with peers</p>
            <p className="text-xs text-muted-foreground">
              See what others at {selected.name} are interested in. No personal
              info shared.
            </p>
          </div>
        </label>
      )}

      <div className="flex gap-3 mt-2">
        <Button
          onClick={handleContinue}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg h-11"
        >
          {selected ? "Continue" : "Skip"}
        </Button>
      </div>
    </div>
  );
}
