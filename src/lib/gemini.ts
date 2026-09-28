import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini client. Never import this from a client component —
 * the `server-only` import above makes that a build-time error.
 */

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";
export const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

export function isTransientModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(429|500|503)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|timeout/i.test(message);
}

export async function generateContentWithFallback(params: Parameters<GoogleGenAI["models"]["generateContent"]>[0]) {
  const client = getGeminiClient();
  try {
    return await client.models.generateContent(params);
  } catch (error) {
    if (!isTransientModelError(error) || params.model === GEMINI_FALLBACK_MODEL) throw error;
    return client.models.generateContent({ ...params, model: GEMINI_FALLBACK_MODEL, config: { ...params.config, thinkingConfig: undefined } });
  }
}

export class MissingApiKeyError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not set. Add it to .env.local to enable live AI responses.");
    this.name = "MissingApiKeyError";
  }
}

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey, httpOptions: { timeout: 15_000 } });
  }
  return cachedClient;
}
