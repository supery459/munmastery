import type { Committee, Country, ScoreResult, SpeechRecord, Topic } from "@/components/simulator/types";

export type DelegateMode = "opening" | "caucus" | "point";

// Live API latency can spike well beyond typical response times. Bound the
// wait so a slow call falls back to the local generator/scorer instead of
// leaving the UI stuck — callers already treat any rejection as "fall back".
const DELEGATE_TIMEOUT_MS = 25_000;
const SCORECARD_TIMEOUT_MS = 35_000;

function withTimeout(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

async function readStreamedText(res: Response, onChunk?: (fullTextSoFar: string) => void): Promise<string> {
  if (!res.body) throw new Error("No response body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk?.(full);
  }
  return full.trim();
}

/**
 * Streams a live, Gemini-generated delegate speech or point of inquiry.
 * Throws on any failure — callers should catch and fall back to the local
 * statement generator so a session never breaks for lack of a live model.
 */
export async function streamDelegateSpeech(
  params: {
    mode: DelegateMode;
    committee: Pick<Committee, "name">;
    topic: Pick<Topic, "title" | "brief" | "keyIssues">;
    country: Pick<Country, "name" | "formalName" | "bloc" | "priorities">;
    targetCountryName?: string;
  },
  onChunk?: (fullTextSoFar: string) => void,
): Promise<string> {
  const { signal, clear } = withTimeout(DELEGATE_TIMEOUT_MS);
  try {
    const res = await fetch("/api/simulator/delegate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Delegate speech request failed (${res.status})`);
    }

    const text = await readStreamedText(res, onChunk);
    if (text.length === 0) {
      throw new Error("Empty response from delegate speech endpoint");
    }
    return text;
  } finally {
    clear();
  }
}

/**
 * Requests a Gemini-scored executive debrief for a completed session.
 * Throws on any failure — callers should fall back to the local heuristic
 * scorer (scoreSession) so the debrief screen never breaks.
 */
export async function fetchScorecard(
  context: {
    committee: Pick<Committee, "name" | "shortName">;
    topic: Pick<Topic, "title" | "keyIssues">;
    country: Pick<Country, "code" | "name" | "formalName">;
  },
  speeches: SpeechRecord[],
): Promise<ScoreResult> {
  const { signal, clear } = withTimeout(SCORECARD_TIMEOUT_MS);
  try {
    const res = await fetch("/api/simulator/scorecard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...context, speeches }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Scorecard request failed (${res.status})`);
    }

    return (await res.json()) as ScoreResult;
  } finally {
    clear();
  }
}
