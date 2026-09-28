"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { PortfolioAssignSelect } from "@/components/common/portfolio-assign-select";
import { getActivity, deleteActivity, type ActivityEvent } from "@/lib/activity-store";
import { Report as PaperReport } from "@/components/position-paper/report";
import { Report as SpeechReport } from "@/components/speech-analysis/report";
import { Scorecard } from "@/components/simulator/scorecard";

function History({ entry, type: initialType }: { entry: string | null; type: string }) {
  const [events, setEvents] = useState(getActivity);
  const [selectedId, setSelectedId] = useState(entry);
  const [type, setType] = useState(initialType);
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const selected = events.find((e) => e.id === selectedId);
  const filtered = events.filter((e) => (type === "all" || e.type === type) && `${e.title} ${e.subtitle ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  function remove(id: string) {
    try { deleteActivity(id); setEvents(getActivity()); setConfirmDelete(null); setSelectedId(null); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to delete item."); }
  }
  return <div className="min-h-screen bg-background">
    <header className="flex items-center gap-4 border-b border-panel-border px-4 py-3"><BackLink href="/dashboard" label="Dashboard" /><h1 className="text-lg font-semibold">Saved work</h1></header>
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-8">
      <div className="flex flex-wrap gap-3">
        <input aria-label="Search saved work" placeholder="Search saved work" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-panel-border bg-panel px-3 py-2" />
        <select aria-label="Activity type" value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-panel-border bg-panel px-3 py-2">
          <option value="all">All work</option><option value="positionPaper">Position papers</option><option value="speech">Speeches</option><option value="simulation">Debate sessions</option><option value="learn">Learn modules</option>
        </select>
      </div>
      {error && <p role="alert">{error}</p>}
      {selectedId && !selected && <p role="status">This saved item is no longer available in this account.</p>}
      <ul className="divide-y divide-panel-border">
        {filtered.map((e) => <li key={e.id} className="flex flex-wrap items-center gap-3 py-3">
          <button onClick={() => setSelectedId(e.id)} className="min-w-0 flex-1 text-left">
            <span className="block break-words text-sm font-medium text-accent-cyan">{e.title}</span>
            <span className="text-xs text-foreground-muted">{new Date(e.timestamp).toLocaleString()}{e.draft ? " - Draft" : typeof e.score === "number" ? ` - ${e.score}/100` : ""}</span>
          </button>
          <PortfolioAssignSelect eventId={e.id} portfolioId={e.portfolioId} onChanged={() => setEvents(getActivity())} />
          {confirmDelete === e.id ? <><button onClick={() => remove(e.id)} className="text-xs text-accent-rose">Confirm delete</button><button onClick={() => setConfirmDelete(null)} className="text-xs">Cancel</button></> :
            <button onClick={() => setConfirmDelete(e.id)} aria-label={`Delete ${e.title}`} title="Delete saved item" className="p-2"><Trash2 className="h-4 w-4" /></button>}
        </li>)}
      </ul>
      {filtered.length === 0 && <p className="text-sm text-foreground-muted">No saved work matches these filters.</p>}
      {selected && <SavedDetails key={selected.id} event={selected} />}
    </main>
  </div>;
}

function SavedDetails({ event }: { event: ActivityEvent }) {
  const router = useRouter();
  const details = event.details;
  const text = details && details.kind !== "simulation" ? details.input.text : "";
  const editHref = `${event.type === "positionPaper" ? "/position-paper-grader" : "/speech-lab"}?draft=${encodeURIComponent(event.id)}`;
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(event, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `mun-${event.type}-${event.id}.json`; a.click();
    URL.revokeObjectURL(url);
  }
  return <section aria-label="Saved item details" className="space-y-4 border-t border-panel-border pt-6">
    <div className="flex flex-wrap items-center gap-4"><h2 className="text-lg font-semibold">{event.title}</h2>
      <button onClick={download} className="flex items-center gap-2 text-sm text-accent-cyan"><Download className="h-4 w-4" />Export</button>
      {text && <Link href={editHref} className="text-sm text-accent-cyan">Edit draft</Link>}
    </div>
    {text && <details open={event.draft}><summary className="cursor-pointer text-sm">Draft text</summary><p className="mt-3 whitespace-pre-wrap break-words text-sm text-foreground-muted">{text}</p></details>}
    {details?.kind === "positionPaper" && details.report && <PaperReport review={details.report} source={details.source ?? "local"} onReset={() => router.push(editHref)} />}
    {details?.kind === "speech" && details.report && <SpeechReport diagnostic={details.report} source={details.source ?? "local"} onReset={() => router.push(editHref)} />}
    {details?.kind === "simulation" && <Scorecard result={details.session} saved={{ report: details.report, source: details.source }} onRestart={() => router.push("/simulator")} />}
    {!details && <><p className="text-sm text-foreground-muted">{event.subtitle}</p><p className="text-sm">{typeof event.score === "number" ? `Saved score: ${event.score}/100. ` : ""}This older entry has no saved draft or full report.</p>{event.href && <Link href={event.href} className="text-sm text-accent-cyan">Open practice tool</Link>}</>}
  </section>;
}

export function HistoryRoot({ entry, type }: { entry: string | null; type: string }) { return <AuthGate><History entry={entry} type={type} /></AuthGate>; }
