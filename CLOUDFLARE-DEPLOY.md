# Deploying davistripholidays.com — The Complete Owner's Runbook

**Everything between "I have a zip file" and "my website is live on my own
domain with a working admin editor" — written for a first-timer, with nothing
assumed.**

> **Is this guide current?** Yes — every Cloudflare fact below was re-checked
> against Cloudflare's own documentation in September 2026 (limits page
> updated Jul 2026, build-image page Apr 2026, Next.js-on-Pages guide Aug
> 2026; links in Appendix D). The exact build sequence Cloudflare will run
> (`npm ci` → `npm run build` → deploy `out/`) was executed successfully on
> this exact code before the zip was made: **245 files, 21.1 MiB total,
> largest file 0.74 MiB — every free-tier limit passed with >98% headroom.**

---

## Table of contents

1. [The big picture](#1-the-big-picture-2-minute-read)
2. [Where you are right now](#2-where-you-are-right-now)
3. [Step 1 — Put the code on GitHub](#3-step-1--put-the-code-on-github-15-min)
4. [Step 2 — Create the Cloudflare Pages project](#4-step-2--create-the-cloudflare-pages-project-10-min--3-min-build)
5. [Step 3 — Wait for your domain to activate](#5-step-3--wait-for-your-domain-to-activate)
6. [Step 4 — Attach davistripholidays.com](#6-step-4--attach-davistripholidayscom-10-min)
7. [Step 5 — One-time CMS setup](#7-step-5--one-time-cms-setup-5-min)
8. [Step 6 — Analytics (optional)](#8-step-6--analytics-optional-30-min)
9. [Step 7 — Professional email (optional)](#9-step-7--professional-email-optional-20-min)
10. [Go-live checklist](#10-go-live-checklist-before-you-announce)
11. [How updates work from now on](#11-how-updates-work-from-now-on)
12. [Troubleshooting — match your symptom](#12-troubleshooting--match-your-symptom)
13. [What this costs](#13-what-this-costs)
14. [Appendix A — Run the site on your own computer](#appendix-a--run-the-site-on-your-own-computer)
15. [Appendix B — The pre-deploy verification](#appendix-b--the-pre-deploy-verification-what-was-tested)
16. [Appendix C — Repo map](#appendix-c--what-every-folder-in-the-zip-is)
17. [Appendix D — Sources & dates checked](#appendix-d--sources--dates-checked)

---

## 1. The big picture (2-minute read)

You are deploying a **100% static website**. `npm run build` turns this
project into a folder of plain HTML, CSS, JS and image files (`out/`).
Cloudflare Pages serves those files from its global network — and serving
static files on Cloudflare is **free and unlimited**.

```
 your computer            GitHub                    Cloudflare
┌────────────────┐   ┌──────────────────┐   ┌─────────────────────────┐
│ the zip file   │ → │ davistripholidays │ → │ Pages build (npm ci +   │
│ (this code)    │   │ repository        │   │ npm run build, ~3 min)  │
└────────────────┘   └──────────────────┘   └───────────┬─────────────┘
                         ↑      every git push / CMS save │
                         │                               ▼
                   ┌─────────────┐            ┌─────────────────────┐
                   │ Sveltia CMS │            │ davistripholidays.com │
                   │ at /admin   │            │ (+ <project>.pages.dev)│
                   │ edits content│           └─────────────────────┘
                   └─────────────┘
```

**Why Pages and not the "Workers" thing you may have read about?** In 2026
Cloudflare generally recommends Workers for *new full-stack apps*. This site
is not full-stack — it is a pure static export with zero server code, and
for that case Cloudflare's own docs still document Cloudflare Pages as the
supported path (their Next.js guide, updated Aug 2026, links static-export
sites straight to it). It is also the simplest and most beginner-proof flow,
and it's what this repo is already wired for (`wrangler.toml`, `_headers`,
`verify:export` audit). If the site ever needs real server features
(payments, database), there is a documented migration path — see §13.

**The whole cost picture, up front:**

| Item | Cost |
|---|---|
| Cloudflare Pages hosting, bandwidth, SSL, DNS | **₹0 forever** (free plan, no card needed) |
| GitHub repository (private) | **₹0 forever** |
| Your domain davistripholidays.com | Already paid (~₹1,000/yr renewal at Spaceship) |
| Admin CMS, analytics, email (optional) | **₹0** (Sveltia, GTM/GA4/Clarity, Zoho free tiers) |

---

## 2. Where you are right now

Already done (no action needed):

- ✅ The website is built and audited — this zip contains the complete,
  tested source code (see Appendix B for exactly what was verified).
- ✅ Domain purchased on Spaceship.
- ✅ Domain added to Cloudflare, and Spaceship's nameservers replaced with
  Cloudflare's — Cloudflare is currently showing
  *"Waiting for your registrar to propagate your new nameservers"*.
  This is **normal and correct**. Nothing is wrong; propagation typically
  finishes in 1–2 hours and can take up to 24 hours (§5 shows how to check).
- ✅ A GitHub repository has been created.

Still to do (this guide, in order — total active time ~45 minutes, plus waiting):

1. Upload the code to your GitHub repo (§3)
2. Create the Cloudflare Pages project — first deploy to a temporary URL (§4)
3. Wait for the domain's nameservers to finish activating (§5)
4. Attach davistripholidays.com + www (§6)
5. One-time CMS config fix so you can edit the site visually (§7)

> 💡 **Steps 1, 2 and 5 do not need the domain to be active yet.** Do them
> now; by the time you reach §6 the DNS will likely have propagated.

---

## 3. Step 1 — Put the code on GitHub (~15 min)

You need the GitHub repo to hold the code, because Cloudflare builds the
site *from GitHub* on every update. There are three ways to get the code
there — **Option A is strongly recommended** for first-timers.

**First, on your computer:** unzip `davistripholidays-github.zip`. You get a
folder named `davistripholidays` — for example
`C:\Users\yourname\Downloads\davistripholidays` (Windows) or
`~/Downloads/davistripholidays` (Mac). Remember this path; you'll need it
below.

> **You do NOT need to install Node.js or anything else in this step.**
> The build happens on Cloudflare's machines, not yours. You only need a
> browser (Option C), or GitHub Desktop (Option A), or Git (Option B).

### ⚠️ First, check your repo's name

You mentioned your repo is named **`davistripholidys`** — that looks like a
typo (missing an "a"). It is *completely fine functionally*, but if you want
it clean:

1. Open the repo on github.com → **Settings** (top tab) → **General**.
2. **Repository name** field → change to `davistripholidays` → **Rename**.
3. Done — GitHub automatically redirects the old URL, and any existing
   links keep working.

If you prefer keeping `davistripholidys`, that works too — just use that
name **consistently** everywhere it appears below (git remote URL in Option
B, and the CMS `config.yml` line in §7). This guide will use
`davistripholidays`.

### Option A — GitHub Desktop (recommended: graphical, zero terminal)

1. Download **GitHub Desktop** from `desktop.github.com` → install →
   **Sign in to GitHub.com** → complete the login in your browser.
2. In GitHub Desktop: menu **File → Add Local Repository…**
3. Browse to the unzipped folder `davistripholidays` → **Choose**.
4. GitHub Desktop says: *"The directory does not look like a Git
   repository. Would you like to create a repository here instead?"* →
   click **create a repository**.
   - Name: `davistripholidays`
   - Local path: keep as-is (your unzipped folder)
   - ⚠️ **Leave "README" UNCHECKED** (the project already has one) and
     leave ".gitignore" / "license" unchecked — the folder already contains
     everything.
   - Click **Create Repository**.
5. You'll now see the file list on the left — ~230 files, that's correct.
   Click **Commit to main** (a default commit message is pre-filled).
6. Click **Publish repository** (top right):
   - Name: `davistripholidays`
   - ☑ Keep as **Private**
   - Click **Publish**.
7. Verify: open `github.com/your-username/davistripholidays` in your
   browser → you should see folders `src`, `public`, `content` and files
   like `package.json`, `README.md`, `CLOUDFLARE-DEPLOY.md`.

### Option B — Git command line

1. Install Git from `git-scm.com` (Windows: just click Next through the
   installer — Git Credential Manager is included, which opens a browser
   window for login when you push).
2. Open a terminal (Windows: **Git Bash** from the Start menu; Mac: Terminal):
   ```bash
   cd path/to/davistripholidays     # the unzipped folder
   git init -b main
   git add .
   git commit -m "Davis Trip Holidays — initial upload"
   git remote add origin https://github.com/YOUR-USERNAME/davistripholidays.git
   git push -u origin main
   ```
3. A browser window opens → **Authorize Git Credential Manager** → the push
   completes.
4. If the push is rejected with *"non-fast-forward"* or *"fetch first"* —
   your GitHub repo was created with an auto-generated README. Simplest fix:
   ```bash
   git push -u origin main --force
   ```
   (Safe here: this repo should contain exactly the zip's content, and the
   zip includes its own better README.)

### Option C — Browser upload (last resort)

Possible without installing anything, but GitHub's web upload allows max
~100 files per drag and needs several batches (the project has ~230 files,
including 3 hidden dotfiles that MUST be uploaded: `.gitignore`,
`.nvmrc`, `.node-version` — on Windows, dotfiles are visible in Explorer;
on Mac, press `Cmd+Shift+.` in Finder to show them). Drag the *contents* of
the folder (not the folder itself) into the repo's "uploading an existing
file" page (repo page → **Add file → Upload files**). Because this is
error-prone, use A or B if at all possible.

**✅ Checkpoint:** your repo on github.com shows ~230 files with folders
`src/`, `public/`, `content/`, `content-archive/`, and `README.md`,
`CLOUDFLARE-DEPLOY.md`, `package.json`, `package-lock.json`,
`wrangler.toml`, `next.config.ts` at the root.

---

## 4. Step 2 — Create the Cloudflare Pages project (~10 min + 3 min build)

This connects Cloudflare to your GitHub repo. Every future push (including
every CMS edit) then rebuilds and redeploys automatically.

1. Log in at **dash.cloudflare.com** (the account where you added
   davistripholidays.com).
2. Left sidebar → **Workers & Pages** → **Create** (or "Create application"
   on older layouts).
3. Select the **Pages** tab → **Connect to Git** → **GitHub**.
4. GitHub asks *"Install & Authorize Cloudflare Pages"*:
   - Under **Repository access**, choose **Only select repositories** →
     pick `davistripholidays` → **Install & Authorize**. (Granting access
     to only this one repo is cleaner than "All repositories".)
5. Back on Cloudflare: select the repo → **Begin setup**.
6. **Set up and deploy** page — the only settings that matter:

   | Field | Value |
   |---|---|
   | Project name | `davis-trip-holidays` *(determines your temporary URL `davis-trip-holidays.pages.dev`; any name works, but this matches `wrangler.toml` already in the repo)* |
   | Production branch | `main` |
   | Framework preset | **Next.js (Static HTML Export)** if offered; otherwise **Next.js** — with the settings below the result is identical |
   | Build command | `npm run build` |
   | Build output directory | `out` |

   Leave "Build system version" on default (v2).

7. Expand **Environment variables (advanced)** → **Add variable**:
   - Name: `NODE_VERSION` — Value: `22` — Add for **Production** and
     **Preview**.
   - This pins the build machine's Node to 22. (The repo also carries
     `.node-version` and `.nvmrc` files saying the same thing — belt and
     suspenders; Cloudflare honors either, the env var is the most
     reliable.)
8. Click **Save and Deploy**. ⏳ **~2–4 minutes.**

**What the build log should look like** (open it: Deployments list → the
newest entry → view log): Cloudflare runs `npm ci` (installs exactly the
531 packages pinned in `package-lock.json` — this exact lockfile was tested
with this exact code, it will resolve), then `npm run build` (Next.js
compiles ~26 routes into `out/`), then uploads the static files. It ends
with **"Success"** and **"Published"**.

**Your site is now live on a temporary URL:**
`https://davis-trip-holidays.pages.dev` — open it and run through this
60-second sanity check:

- [ ] Homepage renders fully styled (hero, plates, footer) — if CSS is
      missing, see §12.
- [ ] Click a package card's **Itinerary** button → detail page opens
      *scrolled to the day-by-day section* (not the bottom).
- [ ] Click any **WhatsApp button** → WhatsApp opens with a pre-filled
      message.
- [ ] Open the site on your phone (send yourself the URL) — sections lock
      one-per-screen as you scroll.
- [ ] Visit a nonsense URL like `/xyz` → the branded 404 page appears.
- [ ] Visit `/sitemap.xml` → lists ~20 URLs.

**ℹ️ Costs nothing:** each build uses 1 of your **500 builds/month**; static
serving is unlimited. Nothing here can silently start charging you — there
is no card on the account.

---

## 5. Step 3 — Wait for your domain to activate

While the nameserver change propagates (you've already done the hard part),
Cloudflare shows the zone as **"Pending Nameserver Update"**.

**How to check the status:** dash.cloudflare.com home → the
davistripholidays.com card. When it flips to **"Active"**, you're done
waiting. Cloudflare re-checks automatically every few hours — but you can
force an instant re-check: domain card → **DNS** → click
**"Check nameservers now"** (bottom banner).

**Typical timing:** 1–2 hours; worst case 24 hours. If it's still pending
after 24 hours, see §12 (first entry).

**Nothing else to do in this step** — Cloudflare also automatically issues
your free Universal SSL certificate (covers `davistripholidays.com` and
`www.davistripholidays.com`) while this happens.

---

## 6. Step 4 — Attach davistripholidays.com (~10 min)

*Requires the zone to be Active (§5).*

1. Dashboard → **Workers & Pages** → open **davis-trip-holidays** (your
   Pages project) → **Custom domains** tab → **Set up a custom domain**.
2. Enter `davistripholidays.com` → **Continue** → **Activate domain**.
   - Because the domain is already in this same Cloudflare account,
     Cloudflare creates the DNS record for you (a proxied record pointing
     to Pages). **No nameserver changes, no manual DNS needed.**
   - If it warns about an **existing conflicting DNS record** (e.g. an old
     A record `@ → some IP` from when the domain was on Spaceship DNS):
     Cloudflare will offer to overwrite/replace it — accept. (Or delete the
     old A/CNAME rows for `@` and `www` yourself in **DNS** first.)
3. Repeat for `www.davistripholidays.com` → both domains on the same
   project. (`example.com` and `www.example.com` each get their cert
   automatically.)
4. Status per domain: **Initializing → Activating → Active** (usually
   minutes, occasionally up to a few hours — it's just certificate
   issuance).

**✅ Checkpoint:** open `https://davistripholidays.com` — your site, padlock
in the address bar, on your real domain. Do the same for
`https://www.davistripholidays.com`. Both work.

**Optional (recommended) hardening:** dashboard → your domain →
**SSL/TLS → Edge Certificates** → toggle **Always Use HTTPS** ON (free
feature; sends any stray `http://` visitor to the secure version).

---

## 7. Step 5 — One-time CMS setup (5 min)

The site ships with a visual editor at **`/admin`** (Sveltia CMS — a modern
Netlify-CMS/Decap rewrite). It commits content edits straight to GitHub, so
they deploy like any other change. One config line must point at *your* repo
first.

### 7a. Point the CMS at your repo

1. On github.com, open
   `https://github.com/YOUR-USERNAME/davistripholidays/blob/main/public/admin/config.yml`
2. Click the **pencil icon** (top right of the file) to edit.
3. Find this line (line 14):
   ```yaml
   repo: YOUR-GITHUB-USERNAME/davistripholidays # ← CHANGE THIS
   ```
4. Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username. If you
   kept the repo named `davistripholidys`, use that name instead — the line
   must exactly match `username/reponame` of your real repo.
5. **Commit changes** (green button, default message is fine).

### 7b. Log in and take it for a spin

1. Visit **`https://davistripholidays.com/admin`** (works on the pages.dev
   URL too).
2. Click **Login with GitHub** → authorize Sveltia CMS when GitHub asks.
   Sveltia's built-in hosted GitHub authentication is free and needs no
   setup. (If the login button spins forever, see §12 "Can't log into
   /admin".)
3. You'll see the collections: **Packages · Destinations · Reviews · FAQs ·
   Blog · Site settings**.
4. Try it: **Packages** → open "Manali Group Escape" → change nothing →
   **Save** → watch it create a commit on GitHub → ~2 minutes later the
   redeploy finishes.

**Daily use cheat-sheet:**

- **Change a price:** Packages → the package → "Starting price" → Save.
- **Seasonal offer:** the package's "Seasonal note" field.
- **Add a review:** Reviews → + New → fill → Save.
- **Office hours / response promise / socials:** Site settings.
- **Photos:** upload inside the editor; keep them under ~500 KB (phone
  photos are fine; avoid 5 MB originals — the site does not auto-compress
  CMS uploads).

---

## 8. Step 6 — Analytics (optional, 30 min)

The site already fires ready-made tracking events — you only create free
accounts and paste IDs.

1. **Google Tag Manager** — `tagmanager.google.com` → create account +
   container (Web, URL `davistripholidays.com`) → copy the container ID
   (`GTM-XXXXXXX`).
2. **Give the ID to Cloudflare:** Pages project → **Settings → Environment
   variables → Add** → Name `NEXT_PUBLIC_GTM_ID`, value `GTM-XXXXXXX`, add
   for Production **and** Preview → Save. Then: **Deployments** tab →
   latest deployment → **⋯ → Retry deployment** (env vars only apply to
   builds made *after* they're set — the retry rebuilds with it).
3. **Google Analytics 4:** in GTM → New tag → *Google Analytics: GA4
   Configuration* → paste `G-XXXXXXX` → Trigger: All Pages.
4. **Meta Pixel / Microsoft Clarity:** same pattern in GTM (Custom HTML tag
   for Clarity's snippet).
5. **Conversions for ads** — create GTM triggers of type *Custom Event* for
   the events the site already fires:

   | Event name | Fires when |
   |---|---|
   | `whatsapp_click` | any WhatsApp button tapped |
   | `phone_click` | any call button tapped |
   | `enquiry_submit` | contact form sent |
   | `customize_submit` | customize form sent |
   | `package_view` | package page viewed |

6. **Submit** (publish) the GTM container.

**Free alternative/addition:** Cloudflare Web Analytics — Pages project →
Settings → enable (cookie-free, zero setup).

---

## 9. Step 7 — Professional email (optional, 20 min)

`hello@davistripholidays.com` via **Zoho Mail free plan** (5 mailboxes,
5 GB each):

1. `zoho.com/mail` → sign up → **Forever Free Plan**.
2. Add your domain → Zoho shows DNS records (a TXT verification record +
   MX records) → add them in Cloudflare → **DNS → Add record** (copy the
   type/name/value Zoho shows; proxy status must be **DNS only** for MX/TXT
   — Cloudflare enforces this automatically for those record types).
3. Create mailboxes (`contact@`, `bookings@`, `info@`).
4. Tell the developer to switch the site's contact email, or change it
   yourself: **CMS → Site settings → Contact email**.

---

## 10. Go-live checklist (before you announce)

- [ ] All 3 packages + prices correct in CMS (cross-check with your PDFs)
- [ ] Founder story + photo on `/about`
- [ ] GSTIN + Udyam numbers correct in the trust/footer sections
- [ ] Legal pages reviewed by a professional (they render a DRAFT banner
      until then)
- [ ] Office hours correct (CMS → Site settings)
- [ ] WhatsApp test: submit the enquiry form and a WhatsApp button from
      your own phone; confirm the message arrives with pre-filled text
- [ ] Analytics: GTM Preview mode confirms `whatsapp_click` fires
- [ ] **Google Search Console** (`search.google.com/search-console`) → add
      property `davistripholidays.com` → submit `https://davistripholidays.com/sitemap.xml`
- [ ] Professional email live (§9) and site email switched

---

## 11. How updates work from now on

| You change… | What happens |
|---|---|
| Content via **/admin** (prices, packages, reviews, FAQs, settings, blog) | CMS commits to GitHub → Cloudflare rebuilds → live in ~2–3 min |
| Code (developer) → `git push` to `main` | Same automatic rebuild |
| Something breaks and you need the old version back | Pages project → **Deployments** tab → find the last good one → **⋯ → Rollback to this deployment** (instant, no rebuild) |
| Cloudflare is broken / you need an emergency manual upload | Developer runs `npm run deploy` (builds locally and uploads `out/` straight to Pages via Wrangler — bypasses Git entirely) |

Each automatic rebuild uses 1 of 500 monthly builds — with CMS-level editing
you will use maybe 100–200/month in the busiest season. If you ever exceed
it, nothing breaks; builds just pause until next month (the live site stays
served).

---

## 12. Troubleshooting — match your symptom

### Domain still "Pending Nameserver Update" after 24h

1. Spaceship dashboard → your domain → Nameservers: verify the two entries
   **exactly match** what Cloudflare's dashboard shows (domain card →
   DNS → the two `*.ns.cloudflare.com` names). No typos, no leftover
   Spaceship rows.
2. Cloudflare → domain card → **DNS → "Check nameservers now"**.
3. Still stuck after another few hours → Spaceship chat/support (they're
   responsive) — say "I changed nameservers 24h ago, please push the
   update." Nothing on the website side is affected while you wait.

### Build failed on Cloudflare

Open the log (Deployments → failed entry → view log) and match the last
lines:

- *"Unsupported engine"* or Node/Next version error → you skipped the
  `NODE_VERSION=22` env var (§4 step 7). Add it, then Deployments →
  latest → **⋯ → Retry deployment**.
- *"npm ci"* errors like `lock file out of sync` → the `package-lock.json`
  in the repo was changed/deleted. Restore the original from the zip (or
  from git history) and retry. Never delete the lockfile — it's what makes
  builds reproducible.
- Build **timeout** (>20 min) → almost always a giant photo committed via
  CMS. Check the CMS's last upload (`public/images/cms/`), remove/resize
  it, save again.
- *"Could not resolve"* a font or module → transient network issue on the
  build machine; just **Retry deployment**. (Fonts download at build time
  from Google — the build machine has internet access.)
- Builds fail only for *Preview* deployments, production fine → you
  probably set `NODE_VERSION` for Production only; add it for Preview too.

### pages.dev works, but my domain doesn't

- Domain zone must be **Active** first (§5) — check the Cloudflare home
  dashboard.
- Custom domain entry stuck on **"Initializing"** for >1 hour → Pages
  project → Custom domains → remove and re-add the domain.
- Zone is Active but site won't load → **DNS** tab: you should see a
  record for `@` (A, proxied, pointing to Pages) or a CNAME for
  `www`/`davis-trip-holidays.pages.dev`. If an old A record for `@`
  points at some IP, delete it and re-add the custom domain in the Pages
  project (Cloudflare recreates the record).
- Browser shows a security warning → the Universal SSL certificate is
  still issuing (rare; can take up to 24h after domain activation). Wait,
  then hard-refresh.

### www doesn't work / redirects weird

Both `davistripholidays.com` and `www.davistripholidays.com` must be added
as **custom domains on the same Pages project** (§6 step 3). They don't
need to redirect to each other — both serving the site is fine for this
kind of site; Google consolidates them via the sitemap.

### Site shows old content after a CMS edit

CMS saves take ~2–3 minutes to build + deploy. HTML pages ship with
`must-revalidate` caching, so after the deploy a normal refresh shows the
new content; if not, hard-refresh (**Ctrl+Shift+R** / **Cmd+Shift+R**).

### Can't log into /admin

1. You must be signed into **the same GitHub account** that owns the repo,
   in the same browser.
2. The `repo:` line in `public/admin/config.yml` (§7a) must exactly match
   your real `username/reponame` — including if you kept the
   `davistripholidys` spelling.
3. Clear cookies for the site and retry.
4. Still looping → Sveltia's hosted auth hiccup; the robust fallback is
   deploying the tiny free `sveltia/sveltia-cms-auth` worker to your
   Cloudflare account (10 min, github.com/sveltia/sveltia-cms-auth).

### CMS opens but Save fails ("permission denied" / 404)

The GitHub integration lost access: github.com → your profile →
**Settings → Applications → Installed GitHub Apps → Cloudflare Pages** —
make sure the repo is still in its access list. (Separately, Cloudflare
*builds* need the integration, but Sveltia *saves* use your own login.)

### Old package links 404

Expected: packages outside the 3 owner-verified ones were archived. They
serve the branded 404 page on purpose (don't re-link them anywhere; old
Google results will drop out of the index since they're real 404s).

### "This site can't be reached" everywhere, even pages.dev

Check the Pages project's **Deployments** tab — the latest deployment must
be green/Success. If all recent deployments failed, see "Build failed"
above. If they're green but the site is down, it's a Cloudflare incident
(rare): status.cloudflare.com — nothing for you to fix.

---

## 13. What this costs

| What | Free tier (verified Jul 2026 limits page) | This site uses |
|---|---|---|
| Static asset requests | **Unlimited** | ~10–30 files per visitor |
| Bandwidth | **Unlimited** | 21.1 MiB total bundle |
| Files per site | 20,000 | **245** (1.2%) |
| Max file size | 25 MiB | **0.74 MiB** (3%) |
| Builds | 500/month, 1 concurrent | ~10–200/month |
| Custom domains | 100 | 2 |
| SSL (Universal) | Free, automatic | ✓ |
| DNS hosting | Free | ✓ |
| Pages Functions (serverless) | 100k req/day | **0 — none exist in this project** |

**What could ever cost money (none apply):** server-side functions beyond
free caps, R2 storage, Argo Smart Routing, paid Workers CPU, image
resizing. The day you need real server features (online payments, a
database), the migration path is Cloudflare Workers with an adapter —
that stays free at this traffic level too, but it's a deliberate future
project, not something you'll drift into accidentally.

Domain renewal (~₹1,000/yr at Spaceship) is the only recurring cost, and
you've already paid this year — keep auto-renew ON.

---

## Appendix A — Run the site on your own computer

Optional — only for local development; never needed for deploying.

```bash
# once: install Node.js 22+ from nodejs.org, then:
npm install
npm run dev          # → http://localhost:3000
```

## Appendix B — The pre-deploy verification (what was tested)

Before this zip was packaged, the **exact sequence Cloudflare runs** was
executed on a clean copy of this code:

```
npm ci               → 531 packages installed from package-lock.json (next 16.3.2)
npm run build        → 26 routes prerendered as static HTML into out/
node scripts/verify-export.mjs
                     ✓ 245 files  / 20,000 limit
                     ✓ 21.12 MiB total, largest file 0.74 MiB / 25 MiB
                     ✓ out/404.html, out/_headers, out/sitemap.xml present
```

You can re-run the same audit any time, locally, before a deploy:
`npm run build && npm run verify:export`. The `out/` directory is
git-ignored on purpose — Cloudflare builds it fresh; committing build
output is never needed.

## Appendix C — What every folder in the zip is

| Path | What it is |
|---|---|
| `src/` | All application code (routes, components, libs) |
| `content/` | **The live site content** — markdown the CMS edits |
| `content-archive/` | Older packages/destinations, kept for reference (not built) |
| `public/` | Files served as-is: photos, logos, favicons, `_headers`, `/admin` CMS |
| `scripts/verify-export.mjs` | The free-tier limits auditor (Appendix B) |
| `next.config.ts` | Static-export config (`output: "export"`, trailing slashes) |
| `wrangler.toml` | Cloudflare Pages project config (`pages_build_output_dir = "out"`) |
| `package.json` / `package-lock.json` | Dependencies + exact pinned versions for reproducible builds |
| `.nvmrc` / `.node-version` | Tell build systems to use Node 22 |
| `.gitignore` | Keeps build output and machine-local junk out of git |
| `README.md` | Project overview for developers |
| `CLOUDFLARE-DEPLOY.md` | This guide |

## Appendix D — Sources & dates checked

- Cloudflare Pages — Next.js static export guide:
  developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site
  (checked Sep 2026)
- Cloudflare Pages — Limits: developers.cloudflare.com/pages/platform/limits
  (page dated Jul 2026 — 20,000 files / 25 MiB / 500 builds)
- Cloudflare Pages — Build image & Node version (`NODE_VERSION`,
  `.node-version`): developers.cloudflare.com/pages/configuration/build-image
  (page dated Apr 2026)
- Cloudflare Workers-vs-Pages guidance for 2026 (why a pure static site is
  the documented Pages case): developers.cloudflare.com/workers
  framework-guides + community/market write-ups, checked Sep 2026
- Sveltia CMS GitHub backend & auth options: sveltiacms.app/docs and
  github.com/sveltia/sveltia-cms-auth (checked Sep 2026)

*Cloudflare renames dashboard buttons occasionally. If a label here doesn't
match what you see, it's cosmetic — the flow (repo → build → out/ → custom
domain) has been stable for years.*
