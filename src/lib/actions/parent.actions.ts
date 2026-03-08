"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import crypto from "crypto";

// Generate a short 6-character alphanumeric code (readable, typeable)
function generateShortCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/1/O/0 to avoid confusion
  let code = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

// Student generates invite token for parent
export async function generateParentInvite() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if parent link already exists for this child
  const existing = await prisma.parentChild.findFirst({
    where: { childId: session.user.id, accepted: false },
  });

  if (existing) {
    return existing.inviteToken;
  }

  // Use a short code as the token so parents can type it
  const token = generateShortCode();

  // Create a placeholder parent, then the link
  const parent = await prisma.parent.create({
    data: {
      email: `pending-${token}@placeholder.local`,
    },
  });

  await prisma.parentChild.create({
    data: {
      childId: session.user.id,
      parentId: parent.id,
      inviteToken: token,
    },
  });

  return token;
}

// Parent claims invite
export async function claimParentInvite(token: string, parentEmail: string, parentName: string) {
  const link = await prisma.parentChild.findUnique({
    where: { inviteToken: token },
    include: { child: true, parent: true },
  });

  if (!link) throw new Error("Invalid invite link");
  if (link.accepted) throw new Error("Invite already claimed");

  // Find or create real parent
  let parent = await prisma.parent.findUnique({ where: { email: parentEmail } });

  if (!parent) {
    // Update the placeholder parent with real info
    parent = await prisma.parent.update({
      where: { id: link.parentId },
      data: { email: parentEmail, name: parentName },
    });
  } else {
    // Delete placeholder parent and reassign link
    await prisma.parentChild.update({
      where: { id: link.id },
      data: { parentId: parent.id, accepted: true },
    });
    await prisma.parent.delete({ where: { id: link.parentId } }).catch(() => {});
    return { childName: link.child.name, parentName: parent.name };
  }

  await prisma.parentChild.update({
    where: { id: link.id },
    data: { accepted: true },
  });

  return { childName: link.child.name, parentName };
}

// Get parent's children data (expanded for parent dashboard)
export async function getParentChildren(parentEmail: string) {
  const parent = await prisma.parent.findUnique({
    where: { email: parentEmail },
    include: {
      children: {
        where: { accepted: true },
        include: {
          child: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              state: true,
              grade: true,
              interests: true,
              skillRatings: true,
              plans: {
                include: {
                  careers: {
                    include: {
                      career: {
                        select: {
                          id: true,
                          title: true,
                          slug: true,
                          description: true,
                          image: true,
                          challenges: true,
                          salaryLow: true,
                          salaryHigh: true,
                          growthRate: true,
                          category: true,
                          skills: true,
                          pathways: true,
                        },
                      },
                    },
                    orderBy: { priority: "asc" },
                  },
                },
                orderBy: { updatedAt: "desc" },
                take: 3,
              },
              school: {
                include: {
                  insights: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return parent;
}

// Get consolidated insights for the parent dashboard
export async function getParentInsights(
  state: string | null,
  childCareerSlugs: string[]
) {
  // State-wide interest breakdown
  let stateInterests: { category: string; count: number; percentage: number }[] = [];
  let totalStudents = 0;

  if (state) {
    const insights = await prisma.schoolInsight.findMany({
      where: { school: { state: state as any } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const interestTotals: Record<string, number> = {};
    for (const insight of insights) {
      const interests = insight.interestCounts as Record<string, number>;
      for (const [k, v] of Object.entries(interests)) {
        interestTotals[k] = (interestTotals[k] || 0) + v;
      }
      totalStudents += insight.studentCount;
    }

    stateInterests = Object.entries(interestTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0,
      }));
  }

  // Trending careers nationally
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

  const trendingCareers = Object.entries(careerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([slug, count]) => ({ slug, count }));

  // Career popularity for child's specific careers
  const careerPopularity: Record<string, number> = {};
  for (const slug of childCareerSlugs) {
    careerPopularity[slug] = careerCounts[slug] || 0;
  }

  return {
    stateInterests,
    totalStudents,
    trendingCareers,
    careerPopularity,
  };
}

// Reconstruct career matches from a child's saved interests + skillRatings
// (works even if the child never saved a plan)
export async function getChildCareerMatches(
  interests: string[],
  skillRatings: Record<string, number> | null
) {
  if (interests.length === 0) return [];

  // Build category scores from interests (first = strongest)
  const categoryScores: Record<string, number> = {};
  interests.forEach((cat, i) => {
    categoryScores[cat] = interests.length - i;
  });

  const topCategories = interests.slice(0, 3);

  const careers = await prisma.career.findMany({
    where: { category: { in: topCategories as any } },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      challenges: true,
      salaryLow: true,
      salaryHigh: true,
      growthRate: true,
      category: true,
      skills: true,
    },
  });

  // Simple ranking: category score + growth rate bonus
  const ranked = careers
    .map((career) => {
      const catScore = categoryScores[career.category] || 0;
      return { career, score: catScore + career.growthRate * 0.01 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.career);

  return ranked;
}

// Generate a timeline for the parent view from quiz-matched careers
// (works without a saved plan — picks the first available pathway per career)
export async function generateParentTimeline(
  careerIds: string[],
  state: string
) {
  if (careerIds.length === 0) return [];

  const { generateTimeline } = await import("@/lib/actions/plan.actions");

  // Find best pathway for each career in the child's state
  const entries: { careerId: string; pathwayType: any; state: string }[] = [];
  for (const careerId of careerIds) {
    const pathway = await prisma.statePathway.findFirst({
      where: { careerId, state: state as any },
      orderBy: { pathwayType: "asc" },
    });
    if (pathway) {
      entries.push({ careerId, pathwayType: pathway.pathwayType, state });
    }
  }

  if (entries.length === 0) return [];
  return generateTimeline(entries);
}

// Get child details for parent view
export async function getChildDetails(childId: string, parentEmail: string) {
  // Verify parent has access
  const link = await prisma.parentChild.findFirst({
    where: {
      childId,
      accepted: true,
      parent: { email: parentEmail },
    },
  });

  if (!link) throw new Error("Unauthorized");

  const child = await prisma.user.findUnique({
    where: { id: childId },
    include: {
      plans: {
        include: {
          careers: {
            include: {
              career: { include: { pathways: true } },
            },
            orderBy: { priority: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      school: {
        include: {
          insights: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  return child;
}
