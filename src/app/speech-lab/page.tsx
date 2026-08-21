import type { Metadata } from "next";
import { SpeechLabRoot } from "@/components/speech-analysis/speech-lab-root";

export const metadata: Metadata = {
  title: "Speech Analysis — MUN Mastery",
  description: "Record or paste a speech for instant diagnostic feedback on confidence, tone, evidence, structure, and pacing.",
};

export default function SpeechLabPage() {
  return <SpeechLabRoot />;
}
