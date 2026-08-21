import type { LucideIcon } from "lucide-react";

export type LearnCategory = "procedure" | "resolutions" | "strategy";

export type CategoryMeta = {
  id: LearnCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export type ContentStep = {
  type: "content";
  heading: string;
  body: string[];
  keyPoints?: string[];
};

export type QuizStep = {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type ModuleStep = ContentStep | QuizStep;

export type LearnModule = {
  id: string;
  category: LearnCategory;
  title: string;
  description: string;
  estimatedMinutes: number;
  steps: ModuleStep[];
  relatedHref?: string;
  relatedLabel?: string;
};
