export type SpeechDimension = "confidence" | "diplomaticTone" | "evidenceDensity" | "structure" | "pacing";

export type DimensionResult = {
  score: number;
  notes: string[];
  highlights: string[];
};

export type PacingSource = "recorded" | "estimated" | "unmeasured";

export type SpeechDiagnostic = {
  composite: number;
  grade: string;
  wordCount: number;
  dimensions: Record<SpeechDimension, DimensionResult>;
  strengths: SpeechDimension[];
  growthAreas: SpeechDimension[];
  pacingSource: PacingSource;
  wpm: number | null;
};

export type AnalyzeContext = {
  country?: string;
  committee?: string;
  topic?: string;
};

export type AnalyzeInput = {
  text: string;
  durationSeconds: number | null;
  context?: AnalyzeContext;
};
