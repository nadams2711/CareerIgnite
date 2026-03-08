"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { AustralianState } from "@prisma/client";

// Get all schools (for selector)
export async function getSchools(state?: AustralianState) {
  return prisma.school.findMany({
    where: state ? { state } : undefined,
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true, suburb: true, state: true },
  });
}

// Search schools by name or suburb (debounced type-to-search)
export async function searchSchools(state: AustralianState, query: string) {
  if (query.length < 2) return [];
  return prisma.school.findMany({
    where: {
      state,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { suburb: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true, suburb: true, state: true },
    take: 20,
  });
}

// Get school insights for student dashboard (anonymized peer data)
export async function getSchoolPeerInsights(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      insights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!school || school.insights.length === 0) return null;

  const latest = school.insights[0];
  // Only show if min 5 students (privacy)
  if (latest.studentCount < 5) return null;

  return {
    schoolName: school.name,
    suburb: school.suburb,
    state: school.state,
    ...latest,
    interestCounts: latest.interestCounts as Record<string, number>,
    careerCounts: latest.careerCounts as Record<string, number>,
    subjectCounts: latest.subjectCounts as Record<string, number>,
  };
}

// Get school analytics (counsellor view - full detail)
export async function getSchoolAnalytics(schoolCode: string) {
  const school = await prisma.school.findUnique({
    where: { code: schoolCode },
    include: {
      insights: {
        orderBy: { createdAt: "desc" },
        take: 6, // last 6 months for trends
      },
      _count: { select: { students: true } },
    },
  });
  return school;
}

// Get area-level insights (aggregate across schools in same state+suburb area)
export async function getAreaInsights(state: AustralianState, suburb?: string) {
  const insights = await prisma.schoolInsight.findMany({
    where: {
      school: { state },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { school: { select: { name: true, suburb: true } } },
  });

  // Aggregate interest counts across schools
  const totalInterests: Record<string, number> = {};
  const totalCareers: Record<string, number> = {};
  let totalStudents = 0;
  let atarSum = 0;
  let atarCount = 0;

  for (const insight of insights) {
    const interests = insight.interestCounts as Record<string, number>;
    const careers = insight.careerCounts as Record<string, number>;
    for (const [k, v] of Object.entries(interests)) {
      totalInterests[k] = (totalInterests[k] || 0) + v;
    }
    for (const [k, v] of Object.entries(careers)) {
      totalCareers[k] = (totalCareers[k] || 0) + v;
    }
    totalStudents += insight.studentCount;
    if (insight.atarAvg) {
      atarSum += insight.atarAvg * insight.studentCount;
      atarCount += insight.studentCount;
    }
  }

  return {
    state,
    totalStudents,
    atarAvg:
      atarCount > 0 ? Math.round((atarSum / atarCount) * 10) / 10 : null,
    topInterests: Object.entries(totalInterests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalStudents) * 100),
      })),
    trendingCareers: Object.entries(totalCareers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([career, count]) => ({ career, count })),
  };
}

// Update user's school and sharing preferences
export async function updateUserSchool(
  schoolId: string,
  sharePeers: boolean,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.user.update({
    where: { id: session.user.id },
    data: { schoolId, sharePeers },
  });
}

// Get competitor benchmarks (schools in same state, anonymized)
export async function getCompetitorBenchmarks(schoolId: string) {
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) return [];

  const competitors = await prisma.school.findMany({
    where: { state: school.state, id: { not: schoolId } },
    include: {
      insights: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { students: true } },
    },
    take: 10,
  });

  return competitors.map((c) => {
    const latest = c.insights[0];
    const interests = (latest?.interestCounts || {}) as Record<string, number>;
    const topInterest = Object.entries(interests).sort(
      ([, a], [, b]) => b - a,
    )[0];
    return {
      name: c.name,
      suburb: c.suburb,
      studentCount: c._count.students,
      atarAvg: latest?.atarAvg,
      topInterest: topInterest
        ? {
            category: topInterest[0],
            percentage: latest?.studentCount
              ? Math.round((topInterest[1] / latest.studentCount) * 100)
              : 0,
          }
        : null,
    };
  });
}

// Get all schools for the public explorer page
export async function getSchoolsForExplorer(
  state?: AustralianState,
  query?: string,
) {
  const schools = await prisma.school.findMany({
    where: {
      ...(state ? { state } : {}),
      ...(query && query.length >= 2
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { suburb: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      insights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return schools.map((school) => {
    const latest = school.insights[0];
    const interests = (latest?.interestCounts || {}) as Record<string, number>;
    const topEntry = Object.entries(interests).sort(([, a], [, b]) => b - a)[0];
    const studentCount = latest?.studentCount || 0;

    return {
      code: school.code,
      name: school.name,
      suburb: school.suburb,
      state: school.state,
      studentCount,
      topInterest: topEntry ? topEntry[0] : null,
      hasInsights: studentCount >= 5,
    };
  });
}

// Get public insights for a school (for /school/[code]/insights)
export async function getSchoolInsightsPublic(schoolCode: string) {
  const school = await prisma.school.findUnique({
    where: { code: schoolCode },
    include: {
      insights: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!school || school.insights.length === 0) return null;

  const latest = school.insights[0];
  if (latest.studentCount < 5) return null;

  const interestCounts = (latest.interestCounts || {}) as Record<string, number>;
  const careerCounts = (latest.careerCounts || {}) as Record<string, number>;
  const subjectCounts = (latest.subjectCounts || {}) as Record<string, number>;
  const pathwayCounts = (latest.pathwayCounts || {}) as Record<string, number>;
  const skillAvgs = (latest.skillAvgs || {}) as Record<string, number>;
  const gradeCounts = (latest.gradeCounts || {}) as Record<string, Record<string, number>>;
  const engagementStats = (latest.engagementStats || {
    totalRegistered: latest.studentCount,
    quizCompleted: 0,
    planCreated: 0,
  }) as { totalRegistered: number; quizCompleted: number; planCreated: number };

  // Compute strengths (>= 3.5) and weaknesses (< 3.0)
  const strengths = Object.entries(skillAvgs)
    .filter(([, avg]) => avg >= 3.5)
    .sort(([, a], [, b]) => b - a)
    .map(([skill, avg]) => ({ skill, avg }));

  const weaknesses = Object.entries(skillAvgs)
    .filter(([, avg]) => avg < 3.0)
    .sort(([, a], [, b]) => a - b)
    .map(([skill, avg]) => ({ skill, avg }));

  // Top interest
  const topEntry = Object.entries(interestCounts).sort(([, a], [, b]) => b - a)[0];

  // Quiz completion rate
  const quizCompletionRate =
    engagementStats.totalRegistered > 0
      ? Math.round((engagementStats.quizCompleted / engagementStats.totalRegistered) * 100)
      : 0;

  // State comparison: aggregate skill averages across all schools in same state
  let stateComparison: Record<string, number> | null = null;
  const stateInsights = await prisma.schoolInsight.findMany({
    where: {
      school: { state: school.state },
      studentCount: { gte: 5 },
    },
    orderBy: { createdAt: "desc" },
    distinct: ["schoolId"],
    select: { skillAvgs: true, studentCount: true },
  });

  if (stateInsights.length >= 2) {
    const totals: Record<string, { sum: number; count: number }> = {};
    for (const insight of stateInsights) {
      const skills = (insight.skillAvgs || {}) as Record<string, number>;
      for (const [skill, avg] of Object.entries(skills)) {
        if (!totals[skill]) totals[skill] = { sum: 0, count: 0 };
        totals[skill].sum += avg * insight.studentCount;
        totals[skill].count += insight.studentCount;
      }
    }
    stateComparison = {};
    for (const [skill, { sum, count }] of Object.entries(totals)) {
      stateComparison[skill] = Math.round((sum / count) * 10) / 10;
    }
  }

  return {
    school: {
      code: school.code,
      name: school.name,
      suburb: school.suburb,
      state: school.state,
    },
    studentCount: latest.studentCount,
    quizCompletionRate,
    topInterest: topEntry ? topEntry[0] : null,
    interestCounts,
    careerCounts,
    subjectCounts,
    pathwayCounts,
    skillAvgs,
    gradeCounts,
    engagementStats,
    strengths,
    weaknesses,
    stateComparison,
  };
}

// Get trending careers across all schools (for landing page)
export async function getTrendingCareers() {
  const recentInsights = await prisma.schoolInsight.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const careerCounts: Record<string, number> = {};
  for (const insight of recentInsights) {
    const careers = insight.careerCounts as Record<string, number>;
    for (const [k, v] of Object.entries(careers)) {
      careerCounts[k] = (careerCounts[k] || 0) + v;
    }
  }

  return Object.entries(careerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, count }));
}
