import { GoogleGenAI } from "@google/genai";

export async function generateGeminiAnswer(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 0.25,
      maxOutputTokens: 600,
    },
  });

  return response.text?.trim() || null;
}