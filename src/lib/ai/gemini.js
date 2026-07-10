import { GoogleGenAI } from "@google/genai";

const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-3.5-flash",
];

function shouldTryNextModel(error) {
  const status = error?.status;
  const message = String(error?.message || "").toLowerCase();

  return (
    status === 404 ||
    status === 429 ||
    status >= 500 ||
    message.includes("not found") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted")
  );
}

export async function generateGeminiAnswer(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.25,
          maxOutputTokens: 600,
        },
      });

      const answer = response.text?.trim();

      if (answer) {
        return {
          answer,
          provider: "gemini",
          model,
        };
      }
    } catch (error) {
      console.error(`Gemini model failed: ${model}`, {
        status: error?.status,
        message: error?.message,
      });

      if (!shouldTryNextModel(error)) {
        throw error;
      }
    }
  }

  return null;
}