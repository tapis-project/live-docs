import { defineConfig } from "@playwright/test";

// Not 9999, so a dev server you have running (README) is never mistaken for the one under test.
const PORT = 9998;

export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.mjs",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Set CHROMIUM_PATH to use a system Chromium instead of Playwright's download.
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
  },
});
