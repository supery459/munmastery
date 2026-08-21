export type PositionPaperCriterion = "policyAlignment" | "topicAnalysis" | "proposedSolutions" | "formatting";

export type CriterionResult = {
  score: number;
  notes: string[];
  highlights: string[];
};

export type PositionPaperReview = {
  composite: number;
  grade: string;
  wordCount: number;
  criteria: Record<PositionPaperCriterion, CriterionResult>;
  strengths: PositionPaperCriterion[];
  growthAreas: PositionPaperCriterion[];
  summary: string;
};

export type GradeInput = {
  text: string;
  country: string;
  topic: string;
};
