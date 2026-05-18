# Skills persistence

Migration + seed extension for skills. Not applied or run here — P6 ships.

## Do

**Migration** — `output/supabase/migrations/<fresh-utc-ts>_create_skills.sql`: slug, title, summary, install_count, author FK → users, GitHub source columns, timestamps.

**Seed** — extend `seed-catalog.ts`:

- `SKILL_URLS: { url, authorUsername }[]`
- Parse folder URLs, read `SKILL.md` frontmatter, insert skills (truncate `skills` → `users`, re-seed users + skills).
- Print `seeded users: n` and `seeded skills: n`. `RECIPE_URLS` comes in P7.

## Verify

- Migration file exists (timestamp after users migration).
- Seed script parses.
