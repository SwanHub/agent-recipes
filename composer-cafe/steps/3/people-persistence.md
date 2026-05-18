# People persistence

Schema + seed script for the `users` table. Not applied or run here — P4 ships it.

## Do

**Migration** — `output/supabase/migrations/<YYYYMMDDHHMMSS>_create_users.sql`: identity, unique `slug` (authoritative URL handle per `CONVENTIONS.md`), display fields, optional bio/links, `joined_at`, timestamps, sensible indexes.

**Seed script** — `output/scripts/supabase/seed-catalog.ts`:

- Env + service-role client + GitHub token — hard-fail if missing.
- `USERNAMES` — curated GitHub usernames (~6–10).
- Fetch GitHub profiles, map into `users` (`slug` = username), truncate `users`, insert, print `seeded users: <n>`.

P5/P7 extend this script for skills and recipes.

## Verify

- Migration file exists with a 14-digit UTC timestamp prefix.
- Seed script parses; `npm run supabase:seed` wired in `package.json` (from P1).
