# Users migration

Schema for community identities — the rows behind `/profile/[slug]`. Seed data comes from real GitHub profiles, so the schema must accommodate fields GitHub doesn't always surface.

## Do

Write `output/supabase/migrations/<YYYYMMDDHHMMSS>_create_users.sql` (use a fresh UTC timestamp for the prefix). The table needs:

- `id` — bigint identity, primary key.
- `slug` — text, not null, **unique** — the authoritative URL handle. Typically the GitHub login. See `CONVENTIONS.md`: UI links read this column directly.
- `display_name` — text, not null.
- `avatar_src` — text, not null.
- `github_url` — text, not null.
- `about`, `linkedin_url`, `website_url` — text, **nullable** (real GitHub profiles often omit these).
- `joined_at` — text (ISO date).
- `created_at` — timestamptz, default `now()`.

Include a useful index for the access patterns (e.g. on `created_at` or `display_name` for catalog ordering).

The migration is **not applied** in this phase — applying happens in P4.

## Verify

- File exists at the right path with a 14-digit UTC timestamp prefix.
- SQL parses (paste into a local check or trust standard Postgres).
