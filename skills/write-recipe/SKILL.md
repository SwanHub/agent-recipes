---
name: write-recipe
description: Use this skill to take an existing project, observe how it was built, and compile that into an executable recipe an AI can re-run from a clean slate. A recipe specifies intent and contracts, not exact implementation — steps stay high-level so a future agent can interpret them differently on each run.
---

# write-recipe

A recipe is a build plan an AI executes end-to-end. A good recipe leaves room for the agent to make local decisions; a bad recipe is a step-by-step coding tutorial that breaks when the underlying tools shift.

## Purpose

The job: take an existing project, study how it was built, and write the executable recipe an AI would follow to recreate it from nothing.

Output is a directory with `RECIPE.md`, `CONVENTIONS.md`, and a `steps/` tree of phased build instructions. The recipe should produce something recognizably the same project on each run, even if implementation choices differ.

**Do not rely on a separate `README.md` for the agent.** That duplicates the entrypoint and costs tokens. Humans browsing GitHub may still appreciate a one-line stub README linking to `RECIPE.md`; keep it optional and non-canonical.

## Documentation layout (token-efficient)

Split concerns so the agent reads each class of information **once**, in a predictable order.

| File | Purpose |
|------|---------|
| **`RECIPE.md`** | **What** you are building: short pitch, architecture summary, phase table (which `steps/<n>/` folders, what they deliver, gates like USER PAUSE), success criteria, and a **How to run** block: the exact instruction string to paste for an agent, plus any “nothing to install until step N” note. Optional YAML frontmatter (`name`, `description`) for catalogs/tooling. |
| **`CONVENTIONS.md`** | **How** to run the recipe successfully **and** shared build contracts: **Execution contract** first (explicit phase/step announcements, never advance while any Verify in scope is open, prefer running commands in-agent over sending the user to a terminal unless unavoidable), then recipe layout (cwd, `output/` vs recipe root, strict phase order, parallel step files, one-owner-per-`output/` path per phase, USER PAUSE behavior, optional `.recipe-state.json`), then product rules the whole tree must honor (data authority, design tokens, API shapes, security posture for the recipe as an artifact — pinned deps, no `curl \| sh`, inert assets, etc.). |
| **`steps/<n>/*.md`** | Per-task **Do** + **Verify**; link or restate nothing that already lives in `CONVENTIONS.md` unless a step truly needs a one-line reminder. |

When drafting: if text is “how would I behave as the runner,” it belongs in **`CONVENTIONS.md`**. If text is “what is this product and in what order do we ship slices,” it belongs in **`RECIPE.md`**.

## Core principles

**Steps describe intent + a contract reference, not the implementation.**
"Link to the user's profile page" — good. "Call `profileSlugForName(person.name)` and pass the result as the href" — bad. The first survives refactors; the second forces edits in N step files the moment anything underneath changes.

**Contracts live in one place.**
Execution contract, recipe layout (phases, parallelism, `output/`), type shapes, schemas, naming conventions, file-layout rules — put them in a single `CONVENTIONS.md` next to `RECIPE.md`. Every parallel subagent reads it before starting. When something changes, you edit once.

**The smell: a conceptual change requires N step edits.**
If updating one architectural decision means touching five step files, the recipe over-specified. Lift the duplicated bits into the conventions file and reference them.

**Intent + why outranks prescribed how.**
A step should tell the agent **what** it's building and **why** that matters. The **how** comes from the agent reading the surrounding code, the conventions, and applying judgment. That's the whole point of handing the work to an AI.
