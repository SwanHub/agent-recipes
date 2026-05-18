# Recipes migration

Schema for recipes. New migration file only.

## Do

Write `output/supabase/migrations/<fresh-utc-ts>_create_recipes.sql` (timestamp **after** the skills migration from P5). Table: slug, title, prompt_preview, install_count (default 0), submitter FK → users, GitHub source columns, timestamps. Index `submitter_id`.

Not applied here — ship phase applies it.

## Verify

- Migration file exists with a 14-digit UTC prefix later than the skills migration.
