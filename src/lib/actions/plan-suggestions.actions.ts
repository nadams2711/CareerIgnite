"use server";

import { getGroqClient } from "@/lib/grok";

export type CourseSuggestion = {
  title: string;
  provider: string;
  description: string;
  url: string;
  skill: string;
};

export type SubjectResource = {
  subject: string;
  title: string;
  provider: string;
  description: string;
  url: string;
};

export async function getSkillCourses(
  careerTitle: string,
  skills: string[]
): Promise<CourseSuggestion[]> {
  const groq = getGroqClient();
  if (!groq) return [];

  const skillList = skills.join(", ");
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a career development advisor for Australian high school students. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `Suggest 4-5 short courses, certifications, or workshops that would help an Australian high school student build skills for a career as a ${careerTitle}. The key skills to develop are: ${skillList}.

Return a JSON array with objects having these fields: title (course name), provider (e.g. Coursera, TAFE, Open Universities, LinkedIn Learning, Udemy, Khan Academy), description (1 sentence, teen-friendly), url (real website URL for the course or provider), skill (which skill from the list it develops).

Only suggest real, well-known courses or platforms. Keep suggestions appropriate for teens aged 15-18.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleaned) as CourseSuggestion[];
  } catch {
    return [];
  }
}

export async function getSubjectResources(
  subjects: string[],
  targetGrade: string | null
): Promise<SubjectResource[]> {
  const groq = getGroqClient();
  if (!groq) return [];

  const subjectList = subjects.join(", ");
  const gradeContext = targetGrade
    ? ` The student is aiming for a target grade/ATAR around ${targetGrade}.`
    : "";

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a study resources advisor for Australian high school students. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `Suggest 2-3 free or affordable online resources for each of these Australian high school subjects: ${subjectList}.${gradeContext}

Return a JSON array with objects having these fields: subject (the subject name), title (resource name), provider (e.g. Khan Academy, Eddie Woo, ATAR Notes, Edrolo, StudySmarter), description (1 sentence, teen-friendly), url (real website URL).

Only suggest real, well-known educational resources. Prioritise free resources and those popular with Australian students.`,
        },
      ],
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "[]";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleaned) as SubjectResource[];
  } catch {
    return [];
  }
}
