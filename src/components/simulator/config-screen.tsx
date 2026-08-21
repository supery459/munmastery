"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gavel, Sparkles, Target } from "lucide-react";
import { COMMITTEES, COUNTRIES, DIFFICULTY_SETTINGS, committeeTopics, resolveCountry } from "@/components/simulator/data";
import { BackLink } from "@/components/nav/back-link";
import { CountrySelect } from "@/components/common/country-select";
import { getActivePortfolio } from "@/lib/portfolio-store";
import type { Committee, Country, Difficulty, SimulatorConfig, Topic } from "@/components/simulator/types";

const STEPS = ["Committee", "Delegation", "Topic", "Difficulty", "Review"] as const;

const DIFFICULTY_ORDER: Difficulty[] = ["beginner", "intermediate", "advanced"];

function matchByName<T extends { name: string }>(list: T[], value: string): T | null {
  const lower = value.trim().toLowerCase();
  return list.find((item) => item.name.toLowerCase() === lower) ?? null;
}

// Only ever renders inside <AuthGate>, so reading portfolio-store directly is safe.
function targetedDefaults(): { committee: Committee | null; country: Country | null; conferenceName: string | null } {
  const portfolio = getActivePortfolio();
  if (!portfolio) return { committee: null, country: null, conferenceName: null };
  const committee =
    COMMITTEES.find((c) => c.shortName.toLowerCase() === portfolio.committee.trim().toLowerCase()) ??
    matchByName(COMMITTEES, portfolio.committee);
  const country = portfolio.country.trim() ? resolveCountry(portfolio.country) : null;
  return { committee, country, conferenceName: portfolio.conferenceName };
}

export function ConfigScreen({ onStart }: { onStart: (config: SimulatorConfig) => void }) {
  const [targeted] = useState(targetedDefaults);
  const [step, setStep] = useState(() => (targeted.committee && targeted.country ? 2 : targeted.committee ? 1 : 0));
  const [committee, setCommittee] = useState<Committee | null>(() => targeted.committee);
  const [country, setCountry] = useState<Country | null>(() => targeted.country);
  const [countryQuery, setCountryQuery] = useState(() => targeted.country?.name ?? "");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const topics = useMemo(() => (committee ? committeeTopics(committee.id) : []), [committee]);

  const canAdvance =
    (step === 0 && committee) ||
    (step === 1 && country) ||
    (step === 2 && topic) ||
    (step === 3 && difficulty) ||
    step === 4;

  function goNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function selectCommittee(c: Committee) {
    setCommittee(c);
    setTopic(null);
    setStep(1);
  }
  function selectCountry(c: Country) {
    setCountry(c);
    setCountryQuery(c.name);
    setStep(2);
  }

  function selectCountryByName(name: string) {
    if (!name.trim()) return;
    selectCountry(resolveCountry(name));
  }
  function selectTopic(t: Topic) {
    setTopic(t);
    setStep(3);
  }
  function selectDifficulty(d: Difficulty) {
    setDifficulty(d);
    setStep(4);
  }

  function handleStart() {
    if (!committee || !country || !topic || !difficulty) return;
    onStart({ committee, topic, country, difficulty });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <BackLink href="/dashboard" label="Dashboard" />
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <Gavel className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">AI Debate Simulator</h1>
          <p className="text-xs text-foreground-muted">Configure your committee session</p>
        </div>
        {targeted.conferenceName && (committee || country) && (
          <span className="ml-auto flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1.5 text-xs font-medium text-foreground">
            <Target className="h-3.5 w-3.5 text-accent-cyan" />
            Targeted for {targeted.conferenceName}
            <Link href="/portfolios" className="ml-1 text-accent-cyan hover:underline">
              Change
            </Link>
          </span>
        )}
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => {
          const complete = i < step || (i === step && step === 4);
          const active = i === step;
          const reachable = i <= step || (i === 1 && committee) || (i === 2 && topic) || (i === 3 && difficulty);
          return (
            <button
              key={label}
              onClick={() => reachable && setStep(i)}
              disabled={!reachable && i > step}
              className="flex items-center gap-2"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-gradient-to-br from-accent-cyan to-accent-indigo text-[#05070d]"
                    : complete
                      ? "bg-accent-emerald/20 text-accent-emerald"
                      : "bg-white/[0.06] text-foreground-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className={`hidden text-xs sm:inline ${active ? "text-foreground" : "text-foreground-muted"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-panel-border sm:w-6" />}
            </button>
          );
        })}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1"
      >
        {step === 0 && (
          <StepShell title="Select your committee" subtitle="Each committee runs its own procedure and topic set.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COMMITTEES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCommittee(c)}
                  className={`panel-hover flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                    committee?.id === c.id ? "border-accent-cyan/40 bg-white/[0.04]" : "border-panel-border"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/15 to-accent-indigo/15">
                    <c.icon className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-foreground">{c.name}</div>
                    <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{c.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            title="Choose your delegation"
            subtitle="Search all 193 UN member states plus observer states, or pick a popular delegation below."
          >
            <div className="max-w-md">
              <CountrySelect
                value={countryQuery}
                onChange={setCountryQuery}
                onSelect={selectCountryByName}
                placeholder="Search delegations (e.g. France, Kenya, Vietnam)…"
              />
            </div>

            <p className="mb-3 mt-6 text-[11px] font-medium uppercase tracking-wider text-foreground-muted/70">
              Popular delegations
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => selectCountry(c)}
                  className={`panel-hover rounded-xl border p-3 text-left transition-colors ${
                    country?.code === c.code ? "border-accent-cyan/40 bg-white/[0.04]" : "border-panel-border"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[9px] font-semibold text-foreground-muted">
                      {c.code}
                    </span>
                    <span className="text-xs font-medium text-foreground">{c.name}</span>
                  </div>
                  <span className="mt-2 block text-[10px] text-foreground-muted">{c.bloc}</span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="Select the topic" subtitle={`On the agenda for ${committee?.shortName ?? "this committee"}.`}>
            <div className="flex flex-col gap-3">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTopic(t)}
                  className={`panel-hover rounded-2xl border p-4 text-left transition-colors ${
                    topic?.id === t.id ? "border-accent-cyan/40 bg-white/[0.04]" : "border-panel-border"
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">{t.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{t.brief}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {t.keyIssues.slice(0, 3).map((issue) => (
                      <span
                        key={issue}
                        className="rounded-full border border-panel-border px-2 py-0.5 text-[10px] text-foreground-muted"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="Set the difficulty" subtitle="This controls pacing, procedure strictness, and delegate assertiveness.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {DIFFICULTY_ORDER.map((d) => {
                const s = DIFFICULTY_SETTINGS[d];
                return (
                  <button
                    key={d}
                    onClick={() => selectDifficulty(d)}
                    className={`panel-hover rounded-2xl border p-4 text-left transition-colors ${
                      difficulty === d ? "border-accent-cyan/40 bg-white/[0.04]" : "border-panel-border"
                    }`}
                  >
                    <div className="text-sm font-medium text-foreground">{s.label}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">{s.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-[10px] text-foreground-muted">
                      <Sparkles className="h-3 w-3 text-accent-gold" />
                      {s.openingSpeechTime}s opening &middot; {s.caucusSpeechTime}s caucus
                    </div>
                  </button>
                );
              })}
            </div>
          </StepShell>
        )}

        {step === 4 && committee && country && topic && difficulty && (
          <StepShell title="Review & enter committee" subtitle="Confirm your setup before the gavel comes down.">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ReviewRow label="Committee" value={committee.name} />
              <ReviewRow label="Delegation" value={`${country.name} (${country.bloc})`} />
              <ReviewRow label="Topic" value={topic.title} />
              <ReviewRow label="Difficulty" value={DIFFICULTY_SETTINGS[difficulty].label} />
            </div>
            <button
              onClick={handleStart}
              className="glow-cyan glass-hover mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3.5 text-sm font-medium text-[#05070d] sm:w-auto"
            >
              Enter committee session
              <ArrowRight className="h-4 w-4" />
            </button>
          </StepShell>
        )}
      </motion.div>

      {step > 0 && step < 4 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          {canAdvance && (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 rounded-lg border border-panel-border px-3.5 py-2 text-xs font-medium text-foreground panel-hover"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs text-foreground-muted">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel rounded-xl p-3.5">
      <div className="text-[11px] text-foreground-muted">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
