import { notFound } from "next/navigation";
import Link from "next/link";
import { getSchoolInsightsPublic } from "@/lib/actions/school.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";
import { StatCards } from "@/components/school/dashboard/stat-cards";
import { InterestDistribution } from "@/components/school/dashboard/interest-distribution";
import { PathwayDistribution } from "@/components/school/dashboard/pathway-distribution";
import { SubjectDemandChart } from "@/components/school/dashboard/subject-demand-chart";
import { SkillHeatmap } from "@/components/school/dashboard/skill-heatmap";
import { GradeBreakdown } from "@/components/school/dashboard/grade-breakdown";
import { EngagementMetrics } from "@/components/school/dashboard/engagement-metrics";
import { SkillStrengthsWeaknesses } from "@/components/school/insights/skill-strengths-weaknesses";
import { StateComparison } from "@/components/school/insights/state-comparison";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const data = await getSchoolInsightsPublic(code);
  if (!data) return { title: "School Not Found" };
  return { title: `${data.school.name} — Student Insights` };
}

export default async function SchoolInsightsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const data = await getSchoolInsightsPublic(code);

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-2">Not Enough Data</h1>
        <p className="text-muted-foreground mb-6">
          This school doesn&apos;t have enough student data to display insights yet.
          At least 5 students need to complete the quiz.
        </p>
        <Link
          href="/schools"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schools
        </Link>
      </div>
    );
  }

  const topInterestLabel = data.topInterest
    ? CAREER_CATEGORIES[data.topInterest as CareerCategory]?.label || data.topInterest
    : null;

  const sortedCareers = Object.entries(data.careerCounts).sort(
    ([, a], [, b]) => b - a,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/schools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Schools
        </Link>
        <h1 className="text-3xl font-bold">{data.school.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-muted-foreground">
            {data.school.suburb}, {data.school.state}
          </p>
          <Badge variant="secondary" className="text-xs">
            {data.studentCount} students
          </Badge>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8">
        <StatCards
          studentCount={data.studentCount}
          quizCompletionRate={data.quizCompletionRate}
          topInterest={topInterestLabel}
        />
      </div>

      {/* Strengths & Weaknesses */}
      {(data.strengths.length > 0 || data.weaknesses.length > 0) && (
        <Card className="mb-8 rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Student Strengths & Growth Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillStrengthsWeaknesses
              strengths={data.strengths}
              weaknesses={data.weaknesses}
            />
          </CardContent>
        </Card>
      )}

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Interest Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <InterestDistribution
              interestCounts={data.interestCounts}
              studentCount={data.studentCount}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Pathway Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PathwayDistribution pathwayCounts={data.pathwayCounts} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Subject Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <SubjectDemandChart subjectCounts={data.subjectCounts} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Skill Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillHeatmap skillAvgs={data.skillAvgs} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Grade Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeBreakdown gradeCounts={data.gradeCounts} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Engagement Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <EngagementMetrics stats={data.engagementStats} />
          </CardContent>
        </Card>
      </div>

      {/* State Comparison */}
      {data.stateComparison && Object.keys(data.skillAvgs).length > 0 && (
        <Card className="mb-8 rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>
              School vs {data.school.state} Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StateComparison
              schoolSkills={data.skillAvgs}
              stateSkills={data.stateComparison}
              stateName={`${data.school.state} Avg`}
            />
          </CardContent>
        </Card>
      )}

      {/* Top Careers */}
      {sortedCareers.length > 0 && (
        <Card className="rounded-2xl border-2 shadow-md">
          <CardHeader>
            <CardTitle>Most Popular Careers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sortedCareers.slice(0, 9).map(([career, count], i) => (
                <div
                  key={career}
                  className="flex items-center gap-3 rounded-xl border-2 border-border p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium capitalize">
                      {career.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {count} students
                    </p>
                  </div>
                  <TrendingUp className="h-4 w-4 shrink-0 text-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
