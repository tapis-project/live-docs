// Loads the site in a real browser with spec fetches stubbed out, so failures
// here mean the page itself (or a CDN script it loads, like Redoc) is broken.
import { test, expect } from "@playwright/test";
import { loadApis } from "./apis.mjs";

const apis = loadApis();
const VERSION = "1.0.0";
// Redoc renders the title as "<title> (<version>)".
const heading = (api) => `${api.url} (${VERSION})`;

let pageErrors;

test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));
  // Serve a tiny spec whose title is the requested URL, so each test can
  // assert which spec Redoc was asked to render.
  await page.route("https://raw.githubusercontent.com/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        openapi: "3.0.0",
        info: { title: route.request().url(), version: VERSION },
        paths: {},
      }),
    })
  );
});

test.afterEach(() => {
  expect(pageErrors, "uncaught errors in the page").toEqual([]);
});

test("default page renders the first API and builds the nav", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => typeof window.Redoc)).toBe("object");
  await expect(page.locator("#links_container li")).toHaveCount(apis.length);
  await expect(page.locator("h1")).toHaveText(heading(apis[0]));
});

test("clicking a nav item renders that API and updates the URL", async ({ page }) => {
  const target = apis[apis.length - 1];
  await page.goto("/");
  await page.locator("#links_container li", { hasText: target.name }).click();
  await expect(page.locator("h1")).toHaveText(heading(target));
  expect(new URL(page.url()).searchParams.get("service")).toBe(target.name);
});

for (const api of apis) {
  test(`?service=${api.name} renders its spec`, async ({ page }) => {
    await page.goto(`/?service=${encodeURIComponent(api.name.toLowerCase())}`);
    await expect(page.locator("h1")).toHaveText(heading(api));
  });
}
