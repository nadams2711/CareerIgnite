"use client";

import { useState, useEffect } from "react";
import { getLocalCompanies, type CompanyResult } from "@/lib/actions/events.actions";
import { Building2, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AustralianState, CareerCategory } from "@prisma/client";

interface LocalCompaniesProps {
  state: AustralianState;
  categories: CareerCategory[];
}

export function LocalCompanies({ state, categories }: LocalCompaniesProps) {
  const [companies, setCompanies] = useState<CompanyResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categories.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getLocalCompanies(state, categories)
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, [state, categories]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        <span className="text-sm text-muted-foreground">Finding local employers...</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
        <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Add careers to your plan to see local employers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {companies.map((company, i) => (
        <div
          key={i}
          className="rounded-2xl border-2 border-border bg-card p-5 shadow-md transition-all hover:shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-foreground">{company.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {company.description}
              </p>
              {company.categories && company.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {company.categories.map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Visit website
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
