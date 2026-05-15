# CONVENTIONS

Shared rules and contracts every step honors. Read this first before executing any phase.

## Execution contract (agent)

These rules govern **how** the recipe is run, not the product code.

### Explicit progress

The human must always know where the recipe is. **Do not** silently plow through phases or files.

- **Start each phase** with a short, explicit header: which folder (`steps/<n>/`), what that phase is for, and the list of step files you will run (parallel or sequential as `RECIPE.md` requires).
- **Start each step file** by naming the file path (e.g. `steps/3/users-migration.md`) so it is obvious which instructions are in scope.
- **Finish each step file** only after its **Verify** block is fully satisfied; then state clearly that this file is **done** and list what was verified.
- **Finish each phase** only after **every** step file in that folder is done; then state that **phase `<n>` is complete** before opening `steps/<n+1>/`.
- Optionally mirror that progress in `.recipe-state.json` (e.g. current phase number, list of completed filenames) so a stalled session can resume without guessing.

### No advancing past incomplete verification

**Never** move on because something is “fine for later” or “we’ll verify when it matters.”

- A step file is **not** complete until **every** item in its **Verify** block is satisfied (commands succeeded, artifacts exist, human gates cleared).
- A phase is **not** complete until **every** `.md` in that `steps/<n>/` folder is complete.
- **Do not** begin any work scoped to the next phase (including reads that only exist to implement the next phase) until the current phase is fully verified. If a Verify item truly cannot run yet because of a recipe ordering bug, **stop and surface the contradiction** to the human instead of deferring verification by convention.

### Acting on behalf of the user

Prefer **running commands yourself** in this environment (from the correct working directory) over telling the user to open a terminal and type commands.

- Only ask the user to use **their** terminal when something is **impossible or unsafe** to drive from here (typical examples: interactive browser OAuth, secrets).
- When you must hand off, be specific: what exact command or UI action, what success looks like, and what you will resume with **immediately after** they confirm — without re-running unrelated later steps.

## Recipe layout & parallelism

- **Working directory:** the recipe folder (where `RECIPE.md` lives) is the agent’s cwd for recipe-relative paths. The generated app lives only under `output/`.
- **Phase order:** run `steps/1/`, then `steps/2/`, and so on in numeric order. Do not skip or reorder phases.
- **Within a phase:** run **every** `*.md` in that folder; by default fan them out as parallel subagent tasks and wait until **all** are verified before opening the next `steps/<n>/`.
- **One owner per path under `output/` per phase:** exactly one step file may create or edit a given file in that phase. Other steps in the same phase may import only. Prevents parallel write races.
- **Verify:** each step file ends with a **Verify** block. Prefer human-visible checks where it matters; the **Execution contract** still requires every Verify item to pass before advancing.
- **USER PAUSE:** when a Verify block says **USER PAUSE**, stop, show what was built, and continue only after the human explicitly approves.
- **Resume state:** `.recipe-state.json` at the recipe root (gitignored) may record current phase and completed step filenames.

## Working directory (output app)

The project lives in `output/`. All CLI commands (`npm`, `supabase`, `tsx`) for the app run from there. When invoking from outside, prefix with `cd output && …`.

## Security posture (recipe artifact)

Recipes are executable plans. The format should stay **auditable**: a human reading the files knows what will run.

- **No bash scripts as the primary delivery.** Small checks live in Verify text; heavier checks are TypeScript under `scripts/`, run with `npx tsx scripts/<name>.ts`. Do not `chmod +x` recipe-owned scripts.
- **Pinned versions** on every `npm install` (explicit package@version).
- **No remote piping:** no `curl … | sh`, no fetching and eval’ing remote code as part of the recipe.
- **No silent globals:** anything that mutates the host outside the project is called out in an early prereq phase.
- **Inert `assets/`:** files are copied into `output/` verbatim; the runner does not execute them as scripts.

## Data authority

- Each entity (`users`, `recipes`, `skills`) has a `slug text not null unique` column used for urls.
- Do not return placeholder values unless explicitly mentioned in a given `step`.
- `install_count` ships at 0 and is incremented by the install-tracking API route when a user clicks the primary CTA.

## Pack content (recipes + skills)

Recipe + skill rows store **a pointer to the source folder on GitHub**, not the files themselves. Required columns:

```
source_owner   text not null
source_repo    text not null
source_branch  text not null default 'main'
source_path    text not null
```

Detail pages fetch the folder live from the GitHub Contents API at render time, cached with `next: { revalidate: 3600 }`. Do **not** snapshot pack files into the DB.

## Real data only

The catalog is whatever the seed inserts — a small, curated list of **real** skills/recipes from real GitHub folders, not a templated cross-product of fake titles × fake people. Users are real GitHub profiles, fetched once at seed time from `/users/<login>`.

## Primary CTA

Detail-page primary action is **"Use in Cursor"** — a pill button that opens a modal with a copyable install snippet (typically a `git clone && cp` one-liner targeting the user's local skill/agent folder) and bumps `install_count` via a POST to the install route. Secondary is **"View on GitHub"** linking to the source folder. There is no "Download .zip" surface.

## Featured

"Featured" on the home page is **alphabetical first N**. No hardcoded slug lists; no `FEATURED_RECIPES` / `FEATURED_SKILLS` constants. The featured loader is `select * order by title limit N`.

## Style

- Tokens via Tailwind utilities (`bg-background`, `text-muted`, `text-accent`, `border-border`, `bg-footer-bg`). No hard-coded colors.
- Mono font for labels and metadata; sans for display.
- Single accent (orange `#f54e00`). Used sparingly for state, hover, and primary action.

## Step-writing principles

When extending or editing a step file:

- Describe **what** is built and **why**, not the exact function signatures or SQL. The executing agent picks the implementation.
- Reference contracts in this file; do not restate them in the step prompt.
- If updating one architectural decision requires editing N step files, the recipe is over-specified. Lift the duplication into this file.

