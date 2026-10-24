# Andrea Cappelluti — portfolio

Static site with History API routing: one `index.html`, six pages shown one at a time
(`/`, `/work`, `/projects`, `/thesis`, `/about`, `/ask`) plus one page per project (`/projects/mobility-lens`, `/projects/bsc-thesis`, …).
Back/Forward restore the scroll position; deep links work. No build step; the only server code is the
`/ask` chatbot's Vercel Function. Style: reverse-engineered
from Revolut's site and app (light/dark bands, pill buttons, app-style list rows), with orange accents;
General Sans (Fontshare, stand-in for Aeonik Pro) for display and Inter for UI text.

## Run locally

```bash
npx --yes serve@14.2.4 -s . -l 4173
```

`-s` serves `index.html` for unknown paths, so deep links work. Opening `index.html` from the file system
does not work (paths are absolute). `serve` does not run `/api`, so the chatbot answers with its
"can't answer right now" message; to try it for real, put the key in a `.env` file
(`OPENROUTER_API_KEY=...`; `vercel dev --local` reads `.env`, not `.env.local`) and run:

```bash
npx --yes vercel@65.2.0 dev --local --listen 3000
```

`--local` needs no Vercel login. `.vercelignore` keeps `.env*` out of deploys, so the key is never uploaded.

## Deploy

Vercel: import the folder; `vercel.json` rewrites every route except `/api` and the static files to `index.html`.
Set `OPENROUTER_API_KEY` in the project's Environment Variables, and in OpenRouter's privacy settings
allow the free models (their providers may log prompts).

## Chatbot (`/ask`)

`api/chat.mjs` keeps the OpenRouter key on the server, prepends a system prompt built from
`api/_profile.mjs`, and sends `models: [nvidia/nemotron-3-ultra-550b-a55b:free, nvidia/nemotron-3.5-super-vl:free]`,
so OpenRouter falls back to the second model on errors, rate limits or downtime. Reasoning is off for speed;
only the last 11 messages, 1000 characters each, are sent, and Markdown is stripped from replies. When both
models fail the page asks visitors to email instead.

- Free models come and go: as of October 2026 `thinkingmachines/inkling:free` answers 403 outside agentic
  harnesses, and `nvidia/nemotron-3-super-120b-a12b:free` returns 404 from its provider. If the chat starts
  failing, check the function logs and swap `MODELS` in `api/chat.mjs`.

- Free-model quota is per OpenRouter account, shared by every visitor: 20 requests a minute, and 50 a day
  until the account has bought 10 credits in total (then 1000 a day).
- `api/_profile.mjs` is everything the bot knows. It is a copy of the site and CV facts: update it when
  `index.html` or the CV change.

## Files

| File | Role |
| --- | --- |
| `index.html` | All content (readable without JavaScript) |
| `styles.css` | Tokens (Revolut greys and dark surfaces, orange accent, General Sans + Inter) and layout |
| `js/app.js` | Router (views, history, scroll restore), reveals, projects filter, bar colour over dark bands |
| `js/showup.js` | The live show-up curve on the thesis page (illustrative model) |
| `js/chat.js` | The `/ask` chat: conversation, starter questions, fallback message |
| `api/chat.mjs` | Vercel Function behind the chat (OpenRouter call, limits, fallback) |
| `api/_profile.mjs` | What the chatbot knows about Andrea (`_` keeps it from becoming a function) |

## Photos and video

The site currently has no pictures. Good places for them when they are ready:

- Home: a real screenshot or portrait could replace the HTML phone in the hero.
- About: a portrait above or beside the "Let's talk" card.
- Project pages: one screenshot or visual per project under the title (16:10).

Put files in `assets/` and reference them with absolute paths (`/assets/...`).
