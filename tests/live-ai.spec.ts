import { test, expect } from "@playwright/test";

test.skip(!process.env.RUN_LIVE_AI, "Set RUN_LIVE_AI=1 to exercise the configured Gemini account");

const text = "Honourable Chair, Vanuatu proposes a funded regional climate adaptation framework with annual reporting, independent review, and close cooperation with affected island communities.";

test("live paper, speech, debate delegate and scorecard responses", async ({ request }) => {
  const paper = await request.post("/api/position-paper", { data: { text, country: "Vanuatu", topic: "Climate displacement" }, timeout: 35_000 });
  expect(paper.status(), await paper.text()).toBe(200);
  const grade = await paper.json();
  expect(grade.composite).toBeGreaterThanOrEqual(0);
  expect(grade.criteria.policyAlignment.notes.length).toBeGreaterThan(0);

  const speech = await request.post("/api/speech-analysis", { data: { text, durationSeconds: 55, context: { country: "Vanuatu", topic: "Climate displacement", committee: "WHO" } }, timeout: 35_000 });
  expect(speech.status(), await speech.text()).toBe(200);
  const diagnostic = await speech.json();
  expect(diagnostic.dimensions.confidence.score).toBeGreaterThanOrEqual(0);

  const delegate = await request.post("/api/simulator/delegate", { data: {
    mode: "opening", committee: { name: "World Health Organization" }, topic: { title: "Climate displacement", brief: "Protect island communities", keyIssues: ["adaptation", "migration"] },
    country: { name: "France", formalName: "French Republic", bloc: "European Union", priorities: ["health", "climate"] },
  }, timeout: 35_000 });
  expect(delegate.status()).toBe(200);
  expect((await delegate.text()).trim().length).toBeGreaterThan(20);

  const scorecard = await request.post("/api/simulator/scorecard", { data: {
    committee: { name: "World Health Organization", shortName: "WHO" }, topic: { title: "Climate displacement", keyIssues: ["adaptation", "migration"] },
    country: { code: "VUT", name: "Vanuatu", formalName: "Republic of Vanuatu" },
    speeches: [{ role: "opening", text, timeLimit: 60, timedOut: false }],
  }, timeout: 35_000 });
  expect(scorecard.status(), await scorecard.text()).toBe(200);
  expect((await scorecard.json()).dimensions.clarity.score).toBeGreaterThanOrEqual(0);
});
