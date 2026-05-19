# Recipes persistence

Migration + seed extension. Not applied or run here — P6 ships.

## Do

**Migration** — `output/supabase/migrations/<fresh-utc-ts>_create_recipes.sql` (after users migration): slug, title, summary, install_count, optional `demo_url`, optional `thumbnail_url`, author FK → users, GitHub source columns, timestamps. **Enable RLS** at the end of the migration. No policies needed — every read/write goes through the server's service-role client.

**Seed** — extend `seed.ts`:

- Discover recipe folders from [github.com/SwanHub/agent-recipes/tree/main](https://github.com/SwanHub/agent-recipes/tree/main) (top-level dirs with `RECIPE.md`). This is the source of truth for recipes.
- For each folder, read the `RECIPE.md` frontmatter contract:
  - **Required:** `name`, `description` (or equivalent summary fields).
  - **Optional:** `demo url` — HTTPS link to a deployed build; persist as `demo_url` for cards/detail to surface.
  - **Thumbnail:** if `assets/recipe-thumbnail.png` exists in the recipe repo, persist its GitHub raw URL as `thumbnail_url`; otherwise leave null and let UI fall back to a neutral placeholder.
- `submitterUsername` defaults to `SwanHub` unless frontmatter specifies another author.
- Full re-seed: truncate `recipes` → `users`, re-seed users then recipes, print both counts.

## Verify

- Migration file exists.
- Seed script parses.
