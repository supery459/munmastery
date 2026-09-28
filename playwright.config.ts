import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", timeout: 120_000, expect: { timeout: 15_000 }, workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000", channel: "msedge", headless: true, viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
});
