import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini client. Never import this from a client component —
 * the `server-only` import above makes that a build-time error.
 */

export const GEMINI_MODEL = "gemini-3.7-flash";

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
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}
