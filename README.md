# Tapis live docs app

Run `npm install` to download packages and build the site.

After that you can serve the built files through a proxy or a simple python server shown here:

```bash
python -m http.server 9999
```
Once running, point a browser to `localhost:9999` to view the local built live-docs page.

To iterate, change files, rebuild, and relaunch the server.

## Tests

```bash
npm install
npx playwright install chromium   # or set CHROMIUM_PATH=$(which chromium) to use a system Chromium
npm test                          # npm run test:smoke / npm run test:spec-urls to run one suite
```

- `tests/smoke.spec.mjs` loads the page in a browser with the spec fetches stubbed out. It checks that Redoc loads, the nav is built, and every `?service=` renders.
- `tests/spec-urls.spec.mjs` checks that every upstream spec URL in `live-docs.js` still resolves.

Both run in GitHub Actions (`.github/workflows/test.yml`) on PRs to `master` and on pushes to `master`.
