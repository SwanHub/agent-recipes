---

## name: composer-cafe

description: Build a community site for sharing Agent Recipes, Skills, and Profiles. Deploy it to the web on Vercel.

# Composer Cafe

A minimal community site that displays user profiles, recipes, and skills. Built on Next.js, Supabase and deployed on Vercel. Warm off-white canvas, Geist type, a single accent orange. The catalog is real (curated GitHub skills + their authors) and the in-app file browser renders the live folder contents from GitHub. The primary CTA on every detail page is "Use in Cursor" — Composer Cafe is a discovery surface for installable agent skills, not a download portal.

## How to run

Use this folder as the working directory. There is nothing to install up front except an agent — phase `steps/1/` walks through Node, Supabase CLI, and project credentials; the runner should execute everything it can in-session and only ask for a separate terminal when something (e.g. browser OAuth) cannot be driven here.

Give the agent:

> Execute this recipe. Read `RECIPE.md` and `CONVENTIONS.md` (including **Execution contract**), then run the phases in `steps/<n>/` in folder-number order. Within each numbered folder, fan out the `.md` files as parallel subagent tasks and wait for all to complete before advancing. Honor every Verify block in full before starting the next file or phase — no deferring checks to “when they matter.” Announce explicitly which phase and step file you are on and when each is done. Stop at any USER PAUSE for explicit confirmation before continuing.

**Before executing anything, read `[CONVENTIONS.md](./CONVENTIONS.md)`.** It defines the working directory, data-authority rules, the CTA pattern, step-writing principles, **Execution contract**, phase/parallelism rules, and security expectations for the recipe artifact.

## What you'll build

Three entities and the routes that surface them:

- **Users** — community profiles (`/profiles/all`, `/profile/[slug]`).
- **Recipes** — project plans submitted by users, with a file-tree browser on the detail page (`/recipes/all`, `/recipes/[slug]`).
- **Skills** — atomic capabilities authored by users (`/skills/all`, `/skills/[slug]`).
- **Landing** at `/` composing featured recipes + featured skills + community grid.
- **Stubs** at `/join` and a custom 404.

## Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind v4 with CSS-variable design tokens; Geist + Geist Mono via `next/font/google`.
- **Database:** Supabase Postgres. Schema in `supabase/migrations/`; one migration per table (`users`, `recipes`, `skills`). Server-only service-role client at `lib/supabase/catalog-db.ts`.
- **Data flow:** Server Components → fetches in `lib/server/` → Supabase. When env vars are missing the fetches throw a clear server error rather than silently serving fake data.
- **GitHub file-tree preview:** Detail pages fetch each entity's folder live from the GitHub Contents API at render time (cached ~1h). The DB stores only the `source_*` pointer to the GitHub folder.
- **Seed:** `scripts/supabase/seed-catalog.ts` reads a small hardcoded list of GitHub skill-folder URLs + author logins, fetches each author's profile from `/users/<login>`, and inserts users + skills (+ recipes when a recipes repo is wired up). No fake or templated content.

## Phases

Vertically sliced by feature: People (P3–P4), then Skills (P5–P6), then Recipes (P7–P8), then Home (P9). Each feature follows **write → ship**; ship phases are a single ops step plus **USER PAUSE**.


| #   | Folder     | What it produces                                                                      | Gate           |
| --- | ---------- | ------------------------------------------------------------------------------------- | -------------- |
| 1   | `steps/1/` | Bootstrap — scaffold, deps, AGENTS.md                                                 | build passes   |
| 2   | `steps/2/` | Shared shell — chrome, stubs, Supabase client, helpers                                | chrome renders |
| 3   | `steps/3/` | People **(write)** — persistence, data, routes, UI (4 parallel)                        | files compile  |
| 4   | `steps/4/` | People **(ship)** — migrate, seed users, verify profiles                               | **USER PAUSE** |
| 5   | `steps/5/` | Skills **(write)** — persistence, data, routes, UI (4 parallel)                        | files compile  |
| 6   | `steps/6/` | Skills **(ship)** — migrate, seed skills, verify `/skills` + profile skills           | **USER PAUSE** |
| 7   | `steps/7/` | Recipes **(write)** — persistence, data, routes, UI (4 parallel)                       | files compile  |
| 8   | `steps/8/` | Recipes **(ship)** — migrate, re-seed all tables, verify `/recipes` + full profile    | **USER PAUSE** |
| 9   | `steps/9/` | Home — landing composes featured recipes, skills, community                           | **USER PAUSE** |


## Success criteria

- `npm run dev` from `output/` boots clean.
- All routes return 200: `/`, `/profiles/all`, `/profile/<seeded-slug>`, `/recipes/all` (may be empty), `/skills/all`, `/skills/<seeded-slug>`, `/join`.
- Skill detail pages render the real folder contents (markdown previews, code files) fetched live from GitHub.
- "Use in Cursor" pops a modal with a copyable install snippet; clicking it bumps the install counter persisted in Supabase.
- The user has visually confirmed the landing page, a profile, and a skill detail.

