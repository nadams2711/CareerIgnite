"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { QualificationStatus } from "@prisma/client";

export async function updateSubjectProgress(
  planCareerId: string,
  subject: string,
  currentGrade: string | null,
  targetGrade: string | null
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.subjectProgress.findFirst({
    where: {
      userId: session.user.id,
      planCareerId,
      subject,
    },
  });

  if (existing) {
    return prisma.subjectProgress.update({
      where: { id: existing.id },
      data: { currentGrade, targetGrade },
    });
  }

  return prisma.subjectProgress.create({
    data: {
      userId: session.user.id,
      planCareerId,
      subject,
      currentGrade,
      targetGrade,
    },
  });
}

export async function updateQualificationStatus(
  planCareerId: string,
  title: string,
  status: QualificationStatus
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.qualificationProgress.findFirst({
    where: {
      userId: session.user.id,
      planCareerId,
      title,
    },
  });

  if (existing) {
    return prisma.qualificationProgress.update({
      where: { id: existing.id },
      data: { status },
    });
  }

  return prisma.qualificationProgress.create({
    data: {
      userId: session.user.id,
      planCareerId,
      title,
      status,
    },
  });
}

export async function getProgressForPlanCareer(planCareerId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const [subjects, qualifications] = await Promise.all([
    prisma.subjectProgress.findMany({
      where: { userId: session.user.id, planCareerId },
    }),
    prisma.qualificationProgress.findMany({
      where: { userId: session.user.id, planCareerId },
    }),
  ]);

  return { subjects, qualifications };
}
