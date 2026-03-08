"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, School, MapPin } from "lucide-react";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

interface PeerInsightsProps {
  schoolName: string;
  suburb: string;
  interestCounts: Record<string, number>;
  careerCounts: Record<string, number>;
  subjectCounts: Record<string, number>;
  studentCount: number;
  atarAvg: number | null;
  userInterests?: string[];
}

export function PeerInsights({
  schoolName,
  suburb,
  interestCounts,
  careerCounts,
  subjectCounts,
  studentCount,
  atarAvg,
  userInterests = [],
}: PeerInsightsProps) {
  const sortedInterests = Object.entries(interestCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxInterest = sortedInterests[0]?.[1] || 1;

  const sortedCareers = Object.entries(careerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const sortedSubjects = Object.entries(subjectCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Check if user's interests match school trends
  const userMatchingTrend = userInterests.find((i) =>
    sortedInterests.some(([cat]) => cat === i),
  );

  return (
    <div className="space-y-4">
      {/* School header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <School className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold">{schoolName}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {suburb}
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              <Users className="h-3 w-3 mr-1" /> {studentCount} students
            </Badge>
          </div>
          {userMatchingTrend && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 text-sm">
              <span className="font-medium text-amber-700 dark:text-amber-300">
                Your{" "}
                {CAREER_CATEGORIES[userMatchingTrend as CareerCategory]?.label ||
                  userMatchingTrend}{" "}
                interest matches a top school trend!
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interest breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Top Interests at Your School
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedInterests.map(([category, count]) => {
            const info = CAREER_CATEGORIES[category as CareerCategory];
            const pct = Math.round((count / studentCount) * 100);
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {info?.label || category}
                  </span>
                  <span className="text-sm text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={(count / maxInterest) * 100} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Trending careers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trending Careers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedCareers.map(([career, count], i) => (
                <div key={career} className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs font-bold text-blue-700 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate capitalize">
                    {career.replace(/-/g, " ")}
                  </span>
                  <span className="text-muted-foreground text-xs">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular subjects */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Popular Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortedSubjects.map(([subject, count]) => (
                <div
                  key={subject}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{subject}</span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((count / studentCount) * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {atarAvg && (
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                School Average ATAR
              </p>
              <p className="text-2xl font-bold">{atarAvg.toFixed(1)}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>National Average: 72.1</p>
              <p
                className={
                  atarAvg >= 72.1
                    ? "text-emerald-600 dark:text-emerald-400 font-medium"
                    : "text-amber-600 dark:text-amber-400 font-medium"
                }
              >
                {atarAvg >= 72.1
                  ? `+${(atarAvg - 72.1).toFixed(1)} above`
                  : `${(72.1 - atarAvg).toFixed(1)} below`}{" "}
                national avg
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
