---

## name: write-recipe
description: Use this skill to take an existing project, observe how it was built, and compile that into an executable recipe an AI can re-run from a clean slate.

# write-recipe

A recipe is a build plan an AI executes end-to-end. A good recipe leaves room for local decisions; a bad recipe is a coding tutorial that breaks when tools shift.

## Purpose

Study an existing project and write the recipe that recreates it from nothing.

Output: `RECIPE.md`, `CONVENTIONS.md`, and `steps/<n>/*.md`. No agent-facing `README.md` — optional one-line human stub linking to `RECIPE.md` only.

## Documentation layout


| File             | Holds                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `RECIPE.md`      | **What**: pitch, architecture, phase table (folders, gates, USER PAUSE), success criteria, **How to run** paste block.              |
| `CONVENTIONS.md` | **How**: execution contract, `output/` layout, parallelism, disjoint paths per step, security, product rules that never change per step. |
| `steps/<n>/*.md` | **Do** + **Verify** per parallel task. Point at conventions; don't restate them.                                                    |


Runner behavior → `CONVENTIONS.md`. Product order and gates → `RECIPE.md`.

## Phase structure

**Macro rhythm**

1. Bootstrap (scaffold, deps)
2. Shared shell (chrome, cross-cutting libs — no DB ship)
3. Feature verticals, each: **write → ship**
4. Compose (landing / integration — after all features shipped)

**Write vs ship**

- **Write phase** — migrations (not applied), types, fetches, UI, seed *script* only. Gate: `build` passes.
- **Ship phase** — one step file: env check → `db push` → seed → dev server → **USER PAUSE** with URLs. Human signs off before the next feature.

Stateful ops (Postgres, APIs, seed) belong in ship, not spread across parallel write steps.

**One vertical per feature** — e.g. People, Skills, Recipes as separate write/ship pairs. Don't lump unrelated entities in one "catalog" phase.

**Within a write phase — parallel tracks** (3 is a sweet spot):


| Track           | Typical step                  | Touches                                                                          |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| **Persistence** | migration + seed script       | `supabase/migrations/`, `scripts/supabase/`                                      |
| **Data layer**  | types + fetches/queries       | `lib/cafe-demo.ts`, catalog query/fetch modules                                  |
| **Surface**     | components, pages, API routes | `components/`, `app/`                                                            |


Fan out tracks in parallel; wait for all Verify blocks before the ship phase.

**When to combine steps**

- **Do merge:** types + fetches (same track); migration + seed script (schema and seed stay aligned).
- **Don't merge:** surface + seed; persistence + UI; steps that would edit the same file in one phase (merge or re-phase instead).
- **Don't keep a step** whose entire job is one tiny type or one constant — fold it into data layer or persistence.

**When to split a vertical** — separate write/ship pairs when the feature has its own schema, routes, and human checkpoint (Skills vs Recipes, not one combined catalog phase).

## Step minimalism

LLMs need few tokens. Steps name **outcomes**, not implementations.

**Good:** "Warm minimal shell per `RECIPE.md`; semantic Tailwind tokens in `globals.css`."  
**Bad:** 40 lines of verbatim CSS, column-by-column SQL, pixel sizes, exact footer copy.

**Put in `RECIPE.md` / `CONVENTIONS.md`:** aesthetic pitch, slug authority, CTA rules, security, execution behavior.  
**Put in steps only when downstream depends on it:** route paths, exported fetch function names, seed constant names (`USER_LOGINS`), write-vs-ship boundaries ("not applied until P4").

**Recipe smell**

- Verbatim code blocks in steps
- One conceptual change forces N step edits → lift to `CONVENTIONS.md`
- A step file that only adds a single type or re-states the migration column list
- Parallel steps that edit the same `output/` file (fix the phase layout instead)

**Verify**

- Write phases: lean checks (`build`, file exists, script parses)
- Ship phases: human-visible URLs + **USER PAUSE**
- Don't defer integration checks to "later" if the step claims the work is done

## Naming

Prefer **fetches** over **loaders** for server-side data-access functions (`fetchPeople`, `catalog-fetches.ts`). "Loader" suggests framework-specific APIs; these are plain async functions that fetch from Supabase.

## Core principles (unchanged)

- **Intent + why** over prescribed how.
- **Contracts in one place** — edit once in `CONVENTIONS.md`.
- **Succinct tone** — shortest text that still gates progress.

