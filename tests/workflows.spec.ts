import { test, expect, type Page } from "@playwright/test";
import { LEARN_MODULES } from "../src/components/learn/data";

const password = "Testing-only-123!";
const draft = "Background\nThe delegation of Vanuatu recognizes that climate displacement threatens island communities. Under the Paris Agreement, states must cooperate on adaptation.\nCountry policy\nVanuatu supports climate justice and sustainable development.\nProposed solutions\nWe propose a voluntary UN monitoring framework with annual reporting, transparent funding and regional partnerships to protect displaced people. Implementation should include measurable targets, independent review, and consultation with affected communities.";

async function signup(page: Page, email = "qa@example.test") {
  await page.goto("/");
  await page.getByRole("button", { name: "Create account", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder("Jordan Diaz").fill("QA Delegate");
  await dialog.getByPlaceholder("you@school.edu").fill(email);
  await dialog.getByPlaceholder("At least 8 characters").fill(password);
  await dialog.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
async function login(page: Page, email: string, secret = password) {
  await page.getByRole("button", { name: "Sign in", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder("you@school.edu").fill(email);
  await dialog.getByPlaceholder("At least 8 characters").fill(secret);
  await dialog.getByRole("button", { name: "Log in", exact: true }).click();
}
async function logout(page: Page) {
  await page.getByRole("button", { name: "Log Out", exact: true }).first().click();
  await expect(page).toHaveURL(/\/$/);
}
async function portfolio(page: Page, name: string, committee = "WHO") {
  await page.goto("/portfolios");
  await page.getByRole("button", { name: /New portfolio/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Conference name", { exact: true }).fill(name);
  await dialog.getByLabel("Assigned committee", { exact: true }).fill(committee);
  await dialog.getByRole("combobox", { name: "Country delegation" }).fill("Vanuatu");
  await dialog.getByRole("button", { name: "Vanuatu", exact: true }).click();
  await dialog.getByLabel("Agenda topics (one per line)", { exact: true }).fill("Climate displacement and island health");
  await dialog.getByLabel("Start date", { exact: true }).fill("2027-03-15");
  await dialog.getByLabel("End date", { exact: true }).fill("2027-03-17");
  await dialog.getByRole("button", { name: "Create portfolio", exact: true }).click();
  await expect(dialog).toBeHidden();
  return page.evaluate((name) => {
    const id = localStorage.getItem("mun-mastery:session:v1");
    return JSON.parse(localStorage.getItem(`mun-mastery:portfolios:v1:${id}`) || "[]").find((p: { conferenceName: string }) => p.conferenceName === name).id as string;
  }, name);
}
async function activity(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem(`mun-mastery:activity:v1:${localStorage.getItem("mun-mastery:session:v1")}`) || "[]"));
}
test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (route) => route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"Test offline mode"}' }));
});

test("credentials, settings, logout, cross-tab session and account isolation", async ({ page, context }) => {
  await page.goto("/settings"); await expect(page).toHaveURL(/\/$/);
  await signup(page);
  await portfolio(page, "Private conference");
  await page.goto("/settings");
  const forms = page.locator("form");
  await forms.nth(0).locator("input").fill("Updated Delegate");
  await forms.nth(0).getByRole("button").click();
  await expect(page.getByText("Display name updated.")).toBeVisible();
  await forms.nth(1).locator('input[type="email"]').fill("updated@example.test");
  await forms.nth(1).locator('input[type="password"]').fill("incorrect");
  await forms.nth(1).getByRole("button").click();
  await expect(page.getByText("Current password is incorrect.")).toBeVisible();
  await forms.nth(1).locator('input[type="password"]').fill(password);
  await forms.nth(1).getByRole("button").click();
  await expect(page.getByText("Email updated.")).toBeVisible();
  const passwords = forms.nth(2).locator("input");
  await passwords.nth(0).fill(password); await passwords.nth(1).fill("New-test-secret-456!"); await passwords.nth(2).fill("New-test-secret-456!");
  await forms.nth(2).getByRole("button").click();
  await expect(page.getByText("Password updated.")).toBeVisible();
  const other = await context.newPage(); await other.goto("/dashboard");
  await expect(other.getByRole("button", { name: "Log Out" }).first()).toBeVisible();
  await logout(page); await expect(other).toHaveURL(/\/$/);
  await login(page, "updated@example.test", password); await expect(page.getByRole("dialog").getByRole("alert")).toContainText("Incorrect");
  await page.getByRole("dialog").getByPlaceholder("At least 8 characters").fill("New-test-secret-456!");
  await page.getByRole("dialog").getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.locator("aside").getByText("Updated Delegate", { exact: true })).toBeVisible();
  await logout(page); await signup(page, "second@example.test");
  await page.goto("/portfolios"); await expect(page.getByText("Private conference", { exact: true })).toHaveCount(0);
  expect(await activity(page)).toHaveLength(0);
});

test("paper drafts, reports, uploads, reassignment and portfolio deletion", async ({ page }) => {
  await signup(page);
  await page.goto("/position-paper-grader");
  await expect(page.getByRole("button", { name: "Grade position paper", exact: true })).toBeDisabled();
  await page.locator('input[type="file"]').setInputFiles({ name: "position.txt", mimeType: "text/plain", buffer: Buffer.from(draft) });
  await expect(page.locator("textarea")).toHaveValue(draft);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.getByRole("button", { name: "Grade position paper", exact: true }).click();
  await expect(page.getByText("Local grading", { exact: true })).toBeVisible();
  let events = await activity(page); expect(events).toHaveLength(2); expect(events[0].portfolioId).toBeNull(); expect(events[0].details.input.text).toBe(draft);
  const paperId = events[0].id;
  const globalDraftId = events[1].id;
  const alpha = await portfolio(page, "Alpha MUN"); const beta = await portfolio(page, "Beta MUN");
  await page.evaluate((portfolioId) => {
    const userId = localStorage.getItem("mun-mastery:session:v1");
    localStorage.setItem(`mun-mastery:active-portfolio:v1:${userId}`, portfolioId);
  }, beta);
  await page.goto(`/position-paper-grader?draft=${globalDraftId}`);
  await expect(page.locator("textarea")).toHaveValue(draft);
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  events = await activity(page); expect(events[0].portfolioId).toBeNull();
  await page.goto(`/history?entry=${paperId}`);
  await expect(page.getByText("Overall score", { exact: true })).toBeVisible();
  await page.locator("li").filter({ has: page.getByRole("button", { name: /^Position paper review / }) }).getByRole("combobox", { name: "Assign to conference portfolio" }).selectOption(alpha);
  await page.goto(`/portfolios/${alpha}`); await expect(page.getByRole("link", { name: "Position paper review", exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Assign to conference portfolio" }).selectOption(beta);
  await expect(page.getByRole("link", { name: "Position paper review", exact: true })).toHaveCount(0);
  await page.goto(`/portfolios/${beta}`); await expect(page.getByRole("link", { name: "Position paper review", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete portfolio", exact: true }).click();
  await page.getByRole("button", { name: "Confirm delete", exact: true }).click();
  events = await activity(page); expect(events.find((e: { id: string }) => e.id === paperId).portfolioId).toBeNull();
  await page.goto(`/history?entry=${paperId}`);
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: "Export", exact: true }).click(); expect((await download).suggestedFilename()).toContain("positionPaper");
  await page.getByRole("link", { name: "Edit draft", exact: true }).click(); await expect(page.locator("textarea")).toHaveValue(draft);
});

test("targeted speech, custom simulator context and completed debrief", async ({ page }) => {
  await signup(page); const id = await portfolio(page, "Target MUN", "Custom Health Council");
  await page.goto(`/portfolios/${id}`);
  await page.getByRole("button", { name: /New speech check/ }).click();
  await expect(page).toHaveURL(/\/speech-lab$/);
  await page.locator("textarea").fill(draft);
  await page.getByRole("button", { name: "Analyze speech", exact: true }).click();
  await expect(page.getByText("Local analysis", { exact: true })).toBeVisible();
  let events = await activity(page); expect(events[0].portfolioId).toBe(id); expect(events[0].details.input.context.topic).toBe("Climate displacement and island health");
  await page.goto(`/history?entry=${events[0].id}`); await expect(page.getByText("Overall delivery score", { exact: true })).toBeVisible();
  await page.route("**/api/simulator/delegate", (route) => route.fulfill({ status: 200, contentType: "text/plain", body: "Honourable Chair, our delegation supports a funded international health framework and annual review." }));
  await page.goto("/simulator");
  await page.getByRole("button", { name: /Climate displacement and island health/ }).click();
  await page.getByRole("button", { name: /^Beginner/ }).click();
  await expect(page.getByText("Custom Health Council", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Enter committee session", exact: true }).click();
  for (let i = 0; i < 2; i++) {
    await page.locator("textarea").waitFor({ state: "visible", timeout: 45_000 });
    await page.locator("textarea").fill(draft);
    await page.getByRole("button", { name: /Submit|Deliver speech/ }).click();
    await expect(page.locator("textarea")).toHaveCount(0);
  }
  await expect(page.getByText("Executive debrief", { exact: true })).toBeVisible({ timeout: 45_000 });
  events = await activity(page); const session = events.find((e: { type: string }) => e.type === "simulation");
  expect(session.portfolioId).toBe(id); expect(session.details.session.speeches).toHaveLength(2);
  await page.goto(`/history?entry=${session.id}`);
  await page.getByRole("button", { name: "Full session transcript", exact: true }).click();
  await expect(page.getByText(draft, { exact: true }).first()).toBeVisible();
  expect((await activity(page)).filter((e: { type: string }) => e.type === "simulation")).toHaveLength(1);
});

test("all learning modules complete, quiz feedback and retake", async ({ page }) => {
  await signup(page);
  for (const lesson of LEARN_MODULES) {
    await page.goto(`/learn/${lesson.id}`);
    for (let i = 0; i < lesson.steps.length; i++) {
      const step = lesson.steps[i];
      if (step.type === "quiz") { await page.getByRole("button", { name: step.options[step.correctIndex], exact: true }).click(); await expect(page.getByText(step.explanation, { exact: true })).toBeVisible(); }
      await page.getByRole("button", { name: i === lesson.steps.length - 1 ? "Finish" : "Continue", exact: true }).click();
    }
    await expect(page.getByRole("heading", { name: "Module complete" })).toBeVisible();
    await page.getByRole("button", { name: /Retake/ }).click();
    await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  }
  expect((await activity(page)).filter((e: { type: string }) => e.type === "learn")).toHaveLength(6);
});

test("dashboard dates, saved conferences, search, help, notifications and clear activity", async ({ page }) => {
  await signup(page); await portfolio(page, "Dashboard conference");
  await page.goto("/dashboard"); await expect(page.getByRole("link", { name: /Dashboard conference/ })).toBeVisible();
  await page.evaluate(() => {
    const id = localStorage.getItem("mun-mastery:session:v1");
    localStorage.setItem(`mun-mastery:activity:v1:${id}`, JSON.stringify([
      { id: "new", type: "speech", timestamp: Date.now(), title: "Recent speech", score: 90, dimensions: { confidence: 90 } },
      { id: "old", type: "speech", timestamp: Date.now() - 20 * 86400000, title: "Older speech", score: 30, dimensions: { confidence: 30 } },
    ]));
  });
  await page.reload();
  await page.getByRole("button", { name: "Last 30 days", exact: true }).click();
  await page.getByRole("button", { name: "Last 7 days", exact: true }).click();
  await expect(page.getByText("Older speech", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Last 7 days", exact: true }).first().click(); await page.getByRole("button", { name: "All time", exact: true }).click();
  await expect(page.getByText("Older speech", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Notifications", exact: true }).click(); await expect(page.getByText("Latest session logged", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape"); await expect(page.getByText("Latest session logged", { exact: true })).toBeHidden();
  await page.getByRole("button", { name: "Help & docs", exact: true }).first().click(); await expect(page.getByRole("dialog")).toBeVisible(); await page.keyboard.press("Escape");
  await page.getByPlaceholder("Search modules, topics, conferences…").fill("Vanuatu");
  await page.getByRole("button", { name: /Vanuatu Country delegation/ }).click();
  await expect(page).toHaveURL(/country=Vanuatu/);
  await page.goto("/settings"); await page.getByRole("button", { name: "Clear activity data", exact: true }).click();
  await page.getByRole("button", { name: /Yes|Confirm clear/ }).click();
  await expect(page.getByText("Activity data cleared.")).toBeVisible(); expect(await activity(page)).toHaveLength(0);
  await page.goto("/portfolios"); await expect(page.getByText("Dashboard conference", { exact: true })).toBeVisible();
});

test("desktop and mobile routes, active navigation, no overflow or runtime errors", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
  await signup(page);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/dashboard", "/portfolios", "/speech-lab", "/position-paper-grader", "/simulator", "/crisis", "/learn", "/settings", "/history", "/help"]) {
      const response = await page.goto(path); expect(response?.status()).toBe(200);
      await expect(page.locator("body")).not.toContainText("Application error");
      if (path !== "/help") {
        await expect(page.getByPlaceholder("Search modules, topics, conferences…")).toBeVisible();
        if (width === 1440) await expect(page.locator(`aside a[href="${path}"][aria-current="page"]`)).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: ${path}`).toBe(true);
    }
    await page.goto("/dashboard"); await page.screenshot({ path: `test-results/dashboard-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("older portfolio artifacts migrate once and remain available", async ({ page }) => {
  await signup(page);
  const id = await portfolio(page, "Legacy MUN");
  await page.evaluate((portfolioId) => {
    const userId = localStorage.getItem("mun-mastery:session:v1");
    localStorage.setItem(`mun-mastery:portfolio-artifacts:v1:${userId}`, JSON.stringify([
      { id: "historic-paper", portfolioId, type: "positionPaper", createdAt: Date.now() - 1000, title: "Historic paper", review: {
        composite: 62, grade: "C", wordCount: 42, summary: "Add more detail.", strengths: ["formatting"], growthAreas: ["topicAnalysis"],
        criteria: Object.fromEntries(["policyAlignment", "topicAnalysis", "proposedSolutions", "formatting"].map((key) => [key, { score: 62, notes: ["Add detail."], highlights: [] }])),
      } },
    ]));
  }, id);
  await page.goto(`/portfolios/${id}`);
  await expect(page.getByRole("link", { name: "Historic paper" })).toBeVisible();
  await page.getByRole("link", { name: "Historic paper" }).click();
  await expect(page.getByText("Overall score", { exact: true })).toBeVisible();
  await page.reload();
  expect((await activity(page)).filter((entry: { title: string }) => entry.title === "Historic paper")).toHaveLength(1);
});

test("storage failures report unsaved work and prevent false success", async ({ page }) => {
  await signup(page);
  await page.goto("/position-paper-grader");
  await page.locator("textarea").fill(draft);
  await page.evaluate(() => {
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("mun-mastery:activity:")) throw new DOMException("Quota exceeded", "QuotaExceededError");
      return setItem.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Grade position paper", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "browser could not save" })).toBeVisible();
  await expect(page.getByText("Overall score", { exact: true })).toBeVisible();
  expect(await activity(page)).toHaveLength(0);
});

test("crisis controls pause, resume, restart and log directive decisions", async ({ page }) => {
  await signup(page);
  await page.clock.install();
  await page.goto("/crisis");
  await expect(page.getByText("Live situation room")).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeVisible();
  await page.clock.runFor(5000);
  await expect(page.getByText("No directives on file yet.", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.clock.runFor(80_000);
  const directive = page.locator("button").filter({ hasText: /Coordinate|Authorize|Deploy|Request|Approve|Reject/ }).first();
  await expect(directive).toBeVisible();
  await directive.click();
  await expect(page.getByText("Decision log", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Restart monitoring", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
});
