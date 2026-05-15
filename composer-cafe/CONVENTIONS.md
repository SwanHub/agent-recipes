# CONVENTIONS

Shared rules and contracts every step honors. Read this first before executing any phase.

## Working directory

The project lives in `output/`. All CLI commands (`npm`, `supabase`, `tsx`) run from there. When invoking from outside, prefix with `cd output && …`.

## Data authority

- Each entity (`users`, `recipes`, `skills`) has a `slug text not null unique` column. **The DB slug is authoritative.** UI links read `entity.slug` directly; never derive a URL slug from `name` / `title`.
- `Person`'s `skillCount` / `recipeCount` are computed at query time. Do not return placeholder zeros.
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
