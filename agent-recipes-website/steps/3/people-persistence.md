# People persistence

Schema + seed script for the `users` table. Not applied or run here — step 4 ships it.

## Do

**Migration** — `output/supabase/migrations/<YYYYMMDDHHMMSS>_create_users.sql`: identity, unique `slug` (the user's GitHub username — authoritative URL handle), display fields, optional bio/links, `joined_at`, timestamps, sensible indexes. **Enable RLS** at the end of the migration. No policies needed — every read/write goes through the server's service-role client.

**Seed script** — `output/scripts/supabase/seed.ts`:

- Env + service-role client + GitHub token — hard-fail if missing.
- `USERNAMES` — start with **`SwanHub`** ([github.com/SwanHub](https://github.com/SwanHub)), the first seeded user; fetch GitHub profile, map into `users` (`slug` = username).
- Truncate `users`, insert, print `seeded users: <n>`.

Step 5 extends this script for recipes (discovered from [github.com/SwanHub/agent-recipes/tree/main](https://github.com/SwanHub/agent-recipes/tree/main)).

## Verify

- Migration file exists with a 14-digit UTC timestamp prefix.
- Seed script parses; `npm run supabase:seed` wired in `package.json` (from step 1).
