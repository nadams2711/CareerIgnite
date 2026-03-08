import { auth } from "@/lib/auth";
import { getGroqClient } from "@/lib/grok";
import {
  buildCareerContext,
  buildPlanContext,
  buildParentContext,
} from "@/lib/actions/coach.actions";

const SYSTEM_BASE = `You are CareerIgnite AI Coach, an expert Australian career advisor for Year 10-12 students.
You give concise, encouraging, data-driven advice about careers, pathways (university, TAFE, trades, apprenticeships), and subjects.
Keep responses under 150 words. Be positive but realistic.`;

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "AI Coach is currently unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { type, message } = body as {
    type: "career" | "plan-tweak" | "parent";
    message: string;
    slug?: string;
    state?: string;
    careers?: { id: string; title: string; pathway: string }[];
    parentEmail?: string;
  };

  if (!type || !message) {
    return Response.json({ error: "Missing type or message." }, { status: 400 });
  }

  let systemPrompt = SYSTEM_BASE;
  let contextBlock = "";

  try {
    if (type === "career") {
      const session = await auth();
      if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { slug, state } = body;
      if (!slug) {
        return Response.json({ error: "Missing career slug." }, { status: 400 });
      }
      const ctx = await buildCareerContext(slug, state);
      if (!ctx) {
        return Response.json({ error: "Career not found." }, { status: 404 });
      }
      contextBlock = ctx.context;
      systemPrompt += `\nAlways reference the student's state (${state || "not specified"}) for state-specific advice.`;
      systemPrompt += `\n\nCareer context:\n${contextBlock}`;
    } else if (type === "plan-tweak") {
      const session = await auth();
      if (!session?.user?.id) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { careers, state } = body;
      if (!careers || careers.length === 0) {
        return Response.json({ error: "No careers in plan." }, { status: 400 });
      }
      contextBlock = await buildPlanContext(careers);
      systemPrompt += `\nThe student is in ${state || "an Australian state"}. Suggest backup career ideas, subject gaps, and pathway alternatives.`;
      systemPrompt += `\nGive actionable bullet points.`;
      systemPrompt += `\n\nPlan context:\n${contextBlock}`;
    } else if (type === "parent") {
      const { parentEmail } = body;
      if (!parentEmail) {
        return Response.json({ error: "Missing parent email." }, { status: 400 });
      }
      const ctx = await buildParentContext(parentEmail);
      systemPrompt = `You are CareerIgnite AI Parent Coach, a helpful advisor for parents of Australian high school students.
You give concise, reassuring, data-driven advice about supporting your child's career exploration.
Keep responses under 150 words. Be empathetic and practical.`;
      if (ctx) {
        systemPrompt += `\n\nChild context:\n${ctx}`;
      }
    } else {
      return Response.json({ error: "Invalid coach type." }, { status: 400 });
    }

    const groq = getGroqClient();
    if (!groq) {
      return Response.json(
        { error: "AI Coach is currently unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode("\n\n[Error: Failed to get AI response. Please try again.]")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("[AI Coach Error]", error?.message || error);
    return Response.json(
      { error: error?.message || "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
