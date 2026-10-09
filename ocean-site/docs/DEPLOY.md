# Deploying

## The short version

`npm run build`, then upload `dist/index.html` anywhere that serves static files. It's the whole site.

## Hosting options

- **Your own server / NAS behind a Cloudflare tunnel:** serve `dist/` with any static server
  (nginx, Caddy, or `node scripts/serve.mjs`) and point the tunnel's hostname at it.
- **Static hosts** (Cloudflare Pages, Netlify, GitHub Pages, Vercel): build command `node scripts/build.mjs`, output directory `dist`.
- **claude.ai artifact:** the current preview link. The guide's AI answers only work there (see below).

Cache headers: `index.html` changes on every build, so either disable long caching for it or add a
version query when you link to it.

## Wiring the intake form

In `src/js/site/30-pages-guide-intake.js`, set:

```js
var INTAKE_ENDPOINT = 'https://your-n8n-host/webhook/dolonia-intake';
```

The form POSTs JSON:

```json
{
  "project": ["Website", "Private AI"],
  "organization_type": "Small business",
  "details": "…",
  "timeline": "Within 1 to 3 months",
  "budget": "Not sure yet",
  "name": "…", "email": "…", "organization": "…", "phone": "…",
  "submitted_at": "2026-10-09T15:04:05.000Z",
  "source": "dolonia.cloud intake"
}
```

- **n8n:** a Webhook node (POST, respond immediately with 200) → Supabase "Create row" → email/Slack
  notification. Allow the site's origin in CORS.
- **Supabase directly:** an Edge Function that validates and inserts into an `intake` table. Don't put a
  service key in the page.
- If the POST fails, the form falls back to opening the visitor's email app, so no lead is lost.

## The guide's AI answers

Inside claude.ai the guide calls `window.claude.use('sample')`. On your own domain that doesn't exist, so
the guide uses its built-in FAQ (`KB`). To get AI answers on dolonia.cloud, add a small server endpoint
that calls an AI API with the same instruction text and `FACTS`, and call it from `ask()` where
`guide.sample` is used. Never put an API key in the page.

## Before you ship

- `npm run build` and `npm test` pass.
- Checked on a phone: loader, dive, a full dive with stops, the form scrolls only vertically.
- The federal identifiers and contact details are current in both places they appear.
