# Recipes persistence

Migration + seed extension. Not applied or run here — P6 ships.

## Do

**Migration** — `output/supabase/migrations/<fresh-utc-ts>_create_recipes.sql` (after users migration): slug, title, summary, install_count, optional `demo_url`, optional `thumbnail_url`, author FK → users, GitHub source columns, timestamps.

**Seed** — extend `seed-catalog.ts`:

- Discover recipe folders from [github.com/SwanHub/agent-recipes/tree/main](https://github.com/SwanHub/agent-recipes/tree/main) (top-level dirs with `RECIPE.md`).
- For each folder: parse `RECIPE.md` frontmatter (`name`, `description`, optional `demo url`); resolve `assets/recipe-thumbnail.png` to a raw GitHub URL when the file exists.
- `submitterUsername` defaults to `SwanHub` unless frontmatter specifies another author.
- Full re-seed: truncate `recipes` → `users`, re-seed users then recipes, print both counts.

## Verify

- Migration file exists.
- Seed script parses.
