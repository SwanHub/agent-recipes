---

name: recipe-cookbook
description: Build a community site for sharing Agent Recipes and creator profiles. Deploy it to the web on Vercel.

# Recipe Cookbook

A minimal community site for discovering agent recipes and the people who publish them. Built on Next.js, Supabase, and Vercel. Warm off-white canvas, Geist type, a single accent orange. The catalog is real — curated recipe folders from GitHub and their authors — and recipe detail pages render the live folder contents from GitHub. The primary CTA on every recipe detail page is **Use in Cursor**; optional **demo url** frontmatter links to a deployed example when the author provides one.

## How to run

Use this folder as the working directory. There is nothing to install up front except an agent — phase `steps/1/` walks through Node, Supabase CLI, and project credentials; the runner should execute everything it can in-session and only ask for a separate terminal when something (e.g. browser OAuth) cannot be driven here.

Give the agent:

> Execute this recipe. Read `RECIPE.md` and `CONVENTIONS.md` (including **Execution contract**), then run the phases in `steps/<n>/` in folder-number order. Within each numbered folder, fan out the `.md` files as parallel subagent tasks and wait for all to complete before advancing. Honor every Verify block in full before starting the next file or phase — no deferring checks to “when they matter.” Announce explicitly which phase and step file you are on and when each is done. Stop at any USER PAUSE for explicit confirmation before continuing.

**Before executing anything, read `[CONVENTIONS.md](./CONVENTIONS.md)`.** It defines the working directory, data-authority rules, the CTA pattern, catalog metadata (including optional `demo url`), step-writing principles, **Execution contract**, phase/parallelism rules, and security expectations for the recipe artifact.

## What you'll build

Two entities and the routes that surface them:

- **Users** — community profiles (`/profiles/all`, `/profile/[slug]`).
- **Recipes** — guided build plans with a file-tree browser on the detail page (`/recipes/all`, `/recipes/[slug]`).
- **Landing** at `/` — hero and featured recipes that show what great recipes make possible (thumbnails from each recipe’s `assets/recipe-thumbnail.png` when present), plus a community grid.
- **Stubs** at `/join` and a custom 404.

## Catalog recipe metadata

Each seeded recipe folder includes a `RECIPE.md` with YAML frontmatter. The seed script reads at least `name` and `description`. Authors may also set:

```yaml
---
name: my-recipe
description: One-line pitch.
demo url: https://example.com   # optional — live deployed output
---
```

When `demo url` is present, the site surfaces a link to the deployed example on the recipe card and detail page.

## Architecture

- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind v4 with CSS-variable design tokens; Geist + Geist Mono via `next/font/google`.
- **Database:** Supabase Postgres. Schema in `supabase/migrations/`; one migration per table (`users`, `recipes`). Server-only service-role client at `lib/supabase/catalog-db.ts`.
- **Data flow:** Server Components → fetches in `lib/server/` → Supabase. When env vars are missing the fetches throw a clear server error rather than silently serving fake data.
- **GitHub file-tree preview:** Recipe detail pages fetch each folder live from the GitHub Contents API at render time (cached ~1h). The DB stores only the `source_*` pointer to the GitHub folder.
- **Thumbnails:** For cards and the landing page, prefer `assets/recipe-thumbnail.png` in the recipe repo (GitHub raw URL). Fall back to a neutral placeholder when missing.
- **Seed:** `scripts/supabase/seed-catalog.ts` seeds `SwanHub` as the first user, discovers recipe folders from [github.com/SwanHub/agent-recipes](https://github.com/SwanHub/agent-recipes/tree/main), parses each `RECIPE.md`, and inserts users + recipes. No fake or templated content.

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
