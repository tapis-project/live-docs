// Checks that every upstream OpenAPI spec the site links to still exists.
// These live in other repos, so they can break without any change here.
import { test, expect } from "@playwright/test";
import { loadApis } from "./apis.mjs";

for (const api of loadApis()) {
  test(`${api.name} spec is reachable`, async ({ request }) => {
    const res = await request.get(api.url);
    expect(res.status(), api.url).toBe(200);
    expect(await res.text(), api.url).toMatch(/\b(openapi|swagger)\b/);
  });
}
