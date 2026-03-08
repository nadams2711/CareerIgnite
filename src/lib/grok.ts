import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getGroqClient(): OpenAI | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
}
