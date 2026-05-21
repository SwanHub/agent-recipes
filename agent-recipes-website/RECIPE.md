---

name: agent-recipes-website
description: Community site for sharing Agent Recipes — Next.js + Supabase + Vercel + weekly newsletter capture.
build_duration: 5-10mins

### Stack

Next.js · Supabase · Vercel.

### How to execute

A recipe is a sequence of **steps** (folders of `.md`). Work one step at a time, in order, with the user. You are a guide, not an autopilot.

**Every turn — before any tool call:**

1. Read `.recipe-state.json`. Missing → `current_step = 0`.
2. Allowed reads: `steps/{current_step}/**` only. Nothing under `steps/{n}/` where `n > current_step`.
3. Never scaffold, install, migrate, seed, or edit `output/` until the current step's `Do` says to.

### File shape

Each step `.md` has two clauses:

- **Do** — actions for this step only.
- **Verify** — checks that must pass before advancing.

If `Verify` fails, you are still on this step. No reading ahead to prepare.

### Do not jump ahead — REQUIRED

- **Never read future steps.** No `Read`/`Grep`/`Glob`/subagents on `steps/{n > current_step}`. They don't exist yet.
- **Never run tools during STOP / HALT.** Includes `Read`, prereq checks, state writes.
- **Never infer "go" from build intent.** "Make it" / "build it" / "let's go" is **not** approval unless the current step says so. Step 0 requires `go / ready / yes / proceed` literally.
- **Never advance state early.** Write `.recipe-state.json` only when the current step says to — after `Verify`, not when you plan to start the next step.
- **Finish the current step completely** before opening the next folder.

### Isolation

Stay inside this recipe folder. No peeking at adjacent repos.

### Parallel subagents — REQUIRED

Two steps fan out to parallel subagents. **You (orchestrator) must dispatch every subagent for the step in a single message.** Running these serially is a failed run, not a slow run.

- **Step 2 — Shell** dispatches **three** Agent subagents in one message: one per file in `steps/2/`. Files write disjoint paths and cannot conflict.
- **Step 3 — Packs** dispatches **two** Agent subagents in one message: `pack-people.md` and `pack-recipes.md`. Each pack owns its `features/<pack>/*`, `components/<pack>/*`, `app/(<pack>)/*`, and migration.

**Orchestrator duties (you, main thread):**

- Enumerate the step folder for filenames. **Do not read sibling/pack file contents in the main thread** — those are subagent jobs. Read RECIPE.md and `.recipe-state.json` only.
- Send **one message** with N parallel Agent tool calls — one Agent per file, each pointed at its own `.md`.
- Wait for fan-in (all subagents return).
- Run the step's Verify yourself: a single `npm run build` from `output/`, plus any step-specific checks. Subagents do **not** run builds — orchestrator runs it once.
- Update `.recipe-state.json` only after Verify passes.

**Failed-run signals — do not do these:**

- Reading a sibling/pack file's content yourself before dispatching (only the subagent reads its file).
- Implementing any sibling/pack content in the main thread.
- Dispatching one subagent, waiting, then dispatching the next ("staggered" is serial).
- Splitting a pack file into sub-tasks. A pack is one subagent with full context.

Never parallelize across step numbers.

### State

`.recipe-state.json`:

- `current_step` — the step you are **on**.
- `completed_steps` — steps fully done.

Source of truth for which markdown you may open. Read at every turn.

### Tone

Crystal clear about current step + what's next. Announce transitions only after `Verify`. Friendly guide; strict order.

# Begin at `steps/0/welcome.md`

No other step file until step 0 completes with explicit approval.
