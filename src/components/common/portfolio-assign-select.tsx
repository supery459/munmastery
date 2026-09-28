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
  className = "max-w-full rounded-lg border border-panel-border bg-panel px-1.5 py-1 text-[10px] text-foreground-muted focus:border-accent-cyan/40 focus:outline-none",
}: {
  eventId: string;
  portfolioId: string | null | undefined;
  onChanged?: () => void;
  className?: string;
}) {
  const [portfolios] = useState(() => getPortfolios());
  const [error, setError] = useState("");
  if (portfolios.length === 0) return null;

  return (
    <span className="max-w-full"><select
      value={portfolioId ?? ""}
      onChange={(e) => {
        try {
          assignActivityPortfolio(eventId, e.target.value || null);
          setError(""); onChanged?.();
        } catch (error) { setError(error instanceof Error ? error.message : "Unable to assign item."); }
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
    </select>{error && <span role="alert" className="block text-xs text-accent-rose">{error}</span>}</span>
  );
}
