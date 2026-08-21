import type { LucideIcon } from "lucide-react";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Bloc =
  | "Atlantic Alliance"
  | "European Union"
  | "Eurasian Bloc"
  | "Global Development Partnership"
  | "Non-Aligned Voices"
  | "Global South Coalition"
  | "African Union Caucus"
  | "Eastern Frontline States"
  | "Middle East Coalition"
  | "Asia-Pacific Partnership"
  | "Latin American Bloc"
  | "Independent Delegation";

export type Country = {
  code: string;
  name: string;
  formalName: string;
  bloc: Bloc;
  priorities: string[];
  openers: string[];
  stanceVerbs: string[];
  closers: string[];
};

export type Committee = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
};

export type Topic = {
  id: string;
  committeeId: string;
  title: string;
  brief: string;
  keyIssues: string[];
  concerns: string[];
};

export type DifficultySettings = {
  label: string;
  description: string;
  openingSpeechTime: number;
  caucusSpeechTime: number;
  pointResponseTime: number;
  typingDelayMs: number;
  readPauseMs: number;
  pointOfInquiry: boolean;
  chairTone: "supportive" | "neutral" | "strict";
};

export type SimulatorConfig = {
  committee: Committee;
  topic: Topic;
  country: Country;
  difficulty: Difficulty;
};

export type FeedEntry =
  | { id: string; kind: "chair"; text: string }
  | { id: string; kind: "typing"; country: Country }
  | {
      id: string;
      kind: "ai-speech";
      country: Country;
      text: string;
      role: "opening" | "caucus" | "point";
    }
  | {
      id: string;
      kind: "user-speech";
      text: string;
      role: "opening" | "caucus" | "point";
      timedOut: boolean;
    }
  | {
      id: string;
      kind: "motion";
      mover: Country;
      text: string;
      status: "pending" | "passed" | "failed";
    }
  | {
      id: string;
      kind: "point-prompt";
      raiser: Country;
      question: string;
    };

export type SpeechRecord = {
  text: string;
  timedOut: boolean;
  timeLimit: number;
  role: "opening" | "caucus" | "point";
};

export type SessionResult = {
  config: SimulatorConfig;
  speeches: SpeechRecord[];
  transcript: FeedEntry[];
};

export type ScoreDimension = "clarity" | "diplomaticStrategy" | "researchDepth" | "persuasiveness";

export type ScoreBreakdown = {
  score: number;
  notes: string[];
};

export type ScoreResult = {
  composite: number;
  grade: string;
  percentile: number;
  dimensions: Record<ScoreDimension, ScoreBreakdown>;
  strengths: ScoreDimension[];
  growthAreas: ScoreDimension[];
  summary: string;
};

/**
 * The minimal, JSON-serializable slice of SimulatorConfig that scoring needs.
 * SimulatorConfig satisfies this structurally (it has strictly more fields),
 * so the same derivation functions work from either the live client config
 * (which carries a non-serializable Committee.icon) or a plain object
 * reconstructed from an API request body.
 */
export type ScoreContext = {
  committee: { name: string; shortName: string };
  topic: { title: string; keyIssues: string[] };
  country: { code: string; name: string };
};
