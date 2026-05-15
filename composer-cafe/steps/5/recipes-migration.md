# Recipes migration

Schema for recipes. New file only — no shared file edits.

## Do

Write `output/supabase/migrations/<fresh-utc-ts>_create_recipes.sql`. The table needs:

- `id` — bigint identity, primary key.
- `slug` — text, not null, **unique** — authoritative URL handle (see `CONVENTIONS.md`).
- `title`, `prompt_preview` — text, not null.
- `install_count` — integer, not null, **default 0**. Ships at zero; the install-tracking route bumps it (see `shared-pack-browser.md`).
- `submitter_name` — text, not null (the cached display name; saves a join on catalog cards).
- `submitter_id` — bigint, not null, FK → `public.users(id)` `on delete cascade`.
- `demo_url` — text, nullable.
- `source_owner`, `source_repo`, `source_path` — text, not null. The GitHub folder pointer; detail pages fetch this folder live at render time (see `CONVENTIONS.md`).
- `source_branch` — text, not null, default `'main'`.
- `created_at` — timestamptz, default `now()`.

Index `submitter_id` for the "recipes by this user" query on profile pages.

Migration is **not applied** here — applying happens in P6.

## Verify

- File exists at the right path with a 14-digit UTC timestamp prefix (later than the users migration).
