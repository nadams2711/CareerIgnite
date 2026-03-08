"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { TimelineStep } from "@/types";
import type { PathwayType } from "@prisma/client";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createPlan(data: {
  title: string;
  careers: { careerId: string; priority: number }[];
  timeline?: TimelineStep[];
  existingPlanId?: string;
}) {
  const userId = await getAuthUserId();

  // If updating an existing plan, delete old careers and update
  if (data.existingPlanId) {
    const existing = await prisma.plan.findUnique({
      where: { id: data.existingPlanId, userId },
    });
    if (existing) {
      // Remove old PlanCareer entries and recreate
      await prisma.planCareer.deleteMany({ where: { planId: existing.id } });
      const plan = await prisma.plan.update({
        where: { id: existing.id },
        data: {
          title: data.title,
          timeline: data.timeline ? JSON.parse(JSON.stringify(data.timeline)) : undefined,
          careers: {
            create: data.careers.map((c) => ({
              careerId: c.careerId,
              priority: c.priority,
            })),
          },
        },
        include: {
          careers: {
            include: {
              career: { include: { pathways: true } },
            },
          },
        },
      });
      revalidatePath("/dashboard");
      return plan;
    }
  }

  // Create new plan
  const plan = await prisma.plan.create({
    data: {
      userId,
      title: data.title,
      timeline: data.timeline ? JSON.parse(JSON.stringify(data.timeline)) : undefined,
      careers: {
        create: data.careers.map((c) => ({
          careerId: c.careerId,
          priority: c.priority,
        })),
      },
    },
    include: {
      careers: {
        include: {
          career: { include: { pathways: true } },
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return plan;
}

export async function updatePlan(
  planId: string,
  data: {
    title?: string;
    timeline?: TimelineStep[];
  }
) {
  const userId = await getAuthUserId();

  const plan = await prisma.plan.update({
    where: { id: planId, userId },
    data: {
      title: data.title,
      timeline: data.timeline ? JSON.parse(JSON.stringify(data.timeline)) : undefined,
    },
  });

  revalidatePath("/dashboard");
  return plan;
}

export async function deletePlan(planId: string) {
  const userId = await getAuthUserId();

  await prisma.plan.delete({
    where: { id: planId, userId },
  });

  revalidatePath("/dashboard");
}

export async function getUserPlans() {
  const userId = await getAuthUserId();

  return prisma.plan.findMany({
    where: { userId },
    include: {
      careers: {
        include: {
          career: { include: { pathways: true } },
        },
        orderBy: { priority: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function generateTimeline(
  careers: { careerId: string; pathwayType: PathwayType; state: string }[]
): Promise<TimelineStep[]> {
  const timeline: TimelineStep[] = [];
  let stepId = 0;

  // Year 11 - Subjects
  const allSubjects = new Set<string>();
  for (const entry of careers) {
    const pathway = await prisma.statePathway.findFirst({
      where: {
        careerId: entry.careerId,
        pathwayType: entry.pathwayType,
        state: entry.state as any,
      },
    });
    if (pathway) {
      pathway.subjects.forEach((s) => allSubjects.add(s));
    }
  }

  timeline.push({
    id: String(++stepId),
    year: "Year 11",
    title: "Choose Your Subjects",
    description: "Select subjects that align with your career goals",
    type: "school",
    details: Array.from(allSubjects).slice(0, 6),
  });

  // Year 12 - ATAR & Applications
  const atarTargets: number[] = [];
  for (const entry of careers) {
    const pathway = await prisma.statePathway.findFirst({
      where: {
        careerId: entry.careerId,
        pathwayType: entry.pathwayType,
        state: entry.state as any,
      },
    });
    if (pathway?.rankTarget) {
      atarTargets.push(pathway.rankTarget);
    }
  }

  const maxAtar = atarTargets.length > 0 ? Math.max(...atarTargets) : null;

  timeline.push({
    id: String(++stepId),
    year: "Year 12",
    title: "Final Year & Applications",
    description: maxAtar
      ? `Aim for an ATAR of ${maxAtar}+ and submit applications`
      : "Complete Year 12 and submit applications",
    type: "school",
    details: [
      maxAtar ? `Target ATAR: ${maxAtar}+` : "Complete required prerequisites",
      "Submit applications through UAC/VTAC/QTAC",
      "Attend open days and information sessions",
    ],
  });

  // Transition step
  timeline.push({
    id: String(++stepId),
    year: "Gap / Transition",
    title: "Transition Period",
    description: "Prepare for your next step after school",
    type: "transition",
    details: [
      "Accept your offer",
      "Organise accommodation if needed",
      "Complete any bridging courses",
    ],
  });

  // Study/training for each career
  for (const entry of careers) {
    const career = await prisma.career.findUnique({ where: { id: entry.careerId } });
    const pathway = await prisma.statePathway.findFirst({
      where: {
        careerId: entry.careerId,
        pathwayType: entry.pathwayType,
        state: entry.state as any,
      },
    });

    if (career && pathway) {
      const institutions = Array.isArray(pathway.institutions) ? pathway.institutions as string[] : [];
      timeline.push({
        id: String(++stepId),
        year: pathway.duration,
        title: `Study: ${career.title}`,
        description: `${entry.pathwayType.charAt(0) + entry.pathwayType.slice(1).toLowerCase()} pathway - ${pathway.duration}`,
        type: "study",
        details: [
          ...(institutions.length > 0 ? [`Institutions: ${institutions.slice(0, 3).join(", ")}`] : []),
          ...(pathway.entryRequirements ? [`Requirements: ${pathway.entryRequirements}`] : []),
        ],
      });
    }
  }

  // Career entry
  timeline.push({
    id: String(++stepId),
    year: "Career Entry",
    title: "Start Your Career",
    description: "Begin working in your chosen field",
    type: "work",
    details: [
      "Apply for graduate/entry-level positions",
      "Build your professional network",
      "Consider further specialisation",
    ],
  });

  return timeline;
}
