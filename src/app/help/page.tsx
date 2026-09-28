"use client";

import Link from "next/link";
import { HELP_TOPICS } from "@/components/dashboard/help-modal";

export default function HelpPage() {
  return <main className="mx-auto w-full max-w-3xl px-4 py-10">
    <Link href="/dashboard" className="text-sm text-accent-cyan">Dashboard</Link>
    <h1 className="my-6 text-2xl font-semibold">Help & frequently asked questions</h1>
    <div className="divide-y divide-panel-border">{HELP_TOPICS.map((topic) => <details key={topic.question} className="py-5"><summary className="cursor-pointer font-medium">{topic.question}</summary><p className="mt-3 text-sm leading-relaxed text-foreground-muted">{topic.answer}</p></details>)}</div>
    <section id="data" className="mt-8 border-t border-panel-border pt-6">
      <h2 className="text-lg font-semibold">Your data</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">Accounts, conference portfolios, drafts, and activity are stored in this browser. They do not sync between devices. Export saved reports from Saved work before clearing browser data. Settings can clear activity while keeping your account and conference assignments.</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">When you request AI feedback, your draft and the selected conference context are sent to the application server and Google Gemini. AI feedback may contain errors; check sources and conference requirements before submitting your work.</p>
    </section>
  </main>;
}
