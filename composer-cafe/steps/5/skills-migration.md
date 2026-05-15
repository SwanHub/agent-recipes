# Skills migration

Schema for skills. New file only — no shared file edits.

## Do

Write `output/supabase/migrations/<fresh-utc-ts>_create_skills.sql` (timestamp later than the recipes migration in this same phase). The table needs:

- `id` — bigint identity, primary key.
- `slug` — text, not null, **unique** — authoritative URL handle (see `CONVENTIONS.md`). Typically the skill folder name.
- `title`, `summary` — text, not null.
- `install_count` — integer, not null, **default 0**. Ships at zero; the install-tracking route bumps it.
- `author_name` — text, not null (cached display name).
- `author_id` — bigint, not null, FK → `public.users(id)` `on delete cascade`.
- `demo_url` — text, nullable.
- `source_owner`, `source_repo`, `source_path` — text, not null. The GitHub folder pointer for live pack fetching.
- `source_branch` — text, not null, default `'main'`.
- `created_at` — timestamptz, default `now()`.

Index `author_id` for the "skills by this user" query on profile pages.

Migration is **not applied** here — applying happens in P6.

## Verify

- File exists with a 14-digit UTC timestamp prefix (later than the recipes migration).
