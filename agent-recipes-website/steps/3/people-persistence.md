# People persistence

Schema + seed script for the `users` table. Not applied or run here — P4 ships it.

## Do

**Migration** — `output/supabase/migrations/<YYYYMMDDHHMMSS>_create_users.sql`: identity, unique `slug` (authoritative URL handle per `CONVENTIONS.md`), display fields, optional bio/links, `joined_at`, timestamps, sensible indexes.

**Seed script** — `output/scripts/supabase/seed-catalog.ts`:

- Env + service-role client + GitHub token — hard-fail if missing.
- `USERNAMES` — start with `SwanHub` (see `CONVENTIONS.md`); fetch GitHub profile, map into `users` (`slug` = username).
- Truncate `users`, insert, print `seeded users: <n>`.

P5 extends this script for recipes (discovered from [github.com/SwanHub/agent-recipes/tree/main](https://github.com/SwanHub/agent-recipes/tree/main)).

## Verify

- Migration file exists with a 14-digit UTC timestamp prefix.
- Seed script parses; `npm run supabase:seed` wired in `package.json` (from P1).
