import type { CriterionResult, GradeInput, PositionPaperCriterion, PositionPaperReview } from "@/components/position-paper/types";

const SOLUTION_VERBS = [
  "propose",
  "recommend",
  "call upon",
  "calls upon",
  "urge",
  "urges",
  "encourage",
  "establish",
  "create a",
  "implement",
  "strengthen",
  "increase funding",
  "mandate",
];
const MECHANISM_WORDS = ["framework", "mechanism", "fund", "task force", "monitoring body", "committee", "initiative", "protocol"];
const BACKGROUND_WORDS = ["background", "history", "since", "root cause", "originated", "context", "crisis began", "decades"];
const PRECEDENT_WORDS = ["resolution", "treaty", "convention", "charter", "accord", "united nations", "security council", "general assembly"];
const POLICY_VOICE = ["the delegation of", "our nation", "our government", "we believe", "our policy", "consistent with", "in line with"];
const SECTION_HEADERS = /^(background|statement of the problem|policy|country policy|proposed solutions|solutions|conclusion)[:.\-]?\s*$/im;
const BULLET_OR_NUMBERED = /^\s*(?:[-*•]|\d+[.)])\s+/m;

function clamp(n: number, min = 25, max = 98) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function words(text: string): string[] {
  return text.trim().length === 0 ? [] : text.trim().split(/\s+/);
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function findMatches(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  return phrases.filter((p) => lower.includes(p));
}

function analyzePolicyAlignment(text: string, country: string): CriterionResult {
  const w = words(text);
  if (w.length === 0) return { score: 30, notes: ["No text to analyze yet."], highlights: [] };

  const lower = text.toLowerCase();
  const voice = findMatches(text, POLICY_VOICE);
  const countryMentions = country.trim()
    ? (lower.match(new RegExp(country.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length
    : 0;

  let score = 58;
  score += Math.min(20, voice.length * 6);
  if (country.trim()) {
    score += countryMentions > 0 ? Math.min(16, countryMentions * 4) : -12;
  }

  const notes: string[] = [];
  if (country.trim() && countryMentions === 0) {
    notes.push(`The stated delegation (${country.trim()}) is never named in the draft — say explicitly whose policy this is.`);
  } else if (voice.length > 0) {
    notes.push("Consistent first-person delegation voice makes the policy stance read as authentic and owned.");
  } else {
    notes.push("Adding explicit delegation framing (\"the delegation of...\", \"our nation believes...\") would sharpen the policy voice.");
  }

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: voice.slice(0, 4) };
}

function analyzeTopicAnalysis(text: string, topic: string): CriterionResult {
  const w = words(text);
  if (w.length === 0) return { score: 30, notes: ["No text to analyze yet."], highlights: [] };

  const background = findMatches(text, BACKGROUND_WORDS);
  const precedent = findMatches(text, PRECEDENT_WORDS);
  const topicWords = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 3);
  const lower = text.toLowerCase();
  const topicHits = topicWords.filter((t) => lower.includes(t));

  let score = 55;
  score += Math.min(18, background.length * 6);
  score += Math.min(14, precedent.length * 4);
  if (topic.trim()) score += topicHits.length > 0 ? Math.min(10, topicHits.length * 3) : -8;
  if (w.length < 150) score -= 12;

  const notes: string[] = [];
  if (background.length === 0) notes.push("No clear background or root-cause discussion — grounding the issue's history strengthens the analysis.");
  else notes.push("Background context gives the reader a clear sense of how the issue developed.");
  if (precedent.length > 0) notes.push(`References prior international action (${precedent.slice(0, 2).join(", ")}), which shows real research.`);

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: [...background, ...precedent].slice(0, 4) };
}

function analyzeProposedSolutions(text: string): CriterionResult {
  const w = words(text);
  if (w.length === 0) return { score: 30, notes: ["No text to analyze yet."], highlights: [] };

  const verbs = findMatches(text, SOLUTION_VERBS);
  const mechanisms = findMatches(text, MECHANISM_WORDS);
  const hasList = BULLET_OR_NUMBERED.test(text);

  let score = 52;
  score += Math.min(24, verbs.length * 6);
  score += Math.min(16, mechanisms.length * 5);
  if (hasList) score += 8;

  const notes: string[] = [];
  if (verbs.length === 0) notes.push("No clear action verbs (propose, urge, establish) — solutions read as vague rather than actionable.");
  else notes.push(`${verbs.length} concrete call${verbs.length > 1 ? "s" : ""} to action detected, which gives the committee something to vote on.`);
  if (mechanisms.length > 0) notes.push(`Naming specific mechanisms (${mechanisms.slice(0, 2).join(", ")}) makes the proposal feel implementable.`);
  else if (verbs.length > 0) notes.push("Naming a specific mechanism or body to carry out the proposal would make it more concrete.");

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: [...verbs, ...mechanisms].slice(0, 4) };
}

function analyzeFormatting(text: string): CriterionResult {
  const w = words(text);
  const paras = paragraphs(text);
  if (w.length === 0) return { score: 30, notes: ["No text to analyze yet."], highlights: [] };

  const hasHeaders = SECTION_HEADERS.test(text);
  const hasList = BULLET_OR_NUMBERED.test(text);

  let score = 58;
  if (hasHeaders) score += 16;
  if (hasList) score += 8;
  if (paras.length >= 3) score += 10;
  else score -= 8;
  if (w.length < 120) score -= 18;
  else if (w.length > 900) score -= 8;

  const notes: string[] = [];
  if (!hasHeaders) notes.push("Clear section headers (Background, Policy, Proposed Solutions) would make this easier for a chair to skim.");
  else notes.push("Section headers give the paper a clean, professional structure.");
  if (paras.length < 3) notes.push("A position paper usually runs at least a few distinct paragraphs — this reads thin.");

  return { score: clamp(score), notes: notes.slice(0, 2), highlights: [] };
}

const GRADE_THRESHOLDS: [number, string][] = [
  [88, "Exceptional"],
  [76, "Strong"],
  [62, "Developing"],
  [0, "Emerging"],
];

function gradeFor(composite: number): string {
  return GRADE_THRESHOLDS.find(([min]) => composite >= min)![1];
}

const CRITERION_LABELS: Record<PositionPaperCriterion, string> = {
  policyAlignment: "Country policy alignment",
  topicAnalysis: "Topic analysis",
  proposedSolutions: "Proposed solutions",
  formatting: "Formatting & structure",
};

export { CRITERION_LABELS, words };

/**
 * Pure aggregation: turns four already-scored criteria into the full
 * PositionPaperReview (composite, grade, strengths/growth). Shared by the
 * local heuristic path and the Gemini-scored API route.
 */
export function deriveReview(
  criteria: Record<PositionPaperCriterion, CriterionResult>,
  wordCount: number,
  summary: string,
): PositionPaperReview {
  const keys = Object.keys(criteria) as PositionPaperCriterion[];
  const composite = wordCount === 0 ? 0 : Math.round(keys.reduce((sum, k) => sum + criteria[k].score, 0) / keys.length);
  const ranked = [...keys].sort((a, b) => criteria[b].score - criteria[a].score);

  return {
    composite,
    grade: gradeFor(composite),
    wordCount,
    criteria,
    strengths: ranked.slice(0, 2),
    growthAreas: ranked.slice(-2).reverse(),
    summary,
  };
}

function buildLocalSummary(criteria: Record<PositionPaperCriterion, CriterionResult>, wordCount: number): string {
  if (wordCount === 0) return "Paste or upload a draft to get a scored review.";
  const keys = Object.keys(criteria) as PositionPaperCriterion[];
  const ranked = [...keys].sort((a, b) => criteria[b].score - criteria[a].score);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  return `Strongest section: ${CRITERION_LABELS[best]}. Focus your next revision on ${CRITERION_LABELS[worst].toLowerCase()} — ${criteria[worst].notes[0]?.toLowerCase() ?? "it scored lowest of the four criteria."}`;
}

/** Local, no-API heuristic review — the fallback path. */
export function analyzePositionPaper(input: GradeInput): PositionPaperReview {
  const wordCount = words(input.text).length;

  const criteria: Record<PositionPaperCriterion, CriterionResult> = {
    policyAlignment: analyzePolicyAlignment(input.text, input.country),
    topicAnalysis: analyzeTopicAnalysis(input.text, input.topic),
    proposedSolutions: analyzeProposedSolutions(input.text),
    formatting: analyzeFormatting(input.text),
  };

  return deriveReview(criteria, wordCount, buildLocalSummary(criteria, wordCount));
}
