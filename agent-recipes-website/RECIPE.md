---

name: agent-recipes-website
description: Build a community site for sharing Agent Recipes and creator profiles. Deploy it to the web on Vercel.
build_duration: 5-10mins

# Agent Recipes Website

A minimal community site for discovering agent recipes and the people who publish them. The data is real — users and recipes come from live GitHub sources — and recipe detail pages render the folder contents from GitHub at request time.

## How to execute

A recipe is a sequence of **steps** (folders under `steps/`); each step contains one or more **tasks** (the `*.md` files inside). After reading this file end-to-end, your **first action is to run `steps/0/`**, then `steps/1/`, and so on in numeric order. No skipping, no reordering.

**A recipe is a guided conversation, not a turnkey script.** When the user invokes you with "execute this recipe," "make this," "run it," "build it," or similar, that phrase is permission to **begin** — meaning start at **step 0** (welcome and orientation), not skip ahead to step 1. The user wants to be welcomed and oriented before anything builds. Every STOP gate — including step 0's — is a hard halt independent of the original invocation. **Do not collapse step 0 into step 1.**

- **Within a step, run all tasks in parallel as subagents** and wait until **every** task verifies before opening the next step. Tasks in a step touch disjoint paths under `output/`; if two tasks would touch the same file, merge them or split across steps.
- **Each task has a Do block and a Verify block.** Don't move on until every Verify in the step passes.
- **`.recipe-state.json` is required, not advisory.** At every step boundary, update it: `{ "completed_steps": [...], "current_step": N }` at the recipe root (already gitignored). Before opening step N, read it and confirm step N−1 is in `completed_steps`. This is the canonical "where am I" artifact.
- **Announce step transitions in a dedicated message** before opening the next step folder — its own message, not buried in another response:

  ```
  ---
  **Step <N> done** — <one-line summary of what shipped>.
  **Opening step <N+1>:** <next step name>.
  ---
  ```

- **STOP gates** — dedicated `## STOP — … WITH USER` sections in step tasks (not inline bullets). Plowing past a STOP gate is the worst failure mode of a recipe.
  - **STOP — APPROVE** (step 0): after welcome + state init, send the welcome prompt and **stop**. Call zero tools until the user explicitly approves starting the build. The user's original invocation is NOT this approval — that was permission to begin step 0, not to skip past it.
  - **STOP — REVIEW** (steps 4, 6, 7): after the step's tasks all verify, send the user-facing review prompt and **stop**. Call zero tools until the user replies with explicit affirmative approval ("looks good" / "yes" / "approved" / "proceed"). Silence, vague replies, and a neutral "ok" do not qualify.
- **Be explicit about progress.** The user must always know which step and which task you are on. No silent plowing through.
- **Drive in-session.** Run commands yourself; only hand off for sensitive credentials or browser flows you can't drive. Be specific about what the user needs to do and what you'll resume with.
- **Stay scoped.** Everything you need is in this recipe folder. Don't scan adjacent repos.
- **Surface contradictions.** If a Verify can't run because of an ordering bug in the recipe, stop and tell the user instead of deferring.

## Project conventions

- **App lives in `output/`** — all CLI commands (`npm`, `supabase`, `tsx`) run from there.
- **Component filename prefix:** `agent-recipes-website-`.
- **Shared types:** `lib/types.ts`.
- **Slug authority** — a user's `slug` is their GitHub username; a recipe's `slug` is its folder name (or `name` in `RECIPE.md` frontmatter).
- **Real data only** — no lorem ipsum, no invented slugs.

## Security

Recipes are executable plans. Keep the format auditable — a human reading the files should know what will run. When fetching remote code, evaluate and relay its function before running it.

## What you'll build

Two entities and the routes that surface them:

- **Users** — community profiles (`/profiles/all`, `/profile/[slug]`).
- **Recipes** — guided build plans with a file-tree browser on the detail page (`/recipes/all`, `/recipes/[slug]`).
- **Landing** at `/` — hero, featured recipes, community grid.
- **Stubs** at `/join` and a custom 404.

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase Postgres, deployed on Vercel.

## Steps

People (steps 3–4), then Recipes (steps 5–6), then Home (step 7). Each feature follows **write → ship**; ship steps are a single ops task plus **STOP — REVIEW**.


| #   | Folder     | What it produces                                                                   | Gate              |
| --- | ---------- | ---------------------------------------------------------------------------------- | ----------------- |
| 0   | `steps/0/` | Welcome — greet the user, initialize `.recipe-state.json`                          | **STOP — APPROVE** |
| 1   | `steps/1/` | Bootstrap — scaffold, deps, AGENTS.md                                              | build passes      |
| 2   | `steps/2/` | Shared shell — chrome, stubs, Supabase client, helpers                             | chrome renders    |
| 3   | `steps/3/` | People **(write)** — persistence, data, routes, UI (4 parallel)                    | files compile     |
| 4   | `steps/4/` | People **(ship)** — migrate, seed users, verify profiles                           | **STOP — REVIEW** |
| 5   | `steps/5/` | Recipes **(write)** — persistence, data, routes, UI (4 parallel)                   | files compile     |
| 6   | `steps/6/` | Recipes **(ship)** — migrate, re-seed users + recipes, verify `/recipes` + profile | **STOP — REVIEW** |
| 7   | `steps/7/` | Home — landing showcases recipes + community                                       | **STOP — REVIEW** |


## Success criteria

- `npm run dev` from `output/` boots clean.
- All routes return 200: `/`, `/profiles/all`, `/profile/<seeded-slug>`, `/recipes/all`, `/recipes/<seeded-slug>`, `/join`.
- Recipe detail pages render the real folder contents (markdown previews, code files) fetched live from GitHub.
- "Use in Cursor" pops a modal with a copyable install snippet; clicking it bumps the install counter persisted in Supabase.
- The landing page highlights what recipes enable, using recipe thumbnails where available.
- The user has visually confirmed the landing page, a profile, and a recipe detail.
