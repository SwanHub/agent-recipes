# Skills migration

Schema for skills. New migration file only.

## Do

Write `output/supabase/migrations/<fresh-utc-ts>_create_skills.sql`. Table: slug (unique URL handle), title, summary, install_count (default 0), author FK → users, GitHub source pointer columns, timestamps. Index `author_id` for profile queries.

Not applied here — ship phase applies it.

## Verify

- Migration file exists with a 14-digit UTC timestamp prefix (after the users migration from P4).
