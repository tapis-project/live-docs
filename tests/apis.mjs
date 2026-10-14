// Evaluate live-docs.js with just enough browser stubs to read the `apis` list,
// so tests always cover exactly the tabs the site shows.
import fs from "node:fs";
import vm from "node:vm";

export function loadApis() {
  const src = fs
    .readFileSync(new URL("../live-docs.js", import.meta.url), "utf8")
    // live-docs.js may be an ES module; drop its imports so it runs as a plain script.
    .replace(/^import\s.*$/gm, "");
  const context = {
    location: { search: "" },
    document: {},
    URLSearchParams,
    $: () => ({ ready() {} }),
  };
  vm.runInNewContext(src, context);
  return context.apis.map((api) => ({ name: api.name, url: api.getUrlForCurrentBranch() }));
}
