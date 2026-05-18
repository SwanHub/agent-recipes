# CONVENTIONS

A `RECIPE` is a guided conversation with an AI agent, led by strict verification checks and parallelized agentic work. Abide by these conventions first before executing any step.

### Explicit progress

The user must always know where the recipe is. **Do not** silently plow through phases or files. Be explicit about which step you are running, and which file within each step.

### Work on steps sequentially

Don't move on to the next step until **all Verify blocks** of the current step are satisfied (commands succeeded, artifacts exist, human gates cleared). 

If a Verify item truly cannot run yet because of a recipe ordering bug, **stop and surface the contradiction** to the human instead of deferring verification by convention.

### Acting on behalf of the user

Prefer **running commands yourself** in this environment over telling the user to open a terminal and type commands. Recipes are designed to be a seamless experience for the user; only prod them to contribute when explicitly needed for checks and sensitive information like API keys.

If you must hand off, be specific: what exact command or UI action, what success looks like, and what you will resume with **immediately after** they confirm — without re-running unrelated later steps.

### Save recipe state (optional)

Optionally mirror progress in a `.recipe-state.json` file (e.g. current phase number, list of completed filenames) so a stalled session can resume without guessing.

## Recipe layout & parallelism

- **Working directory:** the recipe folder (where `RECIPE.md` lives) is the agent’s cwd for recipe-relative paths. 
- **Phase order:** run `steps/1/`, then `steps/2/`, and so on in numeric order. Do not skip or reorder steps.
- **Within a step:** run **every** `*.md` in that folder; by default fan them out as parallel subagent tasks and wait until **all** are verified before opening the next `steps/<n>/`.
- **Disjoint paths per parallel step:** each `*.md` in a phase should touch different files under `output/`. If two steps need the same file, merge them into one step or split across phases.
- **Do**: each step file starts with a **Do** block, which outlines a single agent's work for a given step file. 
- **Verify:** each step file ends with a **Verify** block. Prefer human-visible checks where it matters.
- **USER PAUSE:** when a Verify block says **USER PAUSE**, stop, show what was built, and continue only after the human explicitly approves.
- **Resume state:** `.recipe-state.json` at the recipe root (gitignored) may record current phase and completed step filenames.

## Working directory (output app)

The project lives in `output/`. All CLI commands (`npm`, `supabase`, `tsx`) for the app run from there. When invoking from outside, prefix with `cd output && …`.

## Security

Recipes are executable plans. The format should stay **auditable**: a human reading the files knows what will run.

- **No bash scripts as the primary delivery.** Small checks live in Verify text; heavier checks are TypeScript under `scripts/`, run with `npx tsx scripts/<name>.ts`. Do not `chmod +x` recipe-owned scripts.
- **Pinned versions** on every `npm install` (explicit package@version).
- **No remote piping:** no `curl … | sh`, no fetching and eval’ing remote code as part of the recipe.
- **No silent globals:** anything that mutates the host outside the project is called out in an early prereq phase.
- **Inert `assets/`:** files are copied into `output/` verbatim; the runner does not execute them as scripts.

