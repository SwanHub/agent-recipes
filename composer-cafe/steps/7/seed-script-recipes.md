# Seed script — recipes

Extend the seed script for recipes.

## Do

- Add `RECIPE_URLS: { url, submitterLogin }[]` (may be empty).
- Parse URLs, read `RECIPE.md` / `README.md` frontmatter for title + prompt preview.
- Truncate `recipes` → `skills` → `users`, full re-seed all three. Print users, skills, and recipes counts.

## Verify

- Script parses; exercised at P8 against real Supabase.
