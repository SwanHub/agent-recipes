---

name: agent-recipes-website
description: Build a community site for sharing Agent Recipes and creator profiles. Deploy it to the web on Vercel.

# Agent Recipes Website

A minimal community site for discovering agent recipes and the people who publish them. The catalog is real — curated recipe folders from GitHub and their authors — and recipe detail pages render the live folder contents from GitHub.

## How to execute this recipe

1. Read **[CONVENTIONS.md](./CONVENTIONS.md)** in full before touching anything. It defines the working directory, data-authority rules, the execution contract, phase/parallelism rules, and security expectations.
2. Run `steps/` in numeric order, starting at `steps/1/`. Do not skip or reorder.
3. Within each phase, fan the `*.md` files out as parallel subagent tasks and wait until **all** verify before opening the next phase.
4. Drive everything in-session. Only hand off to the user when something cannot be driven here (browser OAuth, secrets) or at a **USER PAUSE** checkpoint.
5. Announce the current step and file as you go — never silently advance.

## What you'll build

Two entities and the routes that surface them:

- **Users** — community profiles (`/profiles/all`, `/profile/[slug]`).
- **Recipes** — guided build plans with a file-tree browser on the detail page (`/recipes/all`, `/recipes/[slug]`).
- **Landing** at `/` — hero, featured recipes, community grid.
- **Stubs** at `/join` and a custom 404.

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase Postgres, deployed on Vercel.

## Phases

Vertically sliced by feature: People (P3–P4), then Recipes (P5–P6), then Home (P7). Each feature follows **write → ship**; ship phases are a single ops step plus **USER PAUSE**.


| #   | Folder     | What it produces                                                                   | Gate           |
| --- | ---------- | ------------------------------------------------------------------------------------ | -------------- |
| 1   | `steps/1/` | Bootstrap — scaffold, deps, AGENTS.md                                                | build passes   |
| 2   | `steps/2/` | Shared shell — chrome, stubs, Supabase client, helpers                               | chrome renders |
| 3   | `steps/3/` | People **(write)** — persistence, data, routes, UI (4 parallel)                     | files compile  |
| 4   | `steps/4/` | People **(ship)** — migrate, seed users, verify profiles                              | **USER PAUSE** |
| 5   | `steps/5/` | Recipes **(write)** — persistence, data, routes, UI (4 parallel)                    | files compile  |
| 6   | `steps/6/` | Recipes **(ship)** — migrate, re-seed users + recipes, verify `/recipes` + profile | **USER PAUSE** |
| 7   | `steps/7/` | Home — landing showcases recipes + community                                        | **USER PAUSE** |


## Success criteria

- `npm run dev` from `output/` boots clean.
- All routes return 200: `/`, `/profiles/all`, `/profile/<seeded-slug>`, `/recipes/all`, `/recipes/<seeded-slug>`, `/join`.
- Recipe detail pages render the real folder contents (markdown previews, code files) fetched live from GitHub.
- "Use in Cursor" pops a modal with a copyable install snippet; clicking it bumps the install counter persisted in Supabase.
- The landing page highlights what recipes enable, using recipe thumbnails where available.
- The user has visually confirmed the landing page, a profile, and a recipe detail.
