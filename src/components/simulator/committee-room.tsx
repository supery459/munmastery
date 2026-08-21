"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Gavel, Radio, WifiOff } from "lucide-react";
import { DIFFICULTY_SETTINGS, pickAiDelegates } from "@/components/simulator/data";
import {
  buildCaucusStatement,
  buildMotionText,
  buildOpeningStatement,
  buildPointOfInquiry,
} from "@/components/simulator/statement-generator";
import { streamDelegateSpeech } from "@/components/simulator/ai-client";
import { SpeechComposer } from "@/components/simulator/speech-composer";
import { TranscriptFeed } from "@/components/simulator/transcript-feed";
import { SessionSidebar } from "@/components/simulator/session-sidebar";
import { BackLink } from "@/components/nav/back-link";
import type { Country, FeedEntry, SessionResult, SimulatorConfig, SpeechRecord } from "@/components/simulator/types";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type AwaitingUser = {
  role: "opening" | "caucus" | "point";
  timeLimit: number;
  prompt?: string;
};

type UserResult = { text: string; timedOut: boolean };

export function CommitteeRoom({
  config,
  onFinish,
}: {
  config: SimulatorConfig;
  onFinish: (result: SessionResult) => void;
}) {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [mode, setMode] = useState("Roll Call");
  const [awaitingUser, setAwaitingUser] = useState<AwaitingUser | null>(null);
  const [activeSpeakerCode, setActiveSpeakerCode] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [aiMode, setAiMode] = useState<"unknown" | "live" | "local">("unknown");

  const entriesRef = useRef<FeedEntry[]>([]);
  const idCounter = useRef(0);
  const resolverRef = useRef<((result: UserResult) => void) | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const aiDelegates = useMemo(() => pickAiDelegates(config.country.code, 5), [config.country.code]);
  const settings = DIFFICULTY_SETTINGS[config.difficulty];

  function nextId() {
    idCounter.current += 1;
    return `e${idCounter.current}`;
  }

  function pushEntry(entry: FeedEntry) {
    entriesRef.current = [...entriesRef.current, entry];
    setEntries(entriesRef.current);
  }

  function removeEntry(id: string) {
    entriesRef.current = entriesRef.current.filter((e) => e.id !== id);
    setEntries(entriesRef.current);
  }

  function updateEntryText(id: string, text: string) {
    entriesRef.current = entriesRef.current.map((e) =>
      e.id === id && e.kind === "ai-speech" ? { ...e, text } : e,
    );
    setEntries(entriesRef.current);
  }

  function updateMotionStatus(id: string, status: "passed" | "failed") {
    entriesRef.current = entriesRef.current.map((e) =>
      e.id === id && e.kind === "motion" ? { ...e, status } : e,
    );
    setEntries(entriesRef.current);
  }

  function handleUserSubmit(text: string, timedOut: boolean) {
    const resolve = resolverRef.current;
    if (!resolve) return;
    resolverRef.current = null;
    setAwaitingUser(null);
    setActiveSpeakerCode(null);
    pushEntry({ id: nextId(), kind: "user-speech", text: text.trim(), role: currentRole.current, timedOut });
    resolve({ text: text.trim(), timedOut });
  }

  // Tracks which role is currently being collected, so handleUserSubmit can label the feed entry.
  const currentRole = useRef<"opening" | "caucus" | "point">("opening");

  // Elapsed session clock — independent of the scripted run, safe to double-invoke.
  useEffect(() => {
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll to the newest transcript entry / composer.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, awaitingUser]);

  useEffect(() => {
    let cancelled = false;
    const ai = aiDelegates;
    const topic = config.topic;

    function pushChair(text: string) {
      pushEntry({ id: nextId(), kind: "chair", text });
    }

    function pushMotion(mover: Country, text: string) {
      const id = nextId();
      pushEntry({ id, kind: "motion", mover, text, status: "pending" });
      return id;
    }

    function pushPoint(raiser: Country, question: string) {
      pushEntry({ id: nextId(), kind: "point-prompt", raiser, question });
    }

    async function speakAi(country: Country, role: "opening" | "caucus") {
      setActiveSpeakerCode(country.code);
      const typingId = nextId();
      pushEntry({ id: typingId, kind: "typing", country });

      let liveEntryId: string | null = null;
      try {
        const text = await streamDelegateSpeech(
          { mode: role, committee: config.committee, topic, country },
          (partial) => {
            if (cancelled) return;
            if (liveEntryId === null) {
              // First chunk arrived — swap the typing indicator for a live,
              // growing speech bubble instead of waiting for the full reply.
              liveEntryId = nextId();
              removeEntry(typingId);
              pushEntry({ id: liveEntryId, kind: "ai-speech", country, text: partial, role });
            } else {
              updateEntryText(liveEntryId, partial);
            }
          },
        );
        if (cancelled) return;
        setAiMode("live");
        if (liveEntryId !== null) updateEntryText(liveEntryId, text);
        else pushEntry({ id: nextId(), kind: "ai-speech", country, text, role });
      } catch {
        if (cancelled) return;
        setAiMode("local");
        if (liveEntryId !== null) removeEntry(liveEntryId);
        else removeEntry(typingId);
        await sleep(settings.typingDelayMs);
        if (cancelled) return;
        const text =
          role === "opening" ? buildOpeningStatement(country, topic) : buildCaucusStatement(country, topic);
        pushEntry({ id: nextId(), kind: "ai-speech", country, text, role });
      }

      setActiveSpeakerCode(null);
      await sleep(settings.readPauseMs);
    }

    function waitForUser(role: "opening" | "caucus" | "point", timeLimit: number, prompt?: string) {
      currentRole.current = role;
      return new Promise<UserResult>((resolve) => {
        resolverRef.current = resolve;
        setAwaitingUser({ role, timeLimit, prompt });
        setActiveSpeakerCode("YOU");
      });
    }

    async function run() {
      await sleep(500);
      if (cancelled) return;
      pushChair(
        `This committee is called to order. The Chair welcomes all delegations to the ${config.committee.name}.`,
      );
      await sleep(settings.readPauseMs);
      if (cancelled) return;
      pushChair(
        `Today's topic under discussion is "${topic.title}." Roll call has been taken — all delegations are present.`,
      );
      await sleep(settings.readPauseMs);
      if (cancelled) return;

      setMode("General Speakers List");
      pushChair(`The General Speakers List is now open. The Chair recognizes the delegate of ${ai[0].name}.`);
      await speakAi(ai[0], "opening");
      if (cancelled) return;

      pushChair(`The Chair thanks the delegate. The floor recognizes ${ai[1].name}.`);
      await speakAi(ai[1], "opening");
      if (cancelled) return;

      pushChair(`The Chair now recognizes the delegate of ${config.country.name} — the floor is yours.`);
      const opening = await waitForUser("opening", settings.openingSpeechTime);
      if (cancelled) return;
      await sleep(600);
      if (cancelled) return;

      pushChair(`The Chair thanks the delegate of ${config.country.name}. The floor recognizes ${ai[2].name}.`);
      await speakAi(ai[2], "opening");
      if (cancelled) return;

      const motionMover = ai[3];
      const motionText = buildMotionText(topic, settings.caucusSpeechTime, 10);
      const motionId = pushMotion(motionMover, motionText);
      pushChair("The motion is in order. Are there any objections? Seeing none, the motion carries.");
      await sleep(settings.readPauseMs);
      if (cancelled) return;
      updateMotionStatus(motionId, "passed");
      setMode("Moderated Caucus");
      await sleep(700);
      if (cancelled) return;

      pushChair(`We will now move into a moderated caucus. The Chair recognizes ${ai[3].name}.`);
      await speakAi(ai[3], "caucus");
      if (cancelled) return;

      pushChair(`The Chair recognizes ${ai[4].name}.`);
      await speakAi(ai[4], "caucus");
      if (cancelled) return;

      pushChair(`The Chair recognizes the delegate of ${config.country.name}.`);
      const caucus = await waitForUser("caucus", settings.caucusSpeechTime);
      if (cancelled) return;
      await sleep(500);
      if (cancelled) return;

      let point: UserResult | null = null;
      let pointRaiser: Country | null = null;
      let pointQuestion = "";
      if (settings.pointOfInquiry) {
        pointRaiser = ai[Math.floor(Math.random() * ai.length)];
        try {
          pointQuestion = await streamDelegateSpeech({
            mode: "point",
            committee: config.committee,
            topic,
            country: pointRaiser,
            targetCountryName: config.country.name,
          });
          if (cancelled) return;
          setAiMode("live");
        } catch {
          if (cancelled) return;
          setAiMode("local");
          pointQuestion = buildPointOfInquiry(pointRaiser, topic);
        }
        pushPoint(pointRaiser, pointQuestion);
        pushChair(`A point of inquiry is in order. The delegate of ${config.country.name} may respond.`);
        point = await waitForUser("point", settings.pointResponseTime, pointQuestion);
        if (cancelled) return;
        await sleep(500);
        if (cancelled) return;
      }

      pushChair("Time has expired for this caucus.");
      await sleep(settings.readPauseMs);
      if (cancelled) return;

      const motion2Id = pushMotion(ai[0], "to move into voting procedure on the draft working paper");
      await sleep(settings.readPauseMs);
      if (cancelled) return;
      updateMotionStatus(motion2Id, "passed");
      pushChair("This committee stands adjourned. The dais thanks all delegations for a productive session.");
      await sleep(1200);
      if (cancelled) return;

      const speeches: SpeechRecord[] = [
        { text: opening.text, timedOut: opening.timedOut, timeLimit: settings.openingSpeechTime, role: "opening" },
        { text: caucus.text, timedOut: caucus.timedOut, timeLimit: settings.caucusSpeechTime, role: "caucus" },
      ];
      if (point) {
        speeches.push({ text: point.text, timedOut: point.timedOut, timeLimit: settings.pointResponseTime, role: "point" });
      }

      onFinish({ config, speeches, transcript: entriesRef.current });
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Exit" ariaLabel="Exit simulation and return to dashboard" hideLabelOnMobile />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-cyan/10">
          <Gavel className="h-4 w-4 text-accent-gold" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {config.committee.name} &middot; {config.topic.title}
          </div>
          <div className="text-xs text-foreground-muted">
            {mode} &middot; Representing {config.country.name}
          </div>
        </div>
        {aiMode !== "unknown" && (
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:flex ${
              aiMode === "live"
                ? "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald"
                : "border-panel-border text-foreground-muted"
            }`}
            title={
              aiMode === "live"
                ? "Delegates are being generated live by Gemini"
                : "Live AI is unavailable — running the local scripted simulation"
            }
          >
            {aiMode === "live" ? <Radio className="h-3 w-3 animate-pulse" /> : <WifiOff className="h-3 w-3" />}
            {aiMode === "live" ? "Live AI" : "Local simulation"}
          </span>
        )}
        <span
          className="rounded-full border border-panel-border px-2.5 py-1 text-xs font-medium text-foreground-muted"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-5 overflow-hidden px-4 py-5 sm:px-6">
        <div className="flex-1 overflow-y-auto pr-1">
          <TranscriptFeed entries={entries} />
          {awaitingUser && (
            <div className="mt-4">
              <SpeechComposer
                key={`${awaitingUser.role}-${entries.length}`}
                role={awaitingUser.role}
                timeLimit={awaitingUser.timeLimit}
                countryName={config.country.name}
                prompt={awaitingUser.prompt}
                onSubmit={handleUserSubmit}
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <aside className="hidden w-80 shrink-0 overflow-y-auto lg:block">
          <SessionSidebar
            entries={entries}
            mode={mode}
            userCountry={config.country}
            aiDelegates={aiDelegates}
            activeSpeakerCode={activeSpeakerCode}
          />
        </aside>
      </div>
    </div>
  );
}
