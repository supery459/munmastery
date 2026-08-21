"use client";

import { useState } from "react";
import { AuthGate } from "@/components/auth/auth-gate";
import { ConfigScreen } from "@/components/simulator/config-screen";
import { CommitteeRoom } from "@/components/simulator/committee-room";
import { Scorecard } from "@/components/simulator/scorecard";
import type { SessionResult, SimulatorConfig } from "@/components/simulator/types";

type Phase = "config" | "session" | "debrief";

export function SimulatorRoot() {
  const [phase, setPhase] = useState<Phase>("config");
  const [config, setConfig] = useState<SimulatorConfig | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);
  const [sessionKey, setSessionKey] = useState(0);

  function handleStart(cfg: SimulatorConfig) {
    setConfig(cfg);
    setSessionKey((k) => k + 1);
    setPhase("session");
  }

  function handleFinish(res: SessionResult) {
    setResult(res);
    setPhase("debrief");
  }

  function handleRestart() {
    setResult(null);
    setConfig(null);
    setPhase("config");
  }

  if (phase === "session" && config) {
    return (
      <AuthGate>
        <CommitteeRoom key={sessionKey} config={config} onFinish={handleFinish} />
      </AuthGate>
    );
  }

  if (phase === "debrief" && result) {
    return (
      <AuthGate>
        <Scorecard result={result} onRestart={handleRestart} />
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <ConfigScreen onStart={handleStart} />
    </AuthGate>
  );
}
