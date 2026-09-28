import "server-only";
import { GoogleGenAI } from "@google/genai";

/**
 * Server-only Gemini client. Never import this from a client component —
 * the `server-only` import above makes that a build-time error.
 */

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
export const GEMINI_FALLBACK_MODEL = "gemini-2.5-flash";

export function isTransientModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(408|429|500|502|503|504)\b|UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|high demand|timeout/i.test(message);
}

export async function generateContentWithFallback(params: Parameters<GoogleGenAI["models"]["generateContent"]>[0]) {
  const client = getGeminiClient();
  const models = params.model === GEMINI_FALLBACK_MODEL
    ? [params.model, params.model]
    : [params.model, GEMINI_FALLBACK_MODEL, params.model];
  const startedAt = Date.now();
  let lastError: unknown;

  for (const [index, model] of models.entries()) {
    if (index === 2 && Date.now() - startedAt > 20_000) break;
    if (index > 0) await new Promise((resolve) => setTimeout(resolve, index === 1 ? 500 : 1_500));
    if (params.config?.abortSignal?.aborted) throw lastError ?? new Error("Request cancelled");

    try {
      return await client.models.generateContent({
        ...params,
        model,
        config: { ...params.config, thinkingConfig: model === params.model ? params.config?.thinkingConfig : undefined },
      });
    } catch (error) {
      if (!isTransientModelError(error) || params.config?.abortSignal?.aborted) throw error;
      lastError = error;
    }
  }

  throw lastError;
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
