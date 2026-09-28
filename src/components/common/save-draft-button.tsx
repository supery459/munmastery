"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { recordActivity, requestedDraftEntry, type ActivityDetails } from "@/lib/activity-store";
import { getActivePortfolioId } from "@/lib/portfolio-store";

export function SaveDraftButton({ details }: { details: Extract<ActivityDetails, { kind: "speech" | "positionPaper" }> }) {
  const [status, setStatus] = useState<{ message: string; version: string } | null>(null);
  const version = JSON.stringify(details.input);
  function save() {
    try {
      const existingDraft = requestedDraftEntry();
      recordActivity({
        type: details.kind, title: details.kind === "speech" ? "Speech draft" : "Position paper draft",
        subtitle: details.input.text.trim().slice(0, 100), draft: true, details,
        portfolioId: existingDraft ? (existingDraft.portfolioId ?? null) : getActivePortfolioId(),
      });
      setStatus({ message: "Draft saved.", version });
    } catch (error) { setStatus({ message: error instanceof Error ? error.message : "Unable to save draft.", version }); }
  }
  return <div className="mt-3 flex flex-wrap items-center gap-3">
    <button type="button" onClick={save} disabled={!details.input.text.trim()} className="flex items-center gap-2 rounded-lg border border-panel-border px-3 py-2 text-xs disabled:opacity-40">
      <Save className="h-4 w-4" />Save draft
    </button>
    <span role="status" className="text-xs text-foreground-muted">{status?.version === version ? status.message : ""}</span>
  </div>;
}
