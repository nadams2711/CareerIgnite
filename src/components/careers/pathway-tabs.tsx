"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, BookOpen, Clock, MapPin, CheckCircle } from "lucide-react";
import { AUSTRALIAN_STATES, PATHWAY_TYPES } from "@/lib/constants";
import type { StatePathway, AustralianState, PathwayType } from "@prisma/client";

interface PathwayTabsProps {
  pathways: StatePathway[];
  defaultState?: AustralianState;
}

export function PathwayTabs({ pathways, defaultState }: PathwayTabsProps) {
  const [selectedState, setSelectedState] = useState<AustralianState>(
    defaultState || "NSW"
  );

  const filteredPathways = pathways.filter((p) => p.state === selectedState);
  const availableTypes = [...new Set(filteredPathways.map((p) => p.pathwayType))];

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <Select
          value={selectedState}
          onValueChange={(v) => setSelectedState(v as AustralianState)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUSTRALIAN_STATES.map((state) => (
              <SelectItem key={state.value} value={state.value}>
                {state.full}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">Change state</span>
      </div>

      {availableTypes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Pathway data for {selectedState} is coming soon.
          </p>
        </div>
      ) : (
        <Tabs defaultValue={availableTypes[0]} className="w-full">
          <TabsList className="mb-4 flex-wrap h-auto gap-1 bg-muted">
            {availableTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                {PATHWAY_TYPES[type]?.label || type}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableTypes.map((type) => {
            const pathway = filteredPathways.find((p) => p.pathwayType === type);
            if (!pathway) return null;
            const institutions = Array.isArray(pathway.institutions)
              ? (pathway.institutions as string[])
              : [];

            return (
              <TabsContent key={type} value={type} className="space-y-4">
                {pathway.subjects.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <BookOpen className="h-4 w-4" />
                      Recommended Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pathway.subjects.map((subject) => (
                        <Badge key={subject} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {pathway.rankTarget && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
                      <GraduationCap className="h-4 w-4" />
                      ATAR Target
                    </h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {pathway.rankTarget}+
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-1">
                    <Clock className="h-4 w-4" />
                    Duration
                  </h4>
                  <p className="text-sm text-muted-foreground">{pathway.duration}</p>
                </div>

                {institutions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Institutions</h4>
                    <ul className="space-y-1">
                      {institutions.map((inst) => (
                        <li key={String(inst)} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          {String(inst)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pathway.entryRequirements && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Entry Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      {pathway.entryRequirements}
                    </p>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
