# CONVENTIONS

A `RECIPE` is a guided conversation with an AI agent, led by strict verification checks and parallelized agentic work. Abide by these conventions first before executing any step.

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

## Working directory (output app)

The project lives in `output/`. All CLI commands (`npm`, `supabase`, `tsx`) for the app run from there. When invoking from outside, prefix with `cd output && …`.

Component filenames use the `agent-recipes-website-` prefix (e.g. `agent-recipes-website-mark.tsx`). Shared catalog types live in `lib/cookbook-demo.ts`.

## Data authority

- **Real catalog only** — users and recipes come from GitHub sources defined in the seed script. No lorem ipsum, no invented slugs.
- **Slug authority** — a user's `slug` is their GitHub username. A recipe's `slug` comes from the folder name (or `name` in `RECIPE.md` frontmatter when present).

## Security

Recipes are executable plans. The format should stay **auditable**: a human reading the files knows what will run. If a step file includes sensitive information, give the user full context about what they are doing and assess the risk yourself as the guiding agent. When fetching remote code, evaluate and relay its function to the user before running it.
