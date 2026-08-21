"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  FolderKanban,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { PortfolioFormModal } from "@/components/portfolios/portfolio-form-modal";
import {
  createPortfolio,
  daysUntil,
  deletePortfolio,
  getActivePortfolioId,
  getPortfolios,
  setActivePortfolioId,
  updatePortfolio,
  type Portfolio,
  type PortfolioInput,
} from "@/lib/portfolio-store";

function deadlineLabel(portfolio: Portfolio): { text: string; tone: "muted" | "gold" | "rose" } | null {
  if (!portfolio.positionPaperDeadline) return null;
  const remaining = daysUntil(portfolio.positionPaperDeadline);
  if (remaining < 0) return { text: `Paper deadline passed ${Math.abs(remaining)}d ago`, tone: "rose" };
  if (remaining === 0) return { text: "Paper due today", tone: "gold" };
  if (remaining <= 7) return { text: `Paper due in ${remaining}d`, tone: "gold" };
  return { text: `Paper due in ${remaining}d`, tone: "muted" };
}

function PortfolioHub() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => getPortfolios());
  const [activeId, setActiveId] = useState<string | null>(() => getActivePortfolioId());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Portfolio | undefined>(undefined);
  // Bumped on every open so <PortfolioFormModal> remounts with fresh initial
  // field values instead of reusing stale state from a previous open.
  const [formKey, setFormKey] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  function refresh() {
    setPortfolios(getPortfolios());
    setActiveId(getActivePortfolioId());
  }

  function openCreate() {
    setEditing(undefined);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function openEdit(p: Portfolio) {
    setEditing(p);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  }

  function handleSubmit(input: PortfolioInput) {
    if (editing) updatePortfolio(editing.id, input);
    else createPortfolio(input);
    setFormOpen(false);
    refresh();
  }

  function handleSetActive(id: string) {
    setActivePortfolioId(id);
    refresh();
  }

  function handleDelete(id: string) {
    deletePortfolio(id);
    setConfirmingDelete(null);
    refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Dashboard" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <FolderKanban className="h-4 w-4 text-accent-cyan" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">Portfolios</div>
          <div className="text-xs text-foreground-muted">One workspace per conference</div>
        </div>
        <button
          onClick={openCreate}
          className="glow-cyan glass-hover flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-3.5 py-2 text-xs font-medium text-[#05070d]"
        >
          <Plus className="h-3.5 w-3.5" />
          New portfolio
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {portfolios.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-panel-border bg-white/[0.02] px-6 py-16 text-center">
            <FolderKanban className="h-8 w-8 text-foreground-muted" />
            <h1 className="text-lg font-semibold text-foreground">No conference portfolios yet</h1>
            <p className="text-sm text-foreground-muted">
              Create one for your next conference — committee, country, and agenda topics all in one place — and the
              simulator, speech lab, and position paper grader will tailor themselves to it.
            </p>
            <button
              onClick={openCreate}
              className="glow-cyan glass-hover mt-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-5 py-2.5 text-sm font-medium text-[#05070d]"
            >
              <Plus className="h-4 w-4" />
              Create your first portfolio
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Your conferences</h1>
              <p className="mt-1 text-sm text-foreground-muted">
                Set one portfolio as Active to have practice tools default to its country and topic.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {portfolios.map((p) => {
                const isActive = p.id === activeId;
                const deadline = deadlineLabel(p);
                return (
                  <div key={p.id} className="panel flex flex-col rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/portfolios/${p.id}`} className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-semibold text-foreground hover:underline">
                          {p.conferenceName}
                        </h2>
                      </Link>
                      {isActive && (
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-emerald/15 px-2 py-0.5 text-[10px] font-medium text-accent-emerald">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-panel-border px-2 py-0.5 text-[11px] text-foreground-muted">
                        {p.committee}
                      </span>
                      <span className="rounded-full border border-panel-border px-2 py-0.5 text-[11px] text-foreground-muted">
                        {p.country}
                      </span>
                    </div>

                    {p.agendaTopics.length > 0 && (
                      <p className="mt-2.5 truncate text-xs text-foreground-muted">{p.agendaTopics.join(" · ")}</p>
                    )}

                    {(p.startDate || deadline) && (
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-foreground-muted">
                        {p.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(p.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            {p.endDate
                              ? ` – ${new Date(p.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                              : ""}
                          </span>
                        )}
                        {deadline && (
                          <span
                            className={
                              deadline.tone === "rose"
                                ? "text-accent-rose"
                                : deadline.tone === "gold"
                                  ? "text-accent-gold"
                                  : "text-foreground-muted"
                            }
                          >
                            {deadline.text}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => handleSetActive(p.id)}
                          className="glass-hover flex items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-[11px] font-medium text-foreground"
                        >
                          <Check className="h-3 w-3" />
                          Set active
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(p)}
                        className="glass-hover flex items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted hover:text-foreground"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      {confirmingDelete === p.id ? (
                        <span className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg bg-accent-rose px-2.5 py-1.5 text-[11px] font-medium text-[#05070d]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmingDelete(null)}
                            className="rounded-lg border border-panel-border px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmingDelete(p.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted hover:border-accent-rose/30 hover:text-accent-rose"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <PortfolioFormModal
        key={formKey}
        open={formOpen}
        portfolio={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export function PortfolioHubRoot() {
  return (
    <AuthGate>
      <PortfolioHub />
    </AuthGate>
  );
}
