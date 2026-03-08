"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { SchoolDashboardData } from "@/types";
import { CAREER_CATEGORIES } from "@/lib/constants";
import type { CareerCategory } from "@prisma/client";

// Register current user as school admin
export async function registerSchoolAdmin(schoolId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify user is currently a student
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || user.role !== "STUDENT") {
    return { success: false, error: "Already registered as an admin" };
  }

  // Check school exists and doesn't already have an admin
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: { admin: { select: { id: true } } },
  });
  if (!school) return { success: false, error: "School not found" };
  if (school.admin) return { success: false, error: "This school already has an admin" };

  // Update user role and link to school
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "SCHOOL_ADMIN",
      adminSchoolId: schoolId,
    },
  });

  // Set 14-day trial
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);
  await prisma.school.update({
    where: { id: schoolId },
    data: { trialEndsAt: trialEnd },
  });

  return { success: true, schoolCode: school.code };
}

// Compute aggregated insights for a school
export async function computeSchoolInsights(schoolCode: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const school = await prisma.school.findUnique({
    where: { code: schoolCode },
    include: { admin: { select: { id: true } } },
  });
  if (!school) throw new Error("School not found");
  if (school.admin?.id !== session.user.id) throw new Error("Not authorized");

  // Get all students at this school who share data
  const students = await prisma.user.findMany({
    where: { schoolId: school.id, sharePeers: true },
    select: {
      id: true,
      interests: true,
      skillRatings: true,
      grade: true,
      plans: {
        include: {
          careers: {
            include: {
              career: {
                select: { slug: true, category: true, pathways: { select: { pathwayType: true, subjects: true } } },
              },
            },
          },
        },
      },
    },
  });

  // Privacy check: require 5+ students
  if (students.length < 5) {
    return { success: false, error: "Need at least 5 students sharing data" };
  }

  // Count all registered users at this school (not just sharing)
  const totalRegistered = await prisma.user.count({
    where: { schoolId: school.id },
  });

  const interestCounts: Record<string, number> = {};
  const careerCounts: Record<string, number> = {};
  const subjectCounts: Record<string, number> = {};
  const pathwayCounts: Record<string, number> = {};
  const skillSums: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  const gradeCounts: Record<string, Record<string, number>> = {};
  let quizCompleted = 0;
  let planCreated = 0;

  for (const student of students) {
    // Interest counts
    if (student.interests.length > 0) {
      quizCompleted++;
      for (const interest of student.interests) {
        interestCounts[interest] = (interestCounts[interest] || 0) + 1;
      }
    }

    // Skill ratings
    if (student.skillRatings) {
      const ratings = student.skillRatings as Record<string, number>;
      for (const [skill, rating] of Object.entries(ratings)) {
        skillSums[skill] = (skillSums[skill] || 0) + rating;
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      }
    }

    // Grade counts
    if (student.grade) {
      if (!gradeCounts[student.grade]) gradeCounts[student.grade] = {};
      for (const interest of student.interests) {
        gradeCounts[student.grade][interest] = (gradeCounts[student.grade][interest] || 0) + 1;
      }
    }

    // Plan-based aggregation
    if (student.plans.length > 0) {
      planCreated++;
      for (const plan of student.plans) {
        for (const pc of plan.careers) {
          careerCounts[pc.career.slug] = (careerCounts[pc.career.slug] || 0) + 1;
          for (const pathway of pc.career.pathways) {
            pathwayCounts[pathway.pathwayType] = (pathwayCounts[pathway.pathwayType] || 0) + 1;
            for (const subject of pathway.subjects) {
              subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
            }
          }
        }
      }
    }
  }

  // Compute skill averages
  const skillAvgs: Record<string, number> = {};
  for (const [skill, sum] of Object.entries(skillSums)) {
    skillAvgs[skill] = Math.round((sum / skillCounts[skill]) * 10) / 10;
  }

  const period = new Date().toISOString().slice(0, 7); // "2026-03"

  await prisma.schoolInsight.upsert({
    where: { schoolId_period: { schoolId: school.id, period } },
    create: {
      schoolId: school.id,
      period,
      interestCounts,
      careerCounts,
      subjectCounts,
      pathwayCounts,
      skillAvgs,
      gradeCounts,
      engagementStats: { totalRegistered, quizCompleted, planCreated },
      studentCount: students.length,
    },
    update: {
      interestCounts,
      careerCounts,
      subjectCounts,
      pathwayCounts,
      skillAvgs,
      gradeCounts,
      engagementStats: { totalRegistered, quizCompleted, planCreated },
      studentCount: students.length,
    },
  });

  return { success: true };
}

// Get dashboard data (tier-gated)
export async function getSchoolDashboardData(
  schoolCode: string,
): Promise<SchoolDashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const school = await prisma.school.findUnique({
    where: { code: schoolCode },
    include: {
      admin: { select: { id: true, name: true } },
      insights: { orderBy: { createdAt: "desc" }, take: 6 },
      _count: { select: { students: true } },
    },
  });

  if (!school || school.admin?.id !== session.user.id) return null;

  const latest = school.insights[0];
  const studentCount = school._count.students;
  const interestCounts = (latest?.interestCounts || {}) as Record<string, number>;
  const engagementStats = (latest?.engagementStats || {}) as {
    totalRegistered?: number;
    quizCompleted?: number;
    planCreated?: number;
  };

  const quizCompletionRate =
    studentCount > 0
      ? Math.round(((engagementStats.quizCompleted || 0) / studentCount) * 100)
      : 0;

  // Top interests (always show top 3)
  const sortedInterests = Object.entries(interestCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => ({
      category,
      label: CAREER_CATEGORIES[category as CareerCategory]?.label || category,
      count,
      percentage: latest?.studentCount
        ? Math.round((count / latest.studentCount) * 100)
        : 0,
    }));

  const isPremium =
    school.tier === "PREMIUM" ||
    (school.trialEndsAt && new Date(school.trialEndsAt) > new Date());

  const base: SchoolDashboardData = {
    school: {
      code: school.code,
      name: school.name,
      suburb: school.suburb,
      state: school.state,
      tier: school.tier,
      trialEndsAt: school.trialEndsAt?.toISOString() ?? null,
      adminName: school.admin?.name ?? null,
    },
    studentCount,
    quizCompletionRate,
    topInterests: sortedInterests,
    premium: null,
  };

  if (!isPremium) return base;

  // Fetch competitor data
  const competitors = await prisma.school.findMany({
    where: { state: school.state, id: { not: school.id } },
    include: {
      insights: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { students: true } },
    },
    take: 10,
  });

  const competitorData = competitors.map((c) => {
    const cLatest = c.insights[0];
    const cInterests = (cLatest?.interestCounts || {}) as Record<string, number>;
    const topEntry = Object.entries(cInterests).sort(([, a], [, b]) => b - a)[0];
    return {
      name: c.name,
      suburb: c.suburb,
      studentCount: c._count.students,
      topInterest: topEntry
        ? {
            category: topEntry[0],
            percentage: cLatest?.studentCount
              ? Math.round((topEntry[1] / cLatest.studentCount) * 100)
              : 0,
          }
        : null,
    };
  });

  // Build trends from up to 6 monthly snapshots
  const trends = school.insights.map((i) => ({
    period: i.period,
    studentCount: i.studentCount,
    interestCounts: i.interestCounts as Record<string, number>,
  }));

  base.premium = {
    interestCounts,
    careerCounts: (latest?.careerCounts || {}) as Record<string, number>,
    subjectCounts: (latest?.subjectCounts || {}) as Record<string, number>,
    pathwayCounts: (latest?.pathwayCounts || {}) as Record<string, number>,
    skillAvgs: (latest?.skillAvgs || {}) as Record<string, number>,
    gradeCounts: (latest?.gradeCounts || {}) as Record<string, Record<string, number>>,
    engagementStats: {
      totalRegistered: engagementStats.totalRegistered || 0,
      quizCompleted: engagementStats.quizCompleted || 0,
      planCreated: engagementStats.planCreated || 0,
    },
    trends,
    competitors: competitorData,
  };

  return base;
}

// Export school data as CSV
export async function exportSchoolDataCSV(schoolCode: string) {
  const data = await getSchoolDashboardData(schoolCode);
  if (!data?.premium) return null;

  const rows: string[] = ["Category,Count,Percentage"];
  const total = Object.values(data.premium.interestCounts).reduce((s, v) => s + v, 0);
  for (const [cat, count] of Object.entries(data.premium.interestCounts)) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    rows.push(`${cat},${count},${pct}%`);
  }

  rows.push("", "Subject,Count");
  for (const [sub, count] of Object.entries(data.premium.subjectCounts)) {
    rows.push(`${sub},${count}`);
  }

  rows.push("", "Career,Count");
  for (const [career, count] of Object.entries(data.premium.careerCounts)) {
    rows.push(`${career},${count}`);
  }

  return rows.join("\n");
}
