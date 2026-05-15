# Composer Cafe — a recipe

A **recipe** is an executable build plan, designed to be handed to a coding agent and run end-to-end. This one builds **Composer Cafe**, a minimal community site for user profiles, recipes, and skills.

## How to execute

This folder is the working directory. Hand it to a coding agent (Claude Code, Cursor, etc.) with the instruction:

> Execute this recipe. Read `RECIPE.md`, then run the phases in `steps/<n>/` in folder-number order. Within each numbered folder, fan out the `.md` files as parallel subagent tasks and wait for all to complete before advancing. Honor every Verify block. Stop at any USER PAUSE for explicit confirmation before continuing.

There's nothing to install ahead of time except an agent — the recipe's first step walks you through Node, the Supabase CLI, and creating a Supabase project interactively.

## Conventions

- **Working directory** at runtime is this folder. The project being built lands in `output/`.
- **Phase order** is strict (`steps/1/` → `steps/7/`). Within a phase, every `.md` file runs in parallel; the next phase begins only after all complete.
- **One owner per shared file per phase.** Within a parallel phase, each file under `output/` has exactly one step that may write or edit it. Other steps in the same phase may import from it but must not touch it. This prevents races on parallel writes — the runtime cannot serialize two subagents editing the same file. When designing a recipe, pull cross-cutting edits into a single owner step rather than splitting them feature-by-feature.
- **Verify** at the bottom of every step file is mandatory. Bias toward **human verification**, not scripted assertions: a step is done when the human looking at the result agrees it's done.
- **USER PAUSE** appears in three verify blocks. The agent stops, surfaces what was built, and waits for explicit approval before moving on.
- **State** lives in `.recipe-state.json` at this folder's root (gitignored).

## Security posture

Recipes are executable artifacts. The runtime sandbox and the cookbook curation layer are the real security boundaries; the file format's job is to be **maximally auditable** so a human reading the recipe can know exactly what will run.

- **No bash scripts.** Small checks are inlined into Verify blocks. Larger checks are TypeScript files under `scripts/` with comments, invoked as `npx tsx scripts/<name>.ts`. Never `chmod +x`.
- **Pinned versions.** Every `npm install` names an explicit version.
- **No remote piping.** No `curl X | sh`, no fetching code at run time, no eval'ing remote content.
- **No silent globals.** Anything system-wide is surfaced in the recipe's prereq walkthrough.
- **Inert assets.** Files in `assets/` are copied verbatim into the project; the runner never executes them.
