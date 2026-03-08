"use server";

import { prisma } from "@/lib/prisma";
import type { CareerCategory, AustralianState } from "@prisma/client";
import type { CareerProgressionStep } from "@/types";

export async function getCareers(filters?: {
  search?: string;
  category?: CareerCategory;
  salaryMin?: number;
  sort?: "title" | "salary" | "growth";
}) {
  const where: any = {};

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { skills: { hasSome: [filters.search] } },
    ];
  }

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.salaryMin) {
    where.salaryHigh = { gte: filters.salaryMin };
  }

  let orderBy: any = { title: "asc" };
  if (filters?.sort === "salary") orderBy = { salaryHigh: "desc" };
  if (filters?.sort === "growth") orderBy = { growthRate: "desc" };

  return prisma.career.findMany({
    where,
    orderBy,
    include: { pathways: true },
  });
}

export async function getCareerBySlug(slug: string, state?: AustralianState) {
  const career = await prisma.career.findUnique({
    where: { slug },
    include: {
      pathways: state ? { where: { state } } : true,
    },
  });

  return career;
}

export async function getCareersByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return prisma.career.findMany({
    where: { id: { in: ids } },
    include: { pathways: true },
  });
}

export async function searchCareers(query: string) {
  return prisma.career.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { pathways: true },
    take: 10,
  });
}

export async function getCareerProgression(
  careerTitle: string
): Promise<CareerProgressionStep[]> {
  const { getGroqClient } = await import("@/lib/grok");
  const groq = getGroqClient();
  if (!groq) return [];

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor for Australian high school students. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `Show the career progression path for someone starting as a "${careerTitle}" in Australia, from entry-level all the way to the most senior/executive role they could reach.

Return a JSON array of 5-6 steps, each with:
- level (string): job title at this stage (e.g. "Junior Accountant", "Senior Accountant", "Finance Manager", "CFO")
- years (string): experience range to reach this level (e.g. "0-2 years", "3-5 years", "10-15 years")
- salary (string): typical Australian salary range at this level (e.g. "$55k-$70k", "$120k-$160k")
- description (string): 1 sentence about what you do at this level, teen-friendly

Order from entry-level to most senior. Use realistic Australian salary figures.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

export async function getAllCareerSlugs() {
  const careers = await prisma.career.findMany({
    select: { slug: true },
  });
  return careers.map((c) => c.slug);
}
