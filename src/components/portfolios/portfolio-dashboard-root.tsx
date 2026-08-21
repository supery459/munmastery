"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  FileText,
  FolderKanban,
  Mic,
  Pencil,
  Star,
  Swords,
  Trash2,
} from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { PortfolioAssignSelect } from "@/components/common/portfolio-assign-select";
import { PortfolioFormModal } from "@/components/portfolios/portfolio-form-modal";
import { getActivityForPortfolio, type ActivityEvent } from "@/lib/activity-store";
import {
  daysUntil,
  deletePortfolio,
  getActivePortfolioId,
  getPortfolio,
  setActivePortfolioId,
  updatePortfolio,
  type Portfolio,
  type PortfolioInput,
} from "@/lib/portfolio-store";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function PortfolioDashboard({ portfolioId }: { portfolioId: string }) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(() => getPortfolio(portfolioId));
  const [activeId, setActiveId] = useState<string | null>(() => getActivePortfolioId());
  const [events, setEvents] = useState<ActivityEvent[]>(() => getActivityForPortfolio(portfolioId));
  const [editOpen, setEditOpen] = useState(false);
  // Bumped each time the edit form opens so it remounts with fresh initial values.
  const [editFormKey, setEditFormKey] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [notes, setNotes] = useState(portfolio?.notes ?? "");
  const [motions, setMotions] = useState(portfolio?.motions ?? "");
  const [cheatsheet, setCheatsheet] = useState(portfolio?.cheatsheet ?? "");
  const [notesStatus, setNotesStatus] = useState<string | null>(null);

  function refresh() {
    setPortfolio(getPortfolio(portfolioId));
    setActiveId(getActivePortfolioId());
    setEvents(getActivityForPortfolio(portfolioId));
  }

  if (!portfolio) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
          <BackLink href="/portfolios" label="Portfolios" />
        </header>
        <div className="mx-auto flex flex-1 max-w-md flex-col items-center justify-center gap-2 px-4 text-center">
          <FolderKanban className="h-8 w-8 text-foreground-muted" />
          <h1 className="text-lg font-semibold text-foreground">Portfolio not found</h1>
          <p className="text-sm text-foreground-muted">It may have been deleted. Head back to your portfolios.</p>
        </div>
      </div>
    );
  }

  const isActive = portfolio.id === activeId;
  const deadlineRemaining = portfolio.positionPaperDeadline ? daysUntil(portfolio.positionPaperDeadline) : null;

  function handleSetActive() {
    setActivePortfolioId(portfolio!.id);
    refresh();
  }

  function handleEditSubmit(input: PortfolioInput) {
    updatePortfolio(portfolio!.id, input);
    setEditOpen(false);
    refresh();
  }

  function handleSaveNotes() {
    updatePortfolio(portfolio!.id, { notes, motions, cheatsheet });
    setNotesStatus("Saved.");
    window.setTimeout(() => setNotesStatus(null), 2000);
  }

  function handleDeletePortfolio() {
    deletePortfolio(portfolio!.id);
    router.push("/portfolios");
  }

  function startTargeted(path: string) {
    setActivePortfolioId(portfolio!.id);
    router.push(path);
  }

  const positionPapers = events.filter((e) => e.type === "positionPaper");
  const speeches = events.filter((e) => e.type === "speech");
  const simulations = events.filter((e) => e.type === "simulation");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/portfolios" label="Portfolios" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <FolderKanban className="h-4 w-4 text-accent-cyan" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-foreground">{portfolio.conferenceName}</div>
            {isActive && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-emerald/15 px-2 py-0.5 text-[10px] font-medium text-accent-emerald">
                <Star className="h-2.5 w-2.5 fill-current" />
                Active
              </span>
            )}
          </div>
          <div className="text-xs text-foreground-muted">
            {portfolio.committee} · {portfolio.country}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isActive && (
            <button
              onClick={handleSetActive}
              className="glass-hover flex items-center gap-1.5 rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <Check className="h-3.5 w-3.5" />
              Set active
            </button>
          )}
          <button
            onClick={() => {
              setEditFormKey((k) => k + 1);
              setEditOpen(true);
            }}
            className="glass-hover flex items-center gap-1.5 rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6">
        <div className="panel rounded-2xl p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Overview</h2>
              {portfolio.agendaTopics.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1">
                  {portfolio.agendaTopics.map((t) => (
                    <li key={t} className="text-xs text-foreground-muted">
                      &bull; {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-foreground-muted">No agenda topics saved yet — edit this portfolio to add some.</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5 text-right">
              {portfolio.startDate && (
                <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(portfolio.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  {portfolio.endDate
                    ? ` – ${new Date(portfolio.endDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                    : ""}
                </span>
              )}
              {portfolio.positionPaperDeadline && deadlineRemaining !== null && (
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                    deadlineRemaining < 0
                      ? "border-accent-rose/30 text-accent-rose"
                      : deadlineRemaining <= 7
                        ? "border-accent-gold/30 text-accent-gold"
                        : "border-panel-border text-foreground-muted"
                  }`}
                >
                  {deadlineRemaining < 0
                    ? `Paper deadline passed ${Math.abs(deadlineRemaining)}d ago`
                    : deadlineRemaining === 0
                      ? "Paper due today"
                      : `Paper due in ${deadlineRemaining}d`}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction
            icon={FileText}
            label="New position paper"
            detail="Grade a draft for this conference"
            onClick={() => startTargeted("/position-paper-grader")}
          />
          <QuickAction icon={Mic} label="New speech check" detail="Analyze a speech for this conference" onClick={() => startTargeted("/speech-lab")} />
          <QuickAction
            icon={Swords}
            label="Targeted simulation"
            detail="Practice with this committee & country"
            onClick={() => startTargeted("/simulator")}
          />
        </div>

        <div className="panel rounded-2xl p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Research notes, motions & cheatsheet</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <TextField label="Research notes" value={notes} onChange={setNotes} placeholder="Background, blocs, precedent…" />
            <TextField label="Motions list" value={motions} onChange={setMotions} placeholder="Planned motions & procedure notes…" />
            <TextField label="Position cheatsheet" value={cheatsheet} onChange={setCheatsheet} placeholder="Key talking points & stances…" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleSaveNotes}
              className="glass-hover rounded-lg border border-panel-border px-3.5 py-2 text-xs font-medium text-foreground"
            >
              Save notes
            </button>
            {notesStatus && <span className="text-xs text-accent-emerald">{notesStatus}</span>}
          </div>
        </div>

        <ArtifactSection
          title="Position paper drafts & grading reports"
          emptyText="No position papers graded for this conference yet."
          events={positionPapers}
          onReassigned={refresh}
        />

        <ArtifactSection
          title="Speech drafts & analysis history"
          emptyText="No speeches checked for this conference yet."
          events={speeches}
          onReassigned={refresh}
        />

        <ArtifactSection
          title="Targeted debate simulator sessions"
          emptyText="No simulator sessions pinned to this conference yet."
          events={simulations}
          onReassigned={refresh}
        />

        <div className="flex justify-end">
          {confirmingDelete ? (
            <span className="flex items-center gap-2">
              <span className="text-xs text-foreground-muted">Delete this entire portfolio?</span>
              <button
                onClick={handleDeletePortfolio}
                className="rounded-lg bg-accent-rose px-3 py-1.5 text-xs font-medium text-[#05070d]"
              >
                Confirm delete
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground-muted"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
              className="flex items-center gap-1.5 rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:border-accent-rose/30 hover:text-accent-rose"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete portfolio
            </button>
          )}
        </div>
      </div>

      <PortfolioFormModal
        key={editFormKey}
        open={editOpen}
        portfolio={portfolio}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  detail,
  onClick,
}: {
  icon: typeof FileText;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="panel-hover flex flex-col items-start gap-2 rounded-2xl p-4 text-left">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
        <Icon className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
      </span>
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-foreground-muted">{detail}</div>
      </div>
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground-muted">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-panel-border bg-background px-3 py-2.5 text-xs leading-relaxed text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
      />
    </label>
  );
}

function ArtifactSection({
  title,
  emptyText,
  events,
  onReassigned,
}: {
  title: string;
  emptyText: string;
  events: ActivityEvent[];
  onReassigned: () => void;
}) {
  return (
    <div className="panel rounded-2xl p-5">
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {events.length === 0 ? (
        <p className="text-xs text-foreground-muted">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-panel-border px-3.5 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-foreground">{e.title}</div>
                <div className="text-[11px] text-foreground-muted">{formatDate(e.timestamp)}</div>
              </div>
              {typeof e.score === "number" && (
                <span
                  className="shrink-0 rounded-full border border-panel-border px-2 py-0.5 text-[11px] font-medium text-foreground"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {e.score}
                </span>
              )}
              <PortfolioAssignSelect eventId={e.id} portfolioId={e.portfolioId} onChanged={onReassigned} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PortfolioDashboardRoot({ portfolioId }: { portfolioId: string }) {
  return (
    <AuthGate>
      <PortfolioDashboard portfolioId={portfolioId} />
    </AuthGate>
  );
}
