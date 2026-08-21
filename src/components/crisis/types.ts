import type { LucideIcon } from "lucide-react";

export type CrisisCategory = "Cyberattack" | "Economic Disruption" | "Regional Conflict";
export type Severity = "elevated" | "severe" | "critical";

export type CategoryMeta = {
  label: CrisisCategory;
  icon: LucideIcon;
  color: string;
};

export type CrisisEvent = {
  id: string;
  category: CrisisCategory;
  severity: Severity;
  headline: string;
  brief: string;
  region: string;
  source: string;
};

export type Classification = "CONFIDENTIAL" | "EYES ONLY" | "RESTRICTED";

export type Directive = {
  id: string;
  classification: Classification;
  from: string;
  subject: string;
  body: string;
  responses: string[];
};

export type DirectiveDecision = {
  directiveId: string;
  response: string;
  atSecond: number;
};
