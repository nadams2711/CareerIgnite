"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { AustralianState } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      plans: {
        include: {
          careers: true,
        },
      },
    },
  });
}

export async function updateUserProfile(data: {
  state?: AustralianState;
  grade?: string;
  interests?: string[];
  skillRatings?: Record<string, number>;
  riasecProfile?: Record<string, number>;
  workValueRatings?: Record<string, number>;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      state: data.state,
      interests: data.interests,
      ...(data.grade !== undefined && { grade: data.grade }),
      ...(data.skillRatings !== undefined && { skillRatings: data.skillRatings }),
      ...(data.riasecProfile !== undefined && { riasecProfile: data.riasecProfile }),
      ...(data.workValueRatings !== undefined && { workValueRatings: data.workValueRatings }),
    },
  });

  revalidatePath("/dashboard");
  return user;
}
