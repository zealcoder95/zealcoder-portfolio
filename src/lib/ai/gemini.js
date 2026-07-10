import { GoogleGenAI } from "@google/genai";

const GEMINI_MODELS = [
  // Önce hızlı ve ekonomik modeli dene.
  "gemini-3.1-flash-lite",

  // Başarısız olursa daha güçlü modele geç.
  "gemini-3.5-flash",
];

const MODEL_TIMEOUT_MS = 10000;

function withTimeout(promise, timeoutMs, model) {
  return Promise.race([
    promise,

    new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        const error = new Error(
          `${model} did not respond within ${timeoutMs} ms.`
        );

        error.status = 408;
        reject(error);
      }, timeoutMs);

      promise.finally(() => {
        clearTimeout(timeoutId);
      });
    }),
  ]);
}

function shouldTryNextModel(error) {
  const status = Number(error?.status || 0);
  const message = String(
    error?.message || ""
  ).toLocaleLowerCase("en");

  return (
    status === 404 ||
    status === 408 ||
    status === 429 ||
    status >= 500 ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted") ||
    message.includes("not found") ||
    message.includes("timed out") ||
    message.includes("did not respond")
  );
}

export async function generateGeminiAnswer(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing.");
    return null;
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  for (const model of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      const request = ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.2,
          maxOutputTokens: 700,
        },
      });

      const response = await withTimeout(
        request,
        MODEL_TIMEOUT_MS,
        model
      );

      const answer = response.text?.trim();

      if (!answer) {
        console.warn(
          `Gemini returned an empty response: ${model}`
        );

        continue;
      }

      return {
        answer,
        provider: "gemini",
        model,
      };
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

  console.warn(
    "All configured Gemini models are unavailable."
  );

  return null;
}