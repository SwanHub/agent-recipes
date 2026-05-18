# Seed script — skills

Extend `output/scripts/supabase/seed-catalog.ts` to seed skills from curated GitHub folder URLs.

## Do

- Add `SKILL_URLS: { url, authorLogin }[]` — folder URL + author from `USER_LOGINS`.
- Parse GitHub URLs → source pointer + slug; read `SKILL.md` frontmatter for title/summary.
- Truncate `skills` → `users`, re-insert users (v1 logic), insert skills with FK map. Print `seeded users: n` and `seeded skills: n`.

`RECIPE_URLS` comes in P7.

## Verify

- Script parses; exercised at P6 against real Supabase.
