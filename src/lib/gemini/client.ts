import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiInstance: GoogleGenerativeAI | null = null;

export function getGemini(): GoogleGenerativeAI {
  console.log("[Gemini] Initializing client...");

  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Please add it to your .env file."
      );
    }

    geminiInstance = new GoogleGenerativeAI(apiKey);
  }

  return geminiInstance;
}
