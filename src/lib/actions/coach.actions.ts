"use server";

import { prisma } from "@/lib/prisma";
import { formatSalaryRange, formatGrowthRate } from "@/lib/utils";
import { CAREER_CATEGORIES, PATHWAY_TYPES } from "@/lib/constants";
import type { CareerCategory, PathwayType } from "@prisma/client";

export async function buildCareerContext(slug: string, state?: string) {
  const career = await prisma.career.findUnique({
    where: { slug },
    include: {
      pathways: state ? { where: { state: state as any } } : true,
    },
  });

  if (!career) return null;

  const categoryInfo = CAREER_CATEGORIES[career.category];
  const pathwayLines = career.pathways.map((p) => {
    const pType = PATHWAY_TYPES[p.pathwayType];
    return `- ${pType.label} (${p.state}): ${p.duration}, subjects: ${p.subjects.join(", ")}${p.rankTarget ? `, ATAR target: ${p.rankTarget}` : ""}`;
  });

  return {
    title: career.title,
    context: [
      `Career: ${career.title}`,
      `Category: ${categoryInfo.label}`,
      `Salary: ${formatSalaryRange(career.salaryLow, career.salaryHigh)}`,
      `Growth: ${formatGrowthRate(career.growthRate)}`,
      `Skills: ${career.skills.join(", ")}`,
      `Description: ${career.description}`,
      pathwayLines.length > 0
        ? `Pathways:\n${pathwayLines.join("\n")}`
        : "No pathways data available.",
    ].join("\n"),
  };
}

export async function buildPlanContext(careers: { id: string; title: string; pathway: string }[]) {
  const lines: string[] = ["Current plan careers:"];

  for (const c of careers) {
    const career = await prisma.career.findUnique({
      where: { id: c.id },
      include: { pathways: true },
    });
    if (career) {
      const catInfo = CAREER_CATEGORIES[career.category];
      lines.push(
        `- ${career.title} (${catInfo.label}): ${formatSalaryRange(career.salaryLow, career.salaryHigh)}, growth ${formatGrowthRate(career.growthRate)}, via ${c.pathway}`
      );
    }
  }

  return lines.join("\n");
}

export async function buildParentContext(childEmail: string) {
  const parent = await prisma.parent.findUnique({
    where: { email: childEmail },
    include: {
      children: {
        where: { accepted: true },
        include: {
          child: {
            include: {
              plans: {
                include: {
                  careers: {
                    include: { career: true },
                    orderBy: { priority: "asc" },
                  },
                },
                orderBy: { updatedAt: "desc" },
                take: 1,
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

  if (!parent || parent.children.length === 0) return null;

  const lines: string[] = [];
  for (const link of parent.children) {
    const child = link.child;
    lines.push(`Child: ${child.name || "Student"}`);
    if (child.state) lines.push(`State: ${child.state}`);
    if (child.interests && child.interests.length > 0) {
      lines.push(`Interests: ${child.interests.join(", ")}`);
    }
    const plan = child.plans[0];
    if (plan) {
      lines.push(`Latest plan: ${plan.title}`);
      lines.push(
        `Plan careers: ${plan.careers.map((pc) => pc.career.title).join(", ")}`
      );
    }
    if (child.school) {
      lines.push(`School: ${child.school.name}`);
      const insight = child.school.insights?.[0];
      if (insight) {
        const interests = insight.interestCounts as Record<string, number>;
        const top = Object.entries(interests)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([cat, count]) => {
            const info = CAREER_CATEGORIES[cat as CareerCategory];
            return info?.label || cat;
          });
        lines.push(`School top interests: ${top.join(", ")}`);
      }
    }
  }

  return lines.join("\n");
}
