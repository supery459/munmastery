import type { AnalyzeInput, DimensionResult, SpeechDiagnostic, SpeechDimension } from "@/components/speech-analysis/types";

const HEDGES = [
  "i think",
  "i guess",
  "maybe",
  "perhaps",
  "sort of",
  "kind of",
  "possibly",
  "i'm not sure",
  "it might be",
  "could be wrong",
];
const FILLERS = ["um", "uh", "like", "basically", "actually", "you know"];
const ASSERTIVE = ["will", "must", "shall", "clearly", "firmly", "without question", "we are confident", "we are certain"];

const RESPECTFUL = [
  "the delegation of",
  "with respect",
  "we recognize",
  "we appreciate",
  "we understand the concerns of",
  "in the spirit of cooperation",
  "we thank the delegate",
  "distinguished delegates",
];
const HOSTILE = ["stupid", "ridiculous", "liar", "pathetic", "disgusting", "shut up", "nonsense", "absurd"];

const INSTITUTIONS = [
  "united nations",
  "security council",
  "world bank",
  "imf",
  "who",
  "world health organization",
  "unhcr",
  "nato",
  "african union",
  "european union",
];
const SOURCING = ["according to", "data shows", "research indicates", "studies show", "reports confirm", "statistics show", "evidence suggests"];
const INSTRUMENTS = ["resolution", "treaty", "charter", "convention", "protocol", "accord"];

const TRANSITIONS = [
  "first",
  "firstly",
  "second",
  "secondly",
  "third",
  "furthermore",
  "moreover",
  "in addition",
  "however",
  "therefore",
  "in conclusion",
  "to conclude",
  "finally",
  "consequently",
];
const OPENING_CUES = ["delegation", "committee", "today", "chair", "topic"];
const CLOSING_CUES = ["therefore", "in conclusion", "we urge", "we call", "must act", "thank you"];

function clamp(n: number, min = 30, max = 98) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function words(text: string): string[] {
  return text.trim().length === 0 ? [] : text.trim().split(/\s+/);
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function findMatches(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((p) => lower.includes(p));
}

function analyzeConfidence(text: string): DimensionResult {
  const w = words(text);
  if (w.length === 0) return { score: 35, notes: ["No text to analyze yet."], highlights: [] };

  let score = 70;
  const hedges = findMatches(text, HEDGES);
  const fillers = findMatches(text, FILLERS);
  const assertive = findMatches(text, ASSERTIVE);

  score -= Math.min(24, hedges.length * 6);
  score -= Math.min(16, fillers.length * 4);
  score += Math.min(15, assertive.length * 3);
  if (w.length < 25) score -= 15;

  const notes: string[] = [];
  if (hedges.length > 0) notes.push(`Hedging language (e.g. "${hedges[0]}") softened otherwise strong points.`);
  if (fillers.length > 0) notes.push(`${fillers.length} filler word${fillers.length > 1 ? "s" : ""} interrupted the flow.`);
  if (hedges.length === 0 && fillers.length === 0) notes.push("Delivery read as assured, with no hedging or filler words detected.");

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: [...hedges, ...fillers].slice(0, 4) };
}

function analyzeDiplomaticTone(text: string): DimensionResult {
  const w = words(text);
  if (w.length === 0) return { score: 40, notes: ["No text to analyze yet."], highlights: [] };

  let score = 74;
  const respectful = findMatches(text, RESPECTFUL);
  const hostile = findMatches(text, HOSTILE);
  const shoutingWords = (text.match(/\b[A-Z]{5,}\b/g) ?? []).filter((w2) => !["UNITED", "NATIONS", "COUNCIL"].includes(w2));
  const exclamations = (text.match(/!/g) ?? []).length;

  score += Math.min(18, respectful.length * 5);
  score -= Math.min(40, hostile.length * 14);
  score -= Math.min(18, shoutingWords.length * 6);
  if (exclamations > 2) score -= 6;

  const notes: string[] = [];
  if (hostile.length > 0) notes.push("Language crossed into undiplomatic territory — reframe criticism around policy, not people.");
  if (respectful.length > 0) notes.push("Respectful, formal address strengthened credibility with the room.");
  if (respectful.length === 0 && hostile.length === 0) notes.push("Tone was neutral — a respectful opening address would raise the ceiling here.");

  return {
    score: clamp(score),
    notes: notes.slice(0, 2),
    highlights: [...respectful, ...hostile].slice(0, 4),
  };
}

function analyzeEvidenceDensity(text: string): DimensionResult {
  const w = words(text);
  if (w.length === 0) return { score: 35, notes: ["No text to analyze yet."], highlights: [] };

  const numbers = text.match(/\b\d+(\.\d+)?%?\b/g) ?? [];
  const institutions = findMatches(text, INSTITUTIONS);
  const sourcing = findMatches(text, SOURCING);
  const instruments = findMatches(text, INSTRUMENTS);
  const totalMarkers = numbers.length + institutions.length + sourcing.length + instruments.length;
  const density = totalMarkers / (w.length / 100);

  const score = 55 + Math.min(38, density * 8);

  const notes: string[] = [];
  if (totalMarkers === 0) notes.push("No data points, named institutions, or cited instruments — the argument leans on assertion alone.");
  else notes.push(`${totalMarkers} evidence marker${totalMarkers > 1 ? "s" : ""} detected across the speech.`);
  if (sourcing.length > 0) notes.push("Explicit sourcing phrases gave claims real weight.");

  return {
    score: clamp(score),
    notes: notes.slice(0, 2),
    highlights: [...numbers.slice(0, 2), ...institutions, ...instruments].slice(0, 4),
  };
}

function analyzeStructure(text: string): DimensionResult {
  const w = words(text);
  const s = sentences(text);
  if (w.length === 0) return { score: 38, notes: ["No text to analyze yet."], highlights: [] };

  const transitions = findMatches(text, TRANSITIONS);
  const avgSentenceLength = w.length / Math.max(1, s.length);
  const opensWell = s.length > 0 && OPENING_CUES.some((cue) => s[0].toLowerCase().includes(cue));
  const closesWell = s.length > 0 && CLOSING_CUES.some((cue) => s[s.length - 1].toLowerCase().includes(cue));

  let score = 60;
  score += Math.min(20, transitions.length * 5);
  if (opensWell) score += 8;
  if (closesWell) score += 10;
  if (avgSentenceLength > 30) score -= 10;
  else if (avgSentenceLength >= 10 && avgSentenceLength <= 24) score += 6;

  const notes: string[] = [];
  if (transitions.length === 0) notes.push("Adding signposting words (first, therefore, in conclusion) would make the structure easier to follow.");
  else notes.push(`Clear signposting (${transitions.slice(0, 2).join(", ")}) guided the listener through the argument.`);
  if (!closesWell) notes.push("A stronger closing line would leave the committee with a clear takeaway.");

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: transitions.slice(0, 4) };
}

function analyzePacingFromDuration(wordCount: number, durationSeconds: number): DimensionResult {
  const wpm = wordCount / (durationSeconds / 60);
  let score: number;
  let note: string;

  if (wpm >= 110 && wpm <= 150) {
    score = 90;
    note = `A measured ${Math.round(wpm)} words per minute — right in the range for clear, confident delivery.`;
  } else if (wpm >= 90 && wpm < 110) {
    score = 76;
    note = `${Math.round(wpm)} words per minute ran a little slow — a touch more energy would help.`;
  } else if (wpm > 150 && wpm <= 170) {
    score = 76;
    note = `${Math.round(wpm)} words per minute ran a little fast — the room may struggle to keep up.`;
  } else if (wpm < 90) {
    score = 55;
    note = `${Math.round(wpm)} words per minute is noticeably slow — this speech risks losing the room's attention.`;
  } else {
    score = 52;
    note = `${Math.round(wpm)} words per minute is quite fast — slow down on key points so they land.`;
  }

  return { score: clamp(score), notes: [note], highlights: [`${Math.round(wpm)} wpm`] };
}

function analyzePacingFromText(text: string): DimensionResult {
  const w = words(text);
  const s = sentences(text);
  if (w.length === 0) return { score: 40, notes: ["No text to analyze yet."], highlights: [] };

  const avgSentenceLength = w.length / Math.max(1, s.length);
  let score = 64;
  if (avgSentenceLength > 32) score -= 12;
  if (avgSentenceLength < 8) score -= 6;

  return {
    score: clamp(score, 40, 82),
    notes: ["Estimated from sentence rhythm — record your speech or add a delivery time for a precise pacing read."],
    highlights: [],
  };
}

const DIMENSION_LABELS: Record<SpeechDimension, string> = {
  confidence: "Confidence",
  diplomaticTone: "Diplomatic tone",
  evidenceDensity: "Evidence density",
  structure: "Structure",
  pacing: "Pacing",
};

export { DIMENSION_LABELS };
export { words, analyzePacingFromDuration, analyzePacingFromText };

/**
 * Pure aggregation: turns five already-scored dimensions into the full
 * SpeechDiagnostic (composite, grade, strengths/growth). Shared by the
 * local heuristic path and the Gemini-scored API route.
 */
export function deriveDiagnostic(
  dimensions: Record<SpeechDimension, DimensionResult>,
  wordCount: number,
  pacingSource: SpeechDiagnostic["pacingSource"],
  wpm: number | null,
): SpeechDiagnostic {
  const dims = Object.keys(dimensions) as SpeechDimension[];
  const composite =
    wordCount === 0 ? 0 : Math.round(dims.reduce((sum, d) => sum + dimensions[d].score, 0) / dims.length);

  const ranked = [...dims].sort((a, b) => dimensions[b].score - dimensions[a].score);

  const grade =
    composite >= 88 ? "Exceptional" : composite >= 76 ? "Strong" : composite >= 62 ? "Developing" : "Emerging";

  return {
    composite,
    grade,
    wordCount,
    dimensions,
    strengths: ranked.slice(0, 2),
    growthAreas: ranked.slice(-2).reverse(),
    pacingSource,
    wpm,
  };
}

/** Local, no-API heuristic diagnostic — the fallback path. */
export function analyzeSpeech(input: AnalyzeInput): SpeechDiagnostic {
  const wordCount = words(input.text).length;
  const hasDuration = input.durationSeconds !== null && input.durationSeconds >= 8;

  const dimensions: Record<SpeechDimension, DimensionResult> = {
    confidence: analyzeConfidence(input.text),
    diplomaticTone: analyzeDiplomaticTone(input.text),
    evidenceDensity: analyzeEvidenceDensity(input.text),
    structure: analyzeStructure(input.text),
    pacing: hasDuration
      ? analyzePacingFromDuration(wordCount, input.durationSeconds as number)
      : analyzePacingFromText(input.text),
  };

  return deriveDiagnostic(
    dimensions,
    wordCount,
    hasDuration ? "recorded" : wordCount > 0 ? "estimated" : "unmeasured",
    hasDuration ? Math.round(wordCount / ((input.durationSeconds as number) / 60)) : null,
  );
}
