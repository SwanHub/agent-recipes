# Seed script — users only (v1)

Hydrate the `users` table from a small hardcoded list of real GitHub logins. P5 extends this same script to also seed skills and recipes.

## Do

Write `output/scripts/supabase/seed-catalog.ts`:

- Load env vars with `@next/env` (`loadEnvConfig(process.cwd())`).
- Build a service-role Supabase client. Hard-fail if env vars are missing.
- Acquire a GitHub API token: prefer `process.env.GITHUB_TOKEN`; fall back to shelling out `gh auth token`. Hard-fail if neither works.
- Keep a constant `USER_LOGINS: readonly string[]` near the top of the file — the list of GitHub logins this catalog features. Curate ~6–10 real authors whose skills will land in P5. Adding more users later is "drop a string in this array, re-run seed."
- For each login, fetch the profile from `https://api.github.com/users/<login>` (with the token). Map the GitHub fields onto the users table:
  - `slug` = the login (lowercased) — this is the authoritative URL handle.
  - `display_name` = `name ?? login`.
  - `avatar_src` = `avatar_url`.
  - `about` = `bio` (nullable).
  - `joined_at` = `created_at` (ISO date prefix is fine).
  - `github_url` = `html_url`.
  - `linkedin_url` = null (GitHub doesn't surface it).
  - `website_url` = `blog` if non-empty, else null.
- Truncate `users` and insert the fetched rows.
- Print a one-line summary: `seeded users: <n>`.

**Do not run the script** here — applying happens in P4.

## Verify

- File parses (it'll be exercised in P4).
- `package.json` has the `supabase:seed` script wired to `tsx scripts/supabase/seed-catalog.ts` (from P1).
