# CBRE Workplace Strategy Tools

Internal AI-powered platform for workplace strategy engagements.

---

## What this is

A two-piece system:

| Piece | What it does | Where it lives |
|-------|-------------|----------------|
| `/site` | The website your team uses | GitHub Pages (free) |
| `/worker` | Holds the Anthropic API key securely | Cloudflare Workers (free) |

Your team visits the GitHub Pages URL → the site calls the Worker → the Worker calls Anthropic with your key → results come back. **Your API key is never in the browser.**

---

## One-time setup (~45 minutes)

### Step 1 — Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Create a **private** repo named `cbre-workplace-tools`
3. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-ORG/cbre-workplace-tools.git
   git push -u origin main
   ```

### Step 2 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under *Source*, select **GitHub Actions**
3. The site deploys automatically on every push to `main`
4. Your URL will be: `https://YOUR-ORG.github.io/cbre-workplace-tools`

### Step 3 — Deploy the Cloudflare Worker

Install the Cloudflare CLI if you haven't:
```bash
npm install -g wrangler
wrangler login
```

Deploy:
```bash
cd worker
wrangler deploy
```

This gives you a URL like: `https://cbre-workplace-tools-api.YOUR-SUBDOMAIN.workers.dev`

### Step 4 — Set your Anthropic API key (securely)

```bash
cd worker
wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted — it's encrypted, never visible in code
```

Optional: restrict access with a team password:
```bash
wrangler secret put ACCESS_PASSWORD
# Set any password — team members will need it if you enable this
```

### Step 5 — Connect the site to the Worker

Two files need your Worker URL:

**`site/assets/api.js`** — line 8:
```js
const WORKER_URL = 'https://cbre-workplace-tools-api.YOUR-SUBDOMAIN.workers.dev';
```

**`site/index.html`** — near the bottom in the `<script>` block:
```js
const WORKER_URL = 'https://cbre-workplace-tools-api.YOUR-SUBDOMAIN.workers.dev';
```

Then allow your GitHub Pages domain in the Worker:
```bash
wrangler secret put ALLOWED_ORIGINS_EXTRA
# Enter: https://YOUR-ORG.github.io
```

### Step 6 — Push and share

```bash
git add .
git commit -m "Connect Worker"
git push
```

GitHub Actions deploys automatically. Share the Pages URL with your team.

---

## Adding a new tool

Each tool is a single HTML file in `/site/tools/`. To add one:

1. Create `/site/tools/your-tool-name.html`
2. Import the shared API client at the top of your script:
   ```js
   import { callClaude, parseJSON } from '../assets/api.js';
   ```
3. Add a card to `/site/index.html` pointing to `tools/your-tool-name.html`
4. Push — it deploys automatically

---

## Costs

| Service | Cost |
|---------|------|
| GitHub Pages | Free |
| Cloudflare Workers | Free (100k requests/day) |
| Anthropic API | Pay per use (~$0.003–0.015 per analysis) |

A typical leadership interview analysis (10 transcripts) costs roughly **$0.05–0.15** in API usage.

---

## Project structure

```
cbre-workplace-tools/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Auto-deploys /site to GitHub Pages
├── worker/
│   ├── index.js                # Cloudflare Worker (API proxy)
│   └── wrangler.toml           # Worker config
└── site/                       # Everything here is public
    ├── index.html              # Landing page / tool hub
    ├── assets/
    │   └── api.js              # Shared Claude API client
    └── tools/
        ├── leadership-interviews.html
        ├── executive-visioning.html    (coming soon)
        ├── space-analysis.html         (coming soon)
        ├── focus-groups.html           (coming soon)
        ├── survey-analysis.html        (coming soon)
        └── ...
```

---

## Questions?

Built with Claude Code by CBRE Americas Consulting.
