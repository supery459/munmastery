import type { Metadata } from "next";
import { SpeechLabRoot } from "@/components/speech-analysis/speech-lab-root";

export const metadata: Metadata = {
  title: "Speech Analysis — MUN Mastery",
  description: "Record or paste a speech for instant diagnostic feedback on confidence, tone, evidence, structure, and pacing.",
};

export default async function SpeechLabPage({ searchParams }: PageProps<"/speech-lab">) {
  const { draft } = await searchParams;
  const draftId = typeof draft === "string" ? draft : undefined;
  return <SpeechLabRoot key={draftId ?? "new"} draftId={draftId} />;
}
