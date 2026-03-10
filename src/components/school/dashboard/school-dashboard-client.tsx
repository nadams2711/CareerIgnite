"use client";

import type { SchoolDashboardData } from "@/types";
import { StatCards } from "./stat-cards";
import { RefreshDataButton } from "./refresh-data-button";
import { PremiumGate } from "./premium-gate";
import { InterestDistribution } from "./interest-distribution";
import { SubjectDemandChart } from "./subject-demand-chart";
import { PathwayDistribution } from "./pathway-distribution";
import { SkillHeatmap } from "./skill-heatmap";
import { EngagementMetrics } from "./engagement-metrics";
import { CompetitorBenchmarks } from "./competitor-benchmarks";
import { TrendCharts } from "./trend-charts";
import { GradeBreakdown } from "./grade-breakdown";
import { ExportButtons } from "./export-buttons";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface Props {
  data: SchoolDashboardData;
}

export function SchoolDashboardClient({ data }: Props) {
  const isPremium =
    data.school.tier === "PREMIUM" ||
    (data.school.trialEndsAt && new Date(data.school.trialEndsAt) > new Date());

  const trialDaysLeft = data.school.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(data.school.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  // Placeholder data for premium gate blurred previews
  const placeholderInterests = { TECHNOLOGY: 42, CREATIVE: 28, HEALTH: 18, BUSINESS: 15, TRADES: 12 };
  const placeholderSubjects = { "Digital Technologies": 35, "Visual Art": 22, "Math Methods": 20, Biology: 18, English: 15, "Business Studies": 12 };
  const placeholderPathways = { UNIVERSITY: 45, TAFE: 20, TRADE: 10, APPRENTICESHIP: 8 };
  const placeholderSkills = { technology: 4.1, creative: 3.8, communication: 3.5, math: 3.2, leadership: 2.9 };
  const placeholderEngagement = { totalRegistered: 55, quizCompleted: 38, planCreated: 22 };
  const placeholderGrades = { "Year 10": { TECHNOLOGY: 12, CREATIVE: 8 }, "Year 11": { HEALTH: 10, BUSINESS: 7 }, "Year 12": { TECHNOLOGY: 8, TRADES: 6 } };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold gradient-text">
              {data.school.name}
            </h1>
            <Badge variant="outline" className="rounded-full text-xs border-white/30 text-white">
              {data.school.tier === "PREMIUM" ? "Premium" : "Free"}
            </Badge>
          </div>
          <p className="flex items-center gap-1 text-sm text-white/70 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {data.school.suburb}, {data.school.state}
            {data.school.adminName && <> &middot; Admin: {data.school.adminName}</>}
          </p>
          {!isPremium && trialDaysLeft <= 0 && (
            <p className="text-xs text-white/60 mt-1">
              Free tier — upgrade for full analytics
            </p>
          )}
          {isPremium && data.school.tier !== "PREMIUM" && trialDaysLeft > 0 && (
            <p className="text-xs text-blue-400 mt-1">
              Trial: {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isPremium && <ExportButtons schoolCode={data.school.code} />}
          <RefreshDataButton schoolCode={data.school.code} />
        </div>
      </div>

      {/* Free Tier: Stat Cards */}
      <StatCards
        studentCount={data.studentCount}
        quizCompletionRate={data.quizCompletionRate}
        topInterest={data.topInterests[0]?.label ?? null}
      />

      {/* Free Tier: Top 3 Interests */}
      {data.topInterests.length > 0 && (
        <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-md">
          <h3 className="font-heading text-sm font-semibold mb-3">
            Top Interest Areas
          </h3>
          <div className="space-y-2">
            {data.topInterests.map((interest, i) => (
              <div key={interest.category} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{interest.label}</span>
                    <span className="text-xs text-muted-foreground">{interest.percentage}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                      style={{ width: `${interest.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Widgets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Interest Distribution */}
        <PremiumGate isPremium={!!isPremium} title="Interest Distribution">
          <InterestDistribution
            interestCounts={data.premium?.interestCounts || placeholderInterests}
            studentCount={data.studentCount || 100}
          />
        </PremiumGate>

        {/* Subject Demand */}
        <PremiumGate isPremium={!!isPremium} title="Subject Demand">
          <SubjectDemandChart
            subjectCounts={data.premium?.subjectCounts || placeholderSubjects}
          />
        </PremiumGate>

        {/* Pathway Preferences */}
        <PremiumGate isPremium={!!isPremium} title="Pathway Preferences">
          <PathwayDistribution
            pathwayCounts={data.premium?.pathwayCounts || placeholderPathways}
          />
        </PremiumGate>

        {/* Skill Confidence */}
        <PremiumGate isPremium={!!isPremium} title="Skill Confidence">
          <SkillHeatmap
            skillAvgs={data.premium?.skillAvgs || placeholderSkills}
          />
        </PremiumGate>

        {/* Engagement Funnel */}
        <PremiumGate isPremium={!!isPremium} title="Engagement Funnel">
          <EngagementMetrics
            stats={data.premium?.engagementStats || placeholderEngagement}
          />
        </PremiumGate>

        {/* Grade Breakdown */}
        <PremiumGate isPremium={!!isPremium} title="Grade Breakdown">
          <GradeBreakdown
            gradeCounts={data.premium?.gradeCounts || placeholderGrades}
          />
        </PremiumGate>
      </div>

      {/* Full-width premium widgets */}
      <PremiumGate isPremium={!!isPremium} title="Monthly Trends">
        <TrendCharts
          trends={data.premium?.trends || []}
        />
      </PremiumGate>

      <PremiumGate isPremium={!!isPremium} title="Competitor Benchmarks">
        <CompetitorBenchmarks
          competitors={data.premium?.competitors || []}
          schoolName={data.school.name}
        />
      </PremiumGate>
    </div>
  );
}
