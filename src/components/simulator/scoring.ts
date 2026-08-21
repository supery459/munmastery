import { COUNTRIES } from "@/components/simulator/data";
import type {
  ScoreBreakdown,
  ScoreContext,
  ScoreDimension,
  ScoreResult,
  SpeechRecord,
} from "@/components/simulator/types";

const FILLER_WORDS = ["um", "uh", "like", "basically", "actually", "sort of", "kind of", "you know"];
const MECHANISM_WORDS = [
  "propose",
  "call upon",
  "calls upon",
  "working paper",
  "resolution",
  "cooperate",
  "coalition",
  "partnership",
  "sponsor",
  "framework",
  "mechanism",
];
const SPECIFICITY_WORDS = ["resolution", "treaty", "charter", "framework", "mechanism", "article", "percent", "%"];
const CALL_TO_ACTION = [
  "we must",
  "must act",
  "the international community should",
  "it is imperative",
  "calls on",
  "call upon",
  "urge",
  "urges",
  "we cannot afford",
  "now is the time",
];

function clamp(n: number, min = 35, max = 98) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function countMatches(text: string, phrases: string[]): number {
  const lower = text.toLowerCase();
  return phrases.reduce((n, phrase) => (lower.includes(phrase.toLowerCase()) ? n + 1 : n), 0);
}

function wordCount(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function sentenceCount(text: string): number {
  const parts = text.split(/[.!?]+/).map((p) => p.trim()).filter(Boolean);
  return Math.max(1, parts.length);
}

function analyzeClarity(speech: SpeechRecord): ScoreBreakdown {
  const words = wordCount(speech.text);
  const notes: string[] = [];

  if (words === 0) {
    return {
      score: 40,
      notes: ["No remarks were delivered before yielding the floor — clarity can't be assessed from silence."],
    };
  }

  const expected = Math.max(20, Math.round(speech.timeLimit * 1.8));
  const ratio = words / expected;
  let score = 78;

  if (ratio < 0.25) {
    score -= 22;
    notes.push("The speech was noticeably short for the time allotted — there was room to develop the point further.");
  } else if (ratio < 0.55) {
    score -= 8;
    notes.push("A bit more development would have used the full speaking time.");
  } else if (ratio > 1.6) {
    score -= 6;
    notes.push("The remarks ran long relative to the time — tighten toward the strongest points.");
  } else {
    score += 10;
    notes.push("Speech length was well matched to the time allotted.");
  }

  const avgWordsPerSentence = words / sentenceCount(speech.text);
  if (avgWordsPerSentence > 28) {
    score -= 8;
    notes.push("Some sentences ran long — shorter sentences read more clearly under committee pressure.");
  } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 24) {
    score += 6;
    notes.push("Sentence length was tight and easy to follow.");
  }

  const fillers = countMatches(speech.text, FILLER_WORDS);
  if (fillers > 0) {
    score -= Math.min(18, fillers * 5);
    notes.push(`${fillers} filler word${fillers > 1 ? "s" : ""} crept into the delivery.`);
  }

  if (speech.timedOut && words < expected * 0.6) {
    score -= 8;
    notes.push("The chair cut in before the thought was fully completed — watch the clock earlier next time.");
  }

  return { score: clamp(score), notes: notes.slice(0, 2) };
}

function analyzeDiplomaticStrategy(speech: SpeechRecord, config: ScoreContext): ScoreBreakdown {
  const words = wordCount(speech.text);
  const notes: string[] = [];
  if (words === 0) {
    return { score: 42, notes: ["No position was put on the record, so no strategy could be evaluated."] };
  }

  let score = 68;
  const lower = speech.text.toLowerCase();

  const otherCountryMentions = COUNTRIES.filter((c) => c.code !== config.country.code).filter((c) =>
    lower.includes(c.name.toLowerCase()),
  ).length;
  if (otherCountryMentions > 0) {
    score += Math.min(14, otherCountryMentions * 7);
    notes.push("Directly engaging other delegations showed real coalition awareness.");
  }

  const mechanismHits = countMatches(speech.text, MECHANISM_WORDS);
  if (mechanismHits > 0) {
    score += Math.min(12, mechanismHits * 4);
    notes.push("Proposing concrete mechanisms, not just positions, strengthens a delegate's hand.");
  } else {
    notes.push("Naming a concrete mechanism or working paper next time would sharpen the strategy.");
  }

  if (!speech.timedOut) {
    score += 4;
  }

  return { score: clamp(score), notes: notes.slice(0, 2) };
}

function analyzeResearchDepth(speech: SpeechRecord, config: ScoreContext): ScoreBreakdown {
  const words = wordCount(speech.text);
  const notes: string[] = [];
  if (words === 0) {
    return { score: 40, notes: ["No content was delivered to evaluate for research depth."] };
  }

  let score = 64;
  const issuesHit = config.topic.keyIssues.filter((issue) =>
    speech.text.toLowerCase().includes(issue.toLowerCase()),
  ).length;
  if (issuesHit > 0) {
    score += Math.min(22, issuesHit * 8);
    notes.push(`Referenced ${issuesHit} specific sub-issue${issuesHit > 1 ? "s" : ""} from the topic brief.`);
  } else {
    notes.push("Tying remarks explicitly to the topic's key sub-issues would show deeper preparation.");
  }

  const specificity = countMatches(speech.text, SPECIFICITY_WORDS);
  if (specificity > 0) {
    score += Math.min(10, specificity * 4);
    notes.push("Citing mechanisms and instruments by name reads as well-researched.");
  }

  return { score: clamp(score), notes: notes.slice(0, 2) };
}

function analyzePersuasiveness(speech: SpeechRecord): ScoreBreakdown {
  const words = wordCount(speech.text);
  const notes: string[] = [];
  if (words === 0) {
    return { score: 40, notes: ["Persuasiveness can't be judged without remarks on the record."] };
  }

  let score = 66;
  const cta = countMatches(speech.text, CALL_TO_ACTION);
  if (cta > 0) {
    score += Math.min(16, cta * 8);
    notes.push("A clear call to action gave the speech real momentum.");
  } else {
    notes.push("Closing with an explicit call to action would land harder.");
  }

  if (speech.text.includes("?")) {
    score += 6;
    notes.push("A rhetorical question drew the room in.");
  }

  const modalHits = countMatches(speech.text, ["must", "will", "shall"]);
  if (modalHits >= 2) {
    score += 6;
  }

  if (words < 12) {
    score -= 14;
  }

  return { score: clamp(score), notes: notes.slice(0, 2) };
}

const DIMENSION_LABELS: Record<ScoreDimension, string> = {
  clarity: "Speaking clarity",
  diplomaticStrategy: "Diplomatic strategy",
  researchDepth: "Research depth",
  persuasiveness: "Persuasiveness",
};

export { DIMENSION_LABELS };

/**
 * Pure aggregation: turns four already-scored dimensions into the full
 * ScoreResult (composite, grade, percentile, strengths/growth, summary).
 * Shared by the local heuristic path and the Gemini-scored API route —
 * whichever produced the dimension scores, the assembly logic is identical
 * and stays deterministic (never left to the model to compute).
 */
export function deriveScoreResult(
  dimensions: Record<ScoreDimension, ScoreBreakdown>,
  context: ScoreContext,
): ScoreResult {
  const dims = Object.keys(dimensions) as ScoreDimension[];
  const composite = Math.round(dims.reduce((sum, d) => sum + dimensions[d].score, 0) / dims.length);

  const ranked = [...dims].sort((a, b) => dimensions[b].score - dimensions[a].score);
  const strengths = ranked.slice(0, 2);
  const growthAreas = ranked.slice(-2).reverse();

  const grade =
    composite >= 88 ? "Exceptional" : composite >= 76 ? "Strong" : composite >= 62 ? "Developing" : "Emerging";

  const percentile = clamp(composite - 3, 5, 99);

  const summary = `Representing ${context.country.name} in ${context.committee.shortName}, your strongest showing was ${DIMENSION_LABELS[strengths[0]].toLowerCase()} — the clearest opportunity to grow is ${DIMENSION_LABELS[growthAreas[0]].toLowerCase()}. Overall, this session reads as ${grade.toLowerCase()} delegate performance on ${context.topic.title.toLowerCase()}.`;

  return { composite, grade, percentile, dimensions, strengths, growthAreas, summary };
}

/** Heuristic per-dimension scoring — the local, no-API fallback. */
export function computeHeuristicDimensions(
  speeches: SpeechRecord[],
  context: ScoreContext,
): Record<ScoreDimension, ScoreBreakdown> {
  const usable = speeches.length > 0 ? speeches : [];

  function averageDimension(
    analyzer: (s: SpeechRecord) => ScoreBreakdown,
  ): ScoreBreakdown {
    if (usable.length === 0) {
      return { score: 50, notes: ["No speeches were delivered during this session."] };
    }
    const breakdowns = usable.map(analyzer);
    const score = Math.round(breakdowns.reduce((sum, b) => sum + b.score, 0) / breakdowns.length);
    const notes = Array.from(new Set(breakdowns.flatMap((b) => b.notes))).slice(0, 2);
    return { score, notes };
  }

  return {
    clarity: averageDimension((s) => analyzeClarity(s)),
    diplomaticStrategy: averageDimension((s) => analyzeDiplomaticStrategy(s, context)),
    researchDepth: averageDimension((s) => analyzeResearchDepth(s, context)),
    persuasiveness: averageDimension((s) => analyzePersuasiveness(s)),
  };
}

/** Convenience wrapper: local heuristic scoring end to end (no network call). */
export function scoreSession(speeches: SpeechRecord[], context: ScoreContext): ScoreResult {
  return deriveScoreResult(computeHeuristicDimensions(speeches, context), context);
}
