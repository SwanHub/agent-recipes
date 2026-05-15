# Data-layer extensions — Recipes + Skills

This step is the **sole owner** of edits to the three shared data-layer files in this phase:

- `output/lib/cafe-demo.ts`
- `output/lib/server/catalog-from-supabase.ts` (or whichever file holds the Supabase queries)
- `output/lib/server/catalog-loaders.ts` (or the loaders facade)

Other P5 steps may *create* new files but must not write to these. All Recipe + Skill type definitions, query functions, and loaders live in this one task to keep the writes race-free.

## Do

### Types

Extend `cafe-demo.ts` with the shared shapes:

- `RecipeDatum` — `{ slug, title, promptPreview, installCount, submitterName, source: GitHubSource, demoUrl? }`.
- `SkillDatum` — `{ slug, title, summary, installCount, authorName, source: GitHubSource, demoUrl? }`.
- `GitHubSource` — `{ owner, repo, branch, path }`. The pointer detail pages use to fetch the live folder. See `CONVENTIONS.md`.

`slug` is the authoritative DB column (see `CONVENTIONS.md`). `installCount` is a real number persisted in Postgres and bumped by the install route (see `shared-pack-browser.md` for the route shape).

Do **not** add featured arrays, recipe templates, skill templates, or any cross-product builders. The catalog is whatever the seed inserts.

### Queries

Add Supabase reads for recipes and skills following the same pattern as users (single-row by slug, full list ordered by title, per-author list joined via FK). When env vars are missing the underlying client throws; loaders do not catch.

Also add the install-count increment helpers — given an entity slug, atomically bump `install_count` and return the new value. These power the `/api/{kind}/[slug]/install` route in `shared-pack-browser.md`.

### Loaders

The page-facing API the rest of the app imports:

- `fetchCatalogRecipes()`, `fetchRecipeBySlugSegment(slug)`, `fetchRecipesForPersonName(name)`.
- `fetchCatalogSkills()`, `fetchSkillBySlugSegment(slug)`, `fetchSkillsForPersonName(name)`.

With no fallback wrapper. Each loader is a thin call to the Supabase query.

## Verify

- `cd output && npm run build` passes.
- Loader return types include the `source: GitHubSource` field — downstream detail pages need it to drive the live GitHub fetch.
