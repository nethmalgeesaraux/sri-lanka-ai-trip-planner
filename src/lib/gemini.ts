import { GoogleGenAI } from "@google/genai";

const MODEL_CANDIDATES = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

export async function generateGeminiContent({
  apiKey,
  contents,
  systemInstruction,
  responseMimeType,
  temperature = 0.6,
  maxOutputTokens = 8000,
}: {
  apiKey: string;
  contents: string;
  systemInstruction: string;
  responseMimeType?: "application/json" | "text/plain";
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown;

  for (const model of MODEL_CANDIDATES) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          ...(responseMimeType ? { responseMimeType } : {}),
          temperature,
          maxOutputTokens,
        },
      });
      if (response.text) {
        return response.text;
      }
    } catch (error) {
      lastError = error;
      const status =
        typeof error === "object" && error && "status" in error
          ? Number((error as { status?: number }).status)
          : 0;
      // Retry next model candidate on transient 503/429/404 model unavailability
      if ([404, 429, 503].includes(status)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini models are temporarily busy. Please try again.");
}
