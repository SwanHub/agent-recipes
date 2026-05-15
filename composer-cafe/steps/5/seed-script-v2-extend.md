# Seed script — extend to skills + recipes (v2)

Extend `output/scripts/supabase/seed-catalog.ts` (from P3) to also seed skills and recipes from curated GitHub folder URLs.

## Do

Near the top of the script, add two hardcoded constants alongside the existing `USER_LOGINS`:

- `SKILL_URLS: readonly { url: string; authorLogin: string }[]` — one entry per skill. `url` is a GitHub folder URL like `https://github.com/anthropics/skills/tree/main/skills/pdf`. `authorLogin` names the user from `USER_LOGINS` who authored it. Pairing author explicitly (instead of inferring from commit history) keeps the seed deterministic — bots, co-authors, and commit-graph weirdness don't matter.
- `RECIPE_URLS: readonly { url: string; submitterLogin: string }[]` — same shape, for recipes. May be empty; that's fine.

For each URL:

- Parse the owner / repo / branch / path from the URL pattern (`https://github.com/<owner>/<repo>/tree/<branch>/<path>`).
- Fetch the folder's `SKILL.md` (for skills) or `RECIPE.md` / `README.md` (for recipes) via GitHub Contents API + raw, pull `name` / `description` out of the YAML frontmatter for title + summary/promptPreview.
- Build the insert row: slug = the last path segment, plus the parsed source pointer (`source_owner`, `source_repo`, `source_branch`, `source_path`), the cached display name, `install_count: 0`, and the FK to the matching user.

Order of operations:

1. Truncate FK-safely: `recipes` → `skills` → `users`.
2. Insert users (v1 logic — fetch each `USER_LOGINS` profile from GitHub, insert).
3. Build a `slug → id` map from `select id, slug from users`.
4. Insert skills, mapping each `authorLogin` through the map for `author_id`. Skip any whose author isn't in `USER_LOGINS` (with a warning) — explicit pairing makes this rare.
5. Insert recipes the same way.

Print a multi-line summary at the end:
```
seeded users: <n>
seeded skills: <n>
seeded recipes: <n>
```

## Verify

- File parses (`cd output && npm run build` doesn't fail).
- The seed is exercised in P6 against the real Supabase project.
