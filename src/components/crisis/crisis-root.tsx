"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Siren } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { COUNTRIES } from "@/components/simulator/data";
import type { Country } from "@/components/simulator/types";
import { CRISIS_EVENTS, DIRECTIVES } from "@/components/crisis/data";
import { NewsTicker } from "@/components/crisis/news-ticker";
import { BreakingOverlay } from "@/components/crisis/breaking-overlay";
import { EventFeed } from "@/components/crisis/event-feed";
import { DirectiveFeed } from "@/components/crisis/directive-feed";
import type { CrisisEvent, Directive, DirectiveDecision } from "@/components/crisis/types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "KEN") ?? COUNTRIES[0];

export function CrisisRoot() {
  const [restartKey, setRestartKey] = useState(0);
  // restartKey isn't read inside the callback — it's a deliberate cache-buster
  // so "Restart monitoring" produces a fresh shuffle each time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eventQueue = useMemo(() => shuffle(CRISIS_EVENTS), [restartKey]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const directiveQueue = useMemo(() => shuffle(DIRECTIVES), [restartKey]);

  const [events, setEvents] = useState<CrisisEvent[]>([]);
  const [directives, setDirectives] = useState<Directive[]>([]);
  const [decisions, setDecisions] = useState<DirectiveDecision[]>([]);
  const [breaking, setBreaking] = useState<CrisisEvent | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const elapsedRef = useRef(0);
  const eventIndexRef = useRef(0);
  const directiveIndexRef = useRef(0);
  const nextEventAtRef = useRef(2);
  const pendingDirectiveAtRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    elapsedRef.current = 0;
    eventIndexRef.current = 0;
    directiveIndexRef.current = 0;
    nextEventAtRef.current = 2;
    pendingDirectiveAtRef.current = null;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      elapsedRef.current += 1;
      const now = elapsedRef.current;
      setElapsed(now);

      if (now >= nextEventAtRef.current && eventIndexRef.current < eventQueue.length) {
        const event = eventQueue[eventIndexRef.current];
        eventIndexRef.current += 1;
        setEvents((prev) => [event, ...prev]);
        nextEventAtRef.current = now + 5 + Math.floor(Math.random() * 5);

        if (event.severity === "critical") {
          setBreaking(event);
          setTimeout(() => {
            if (cancelled) return;
            setBreaking((cur) => (cur?.id === event.id ? null : cur));
          }, 4500);
        }

        if (
          (event.severity === "critical" || event.severity === "severe") &&
          directiveIndexRef.current < directiveQueue.length &&
          pendingDirectiveAtRef.current === null
        ) {
          pendingDirectiveAtRef.current = now + 3 + Math.floor(Math.random() * 3);
        }
      }

      if (
        pendingDirectiveAtRef.current !== null &&
        now >= pendingDirectiveAtRef.current &&
        directiveIndexRef.current < directiveQueue.length
      ) {
        const directive = directiveQueue[directiveIndexRef.current];
        directiveIndexRef.current += 1;
        setDirectives((prev) => [directive, ...prev]);
        pendingDirectiveAtRef.current = null;
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartKey]);

  function handleRespond(directiveId: string, response: string) {
    setDecisions((prev) => [
      ...prev.filter((d) => d.directiveId !== directiveId),
      { directiveId, response, atSecond: elapsedRef.current },
    ]);
  }

  function handleRestart() {
    setEvents([]);
    setDirectives([]);
    setDecisions([]);
    setBreaking(null);
    setElapsed(0);
    setPaused(false);
    setRestartKey((k) => k + 1);
  }

  const recentHeadlines = events.slice(0, 6).map((e) => e.headline);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const allCaughtUp = events.length >= CRISIS_EVENTS.length;

  return (
    <AuthGate>
    <div className="flex min-h-screen flex-col bg-background">
      <BreakingOverlay event={breaking} onDismiss={() => setBreaking(null)} />

      <header className="sticky top-0 z-40 flex shrink-0 items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Dashboard" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-rose/20 to-accent-gold/10">
          <Siren className="h-4 w-4 text-accent-rose" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">Crisis Engine</div>
          <div className="text-xs text-foreground-muted">Live situation room</div>
        </div>

        <select
          value={country.code}
          onChange={(e) => {
            const next = COUNTRIES.find((c) => c.code === e.target.value);
            if (next) setCountry(next);
          }}
          className="hidden rounded-lg border border-panel-border bg-panel px-2.5 py-1.5 text-xs text-foreground focus:border-accent-cyan/40 focus:outline-none sm:block"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              Monitoring as {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setPaused((p) => !p)}
          className="flex items-center gap-1.5 rounded-lg border border-panel-border px-2.5 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={handleRestart}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-white/[0.05] hover:text-foreground"
          aria-label="Restart monitoring"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <span
          className="rounded-full border border-panel-border px-2.5 py-1 text-xs font-medium text-foreground-muted"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </header>

      <NewsTicker headlines={recentHeadlines} />

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <EventFeed events={events} />
          {allCaughtUp && (
            <div className="panel mt-3 rounded-2xl p-4 text-center text-xs text-foreground-muted">
              You&rsquo;re caught up on every dispatch this session.{" "}
              <button onClick={handleRestart} className="font-medium text-accent-cyan hover:underline">
                Restart monitoring
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <DirectiveFeed
            directives={directives}
            country={country}
            decisions={decisions}
            onRespond={handleRespond}
          />

          {decisions.length > 0 && (
            <div className="panel rounded-2xl p-4">
              <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                Decision log
              </div>
              <ul className="flex flex-col gap-2">
                {decisions
                  .slice()
                  .sort((a, b) => a.atSecond - b.atSecond)
                  .map((d) => {
                    const directive = DIRECTIVES.find((x) => x.id === d.directiveId);
                    return (
                      <li key={d.directiveId} className="text-xs">
                        <span className="text-foreground-muted">{directive?.subject ?? "Directive"}: </span>
                        <span className="font-medium text-foreground">{d.response}</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGate>
  );
}
