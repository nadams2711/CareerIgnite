"use server";

import { getGroqClient } from "@/lib/grok";
import type { AustralianState, CareerCategory } from "@prisma/client";

export type EventResult = {
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  url?: string;
};

export type CompanyResult = {
  name: string;
  description: string;
  categories: string[];
  website?: string;
};

export async function getUpcomingEvents(
  state: AustralianState,
  categories: CareerCategory[]
): Promise<EventResult[]> {
  const groq = getGroqClient();
  if (!groq) return [];

  const catLabels = categories.join(", ");
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a career events advisor for Australian high school students. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `List 5 real upcoming career events, uni open days, TAFE info sessions, or career fairs in ${state}, Australia that are relevant to these career areas: ${catLabels}.

Return a JSON array with objects having these fields: title (string), type (one of: Career Fair, Uni Open Day, TAFE Info Session, Industry Event), date (approximate month/year like "March 2026"), location (city/venue), description (1 sentence for teens), url (website URL string for the event or institution).

Only include real, well-known Australian events or institutions. If unsure of exact dates, use approximate dates. Always include a real website URL for each event.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleaned) as EventResult[];
  } catch {
    return [];
  }
}

export async function getLocalCompanies(
  state: AustralianState,
  categories: CareerCategory[]
): Promise<CompanyResult[]> {
  const groq = getGroqClient();
  if (!groq) return [];

  const catLabels = categories.join(", ");
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
          content: `List 6 real Australian companies based in or with major offices in ${state} that hire for careers in these areas: ${catLabels}.

Return a JSON array with objects having these fields: name (string), description (1 sentence about what they do, teen-friendly), categories (array of matching career area strings), website (URL string or null).

Only include real, well-known Australian companies. Include a mix of large and medium companies.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleaned) as CompanyResult[];
  } catch {
    return [];
  }
}
