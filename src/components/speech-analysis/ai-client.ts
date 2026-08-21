import type { AnalyzeInput, SpeechDiagnostic } from "@/components/speech-analysis/types";

// Live API latency can spike well beyond typical response times. Bound the
// wait so a slow call falls back to the local heuristic instead of leaving
// the UI stuck on a spinner indefinitely.
const DIAGNOSTIC_TIMEOUT_MS = 35_000;

/**
 * Requests a Gemini-scored diagnostic for a speech transcript. Throws on any
 * failure — callers should fall back to the local heuristic (analyzeSpeech)
 * so the tool never breaks for lack of a live model.
 */
export async function fetchDiagnostic(input: AnalyzeInput): Promise<SpeechDiagnostic> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DIAGNOSTIC_TIMEOUT_MS);
  try {
    const res = await fetch("/api/speech-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Speech analysis request failed (${res.status})`);
    }

    return (await res.json()) as SpeechDiagnostic;
  } finally {
    clearTimeout(timeoutId);
  }
}
