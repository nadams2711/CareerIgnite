"use client";

import { useState, useMemo, useEffect } from "react";
import { usePlanStore } from "@/stores/plan-store";
import { createPlan, generateTimeline } from "@/lib/actions/plan.actions";
import { PlanBuilder } from "@/components/plan/plan-builder";
import { Timeline } from "@/components/plan/timeline";
import { SubjectTracker } from "@/components/plan/subject-tracker";
import { QualificationTracker } from "@/components/plan/qualification-tracker";
import { SuggestedCourses } from "@/components/plan/suggested-courses";
import { SubjectResources } from "@/components/plan/subject-resources";
import { UpcomingEvents } from "@/components/plan/upcoming-events";
import { LocalCompanies } from "@/components/plan/local-companies";
import { PdfButton } from "@/components/plan/pdf-button";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  RotateCcw,
  Wand2,
  Loader2,
  MapPin,
  BookOpen,
  Award,
  Calendar,
  Building2,
  Route,
} from "lucide-react";
import { toast } from "sonner";
import { AUSTRALIAN_STATES } from "@/lib/constants";
import { PlanTweakDialog } from "@/components/coach/plan-tweak-dialog";
import type { AustralianState, CareerCategory } from "@prisma/client";

interface PlanPageClientProps {
  initialState?: AustralianState;
  serverPlanId?: string | null;
  serverPlanCareerIds?: Record<string, string>;
}

export function PlanPageClient({ initialState, serverPlanId, serverPlanCareerIds }: PlanPageClientProps) {
  const { title, careers, setTimeline, setSavedPlanId, setPlanCareerIds, planCareerIds, savedPlanId, reset } = usePlanStore();
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedState, setSelectedState] = useState<AustralianState>(
    initialState ?? "NSW"
  );

  // Sync with server-provided state (e.g. after quiz retake)
  useEffect(() => {
    if (initialState) {
      setSelectedState(initialState);
    }
  }, [initialState]);

  // Hydrate plan career IDs from server if the store doesn't have them
  useEffect(() => {
    if (serverPlanId && serverPlanCareerIds && Object.keys(serverPlanCareerIds).length > 0) {
      if (!savedPlanId || Object.keys(planCareerIds).length === 0) {
        setSavedPlanId(serverPlanId);
        setPlanCareerIds(serverPlanCareerIds);
      }
    }
  }, [serverPlanId, serverPlanCareerIds, savedPlanId, planCareerIds, setSavedPlanId, setPlanCareerIds]);

  // Derive career categories from plan
  const planCategories = useMemo<CareerCategory[]>(() => {
    const cats = new Set<CareerCategory>();
    for (const c of careers) {
      cats.add(c.career.category);
    }
    return [...cats];
  }, [careers]);

  // Get subjects for the first career's selected pathway in the current state
  const firstCareer = careers[0];
  const firstPathway = firstCareer?.career.pathways.find(
    (p) => p.state === selectedState && p.pathwayType === firstCareer.selectedPathway
  );

  const handleSave = async () => {
    if (careers.length === 0) {
      toast.error("Add at least one career to save your plan.");
      return;
    }
    setSaving(true);
    try {
      const plan = await createPlan({
        title,
        careers: careers.map((c, i) => ({
          careerId: c.career.id,
          priority: i,
        })),
        timeline: usePlanStore.getState().timeline,
        existingPlanId: savedPlanId ?? undefined,
      });
      setSavedPlanId(plan.id);
      // Store PlanCareer IDs so progress tracking can reference the correct foreign key
      const idMap: Record<string, string> = {};
      for (const pc of plan.careers) {
        idMap[pc.careerId] = pc.id;
      }
      setPlanCareerIds(idMap);
      toast.success("Plan saved successfully!");
    } catch (err) {
      console.error("Plan save failed:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      if (message === "Unauthorized") {
        toast.error("You need to sign in to save a plan.");
      } else {
        toast.error(`Failed to save plan: ${message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateTimeline = async () => {
    if (careers.length === 0) {
      toast.error("Add careers first to generate a timeline.");
      return;
    }
    setGenerating(true);
    try {
      const timeline = await generateTimeline(
        careers.map((c) => ({
          careerId: c.career.id,
          pathwayType: c.selectedPathway,
          state: selectedState,
        }))
      );
      setTimeline(timeline);
      toast.success("Timeline generated!");
    } catch (err) {
      console.error("Timeline generation failed:", err);
      toast.error("Failed to generate timeline.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    reset();
    toast.info("Plan cleared.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          My <span className="gradient-text">Roadmap</span>
        </h1>
        <p className="mt-2 text-white/70 max-w-2xl">
          Build your roadmap from school to career. Pick the jobs that excite you,
          choose how you&apos;ll get there, and track your progress.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-white/70 hidden sm:block" />
          <Select
            value={selectedState}
            onValueChange={(v) => setSelectedState(v as AustralianState)}
          >
            <SelectTrigger className="w-[100px] sm:w-[140px] h-9 rounded-xl bg-card text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUSTRALIAN_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleGenerateTimeline}
          disabled={generating || careers.length === 0}
          className="gap-2 btn-gradient rounded-xl"
          size="sm"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Map My Journey</span>
          <span className="sm:hidden">Map</span>
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || careers.length === 0}
          className="gap-2 bg-primary hover:bg-primary/90 rounded-xl"
          size="sm"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Save Plan</span>
          <span className="sm:hidden">Save</span>
        </Button>
        <PdfButton />
        <PlanTweakDialog
          careers={careers.map((c) => ({
            id: c.career.id,
            title: c.career.title,
            pathway: c.selectedPathway,
          }))}
          state={selectedState}
        />
        <Button variant="outline" onClick={handleReset} className="gap-2 rounded-xl bg-card" size="sm">
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">New Plan</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Workspace panel */}
      <div className="rounded-2xl bg-card border-2 border-border p-3 sm:p-6 shadow-md">
        {/* Tabbed layout */}
        <Tabs defaultValue="careers" className="space-y-6">
          <TabsList className="grid h-auto bg-transparent gap-1.5 p-0 grid-cols-6 sm:flex sm:flex-wrap sm:gap-2">
            <TabsTrigger value="careers" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <Route className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              Careers
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <BookOpen className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Subjects</span>
              <span className="sm:hidden">Subj</span>
            </TabsTrigger>
            <TabsTrigger value="qualifications" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <Award className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              Quals
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <Wand2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Timeline</span>
              <span className="sm:hidden">Time</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <Calendar className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              Events
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 px-1 sm:px-3 py-2 text-[10px] sm:text-sm rounded-xl border-2 border-border bg-card text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-md">
              <Building2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Employers</span>
              <span className="sm:hidden">Jobs</span>
            </TabsTrigger>
          </TabsList>

        {/* Careers tab */}
        <TabsContent value="careers">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <h2 className="text-lg font-bold mb-4">Select Careers</h2>
              <PlanBuilder />
            </div>
            <div className="rounded-xl border border-border p-5">
              <h2 className="text-lg font-bold mb-4">Your Journey</h2>
              <Timeline />
            </div>
          </div>
        </TabsContent>

        {/* Subjects tab */}
        <TabsContent value="subjects">
          <div>
            {careers.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-bold text-foreground mb-1">No careers selected yet</p>
                <p className="text-sm text-muted-foreground">
                  Add careers in the Careers tab to see required subjects.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {!savedPlanId && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
                    Save your plan to enable grade tracking.
                  </div>
                )}
                {careers.map((entry) => {
                  const pcId = planCareerIds[entry.career.id];
                  const pathway = entry.career.pathways.find(
                    (p) =>
                      p.state === selectedState &&
                      p.pathwayType === entry.selectedPathway
                  );
                  return (
                    <div key={entry.career.id}>
                      <h3 className="font-bold mb-3">{entry.career.title}</h3>
                      <SubjectTracker
                        planCareerId={pcId ?? ""}
                        subjects={pathway?.subjects ?? []}
                        progress={[]}
                        rankTarget={pathway?.rankTarget}
                      />
                      <SubjectResources
                        subjects={pathway?.subjects ?? []}
                        targetGrade={pathway?.rankTarget ? String(pathway.rankTarget) : null}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Qualifications tab */}
        <TabsContent value="qualifications">
          <div>
            {careers.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-bold text-foreground mb-1">No careers selected yet</p>
                <p className="text-sm text-muted-foreground">
                  Add careers in the Careers tab to see qualifications needed.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {!savedPlanId && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
                    Save your plan to track qualification progress.
                  </div>
                )}
                {careers.map((entry) => {
                  const pcId = planCareerIds[entry.career.id];
                  const pathway = entry.career.pathways.find(
                    (p) =>
                      p.state === selectedState &&
                      p.pathwayType === entry.selectedPathway
                  );
                  const qualTitle = pathway
                    ? `${pathway.duration} via ${entry.selectedPathway}`
                    : null;
                  return (
                    <div key={entry.career.id}>
                      <h3 className="font-bold mb-3">{entry.career.title}</h3>
                      <QualificationTracker
                        planCareerId={pcId ?? ""}
                        qualifications={
                          qualTitle
                            ? [qualTitle, ...(pathway?.entryRequirements ? [pathway.entryRequirements] : [])]
                            : []
                        }
                        progress={[]}
                      />
                      <SuggestedCourses
                        careerTitle={entry.career.title}
                        skills={entry.career.skills}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Timeline tab */}
        <TabsContent value="timeline">
          <h2 className="text-lg font-bold mb-4">Your Journey</h2>
          <Timeline />
        </TabsContent>

        {/* Events tab */}
        <TabsContent value="events">
          <h2 className="text-lg font-bold mb-4">Events & Opportunities</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Career fairs, uni open days, and info sessions near you.
          </p>
          <UpcomingEvents state={selectedState} categories={planCategories} />
        </TabsContent>

        {/* Local Employers tab */}
        <TabsContent value="employers">
          <h2 className="text-lg font-bold mb-4">Local Employers</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Companies in {selectedState} that hire for your chosen careers.
          </p>
          <LocalCompanies state={selectedState} categories={planCategories} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
