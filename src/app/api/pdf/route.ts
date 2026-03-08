import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PlanDocument } from "@/lib/pdf/plan-document";
import type { TimelineStep } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId, userId: session.user.id },
      include: {
        careers: {
          include: {
            career: { include: { pathways: true } },
          },
          orderBy: { priority: "asc" },
        },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const timeline = (plan.timeline as TimelineStep[]) || [];

    const buffer = await renderToBuffer(
      React.createElement(PlanDocument, {
        plan: plan as any,
        timeline,
        userName: session.user.name || undefined,
      }) as any
    );

    return new NextResponse(Buffer.from(buffer) as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="career-plan-${plan.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
