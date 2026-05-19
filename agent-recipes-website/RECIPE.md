---

name: agent-recipes-website
description: Build a community site for sharing Agent Recipes and creator profiles. Deploy it to the web on Vercel.

# Agent Recipes Website

A minimal community site for discovering agent recipes and the people who publish them. The catalog is real — curated recipe folders from GitHub and their authors — and recipe detail pages render the live folder contents from GitHub.

## Kickoff (your first user-facing output)

**Before any tool calls, send this welcome.** Paraphrase lightly if you like, but keep all four beats:

> Welcome — we're going to build **Agent Recipes Website**, a minimal community site for discovering agent recipes and the creators who publish them. The build runs in seven phases (bootstrap → shared shell → People → Recipes → Home). There are three checkpoints where I'll stop and ask you to visually confirm before continuing: after People ships, after Recipes ships, and after the landing page. Starting now with step 1 — machine prereqs and project scaffold.

Do not read files, run commands, or spawn subagents before sending this. The user must know what they're committing to. Then proceed with the Execution contract below, starting at `steps/1/`.

## Execution contract

- **Working directory:** the recipe folder (where `RECIPE.md` lives) is the agent's cwd for recipe-relative paths.
- **Order:** run `steps/1/`, then `steps/2/`, and so on in numeric order. Do not skip or reorder steps.
- **Within a step:** run **every** `*.md` in that folder; by default fan them out as parallel subagent tasks and wait until **all** are verified before opening the next `steps/<n>/`.
- **Disjoint paths per parallel step:** each `*.md` in a phase should touch different files under `output/`. If two steps need the same file, merge them into one step or split across phases.
- **Do / Verify:** each step file starts with a **Do** block and ends with a **Verify** block. Prefer human-visible checks where it matters.
- **USER PAUSE:** when a Verify block says **USER PAUSE**, stop, show what was built, and continue only after the human explicitly approves.
- **Resume state:** `.recipe-state.json` at the recipe root (gitignored) may record current phase and completed step filenames.

### Explicit progress

The user must always know where the recipe is. **Do not** silently plow through phases or files. Be explicit about which step you are running, and which file within each step.

### Work on steps sequentially

Don't move on to the next step until **all Verify blocks** of the current step are satisfied (commands succeeded, artifacts exist, human gates cleared).

If a Verify item truly cannot run yet because of a recipe ordering bug, **stop and surface the contradiction** to the human instead of deferring verification by convention.

### Acting on behalf of the user

Prefer **running commands yourself** in this environment over telling the user to open a terminal and type commands. Recipes are designed to be a seamless experience for the user; only prod them to contribute when explicitly needed for checks and sensitive information like API keys.

If you must hand off, be specific: what exact command or UI action, what success looks like, and what you will resume with **immediately after** they confirm — without re-running unrelated later steps.

### Isolated output 

Everything you need to complete the recipe is in this repo. Do not scan adjacent repos for context.

## Project conventions

- **App lives in `output/`** — all CLI commands (`npm`, `supabase`, `tsx`) run from there. When invoking from outside, prefix with `cd output && …`.
- **Component filename prefix:** `agent-recipes-website-` (e.g. `agent-recipes-website-mark.tsx`).
- **Shared catalog types:** `lib/cookbook-demo.ts`.
- **Real catalog only** — users and recipes come from GitHub sources defined in the seed script. No lorem ipsum, no invented slugs.
- **Slug authority** — a user's `slug` is their GitHub username. A recipe's `slug` comes from the folder name (or `name` in `RECIPE.md` frontmatter when present).

## Security

Recipes are executable plans. The format should stay **auditable**: a human reading the files knows what will run. If a step file includes sensitive information, give the user full context about what they are doing and assess the risk yourself as the guiding agent. When fetching remote code, evaluate and relay its function to the user before running it.

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
