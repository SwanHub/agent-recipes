# Recipes persistence

Migration + seed extension. Not applied or run here — P8 ships.

## Do

**Migration** — `output/supabase/migrations/<fresh-utc-ts>_create_recipes.sql` (after skills migration).

**Seed** — extend `seed-catalog.ts`:

- `RECIPE_URLS: { url, submitterLogin }[]` (may be empty)
- Full re-seed: truncate `recipes` → `skills` → `users`, print all three counts

## Verify

- Migration file exists.
- Seed script parses.
