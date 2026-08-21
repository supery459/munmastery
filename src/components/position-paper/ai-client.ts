import type { GradeInput, PositionPaperReview } from "@/components/position-paper/types";

// Live API latency can spike well beyond typical response times. Bound the
// wait so a slow call falls back to the local heuristic instead of leaving
// the UI stuck on a spinner indefinitely.
const GRADE_TIMEOUT_MS = 35_000;

/**
 * Requests a Gemini-scored review for a position paper draft. Throws on any
 * failure — callers should fall back to the local heuristic
 * (analyzePositionPaper) so the tool never breaks for lack of a live model.
 */
export async function fetchReview(input: GradeInput): Promise<PositionPaperReview> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRADE_TIMEOUT_MS);
  try {
    const res = await fetch("/api/position-paper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Position paper review request failed (${res.status})`);
    }

    return (await res.json()) as PositionPaperReview;
  } finally {
    clearTimeout(timeoutId);
  }
}
