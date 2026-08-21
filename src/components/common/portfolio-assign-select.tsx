"use client";

import { useState } from "react";
import { getPortfolios } from "@/lib/portfolio-store";
import { assignActivityPortfolio } from "@/lib/activity-store";

/**
 * Lets a delegate retroactively pin (or un-pin) an existing activity event —
 * a graded position paper, a speech check, or a simulator session — to one
 * of their conference portfolios. Renders nothing if there are no portfolios
 * to assign to yet.
 */
export function PortfolioAssignSelect({
  eventId,
  portfolioId,
  onChanged,
  className = "rounded-lg border border-panel-border bg-panel px-1.5 py-1 text-[10px] text-foreground-muted focus:border-accent-cyan/40 focus:outline-none",
}: {
  eventId: string;
  portfolioId: string | null | undefined;
  onChanged?: () => void;
  className?: string;
}) {
  const [portfolios] = useState(() => getPortfolios());
  if (portfolios.length === 0) return null;

  return (
    <select
      value={portfolioId ?? ""}
      onChange={(e) => {
        assignActivityPortfolio(eventId, e.target.value || null);
        onChanged?.();
      }}
      onClick={(e) => e.stopPropagation()}
      className={className}
      aria-label="Assign to conference portfolio"
    >
      <option value="">No portfolio</option>
      {portfolios.map((p) => (
        <option key={p.id} value={p.id}>
          {p.conferenceName}
        </option>
      ))}
    </select>
  );
}
