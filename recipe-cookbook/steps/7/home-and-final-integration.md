# Home + final integration

Landing page composes live people and recipes. Lead with what recipes make possible — end-state screenshots, not abstract copy.

## Do

- Featured fetches + API routes: first N recipes by title (see `CONVENTIONS.md` — no hardcoded slug lists).
- Landing components: hero heading focused on running recipes in Cursor, section headings, join CTA pill.
- Replace `output/app/page.tsx` — parallel fetch, sections:
  1. **Hero** — Recipe Cookbook pitch: discover recipes, see what they build, run them in Cursor.
  2. **Featured recipes** — cards use each recipe’s `thumbnailUrl` (from `assets/recipe-thumbnail.png` on GitHub). When `demoUrl` is set, link “View demo” prominently so visitors see deployed outcomes.
  3. **Community** — first 6 people.
  4. **Join** CTA.
- No skills section or nav remnants.

## Verify — USER PAUSE

> Final walkthrough: `/` (hero + recipe thumbnails/demos), `/recipes/all`, `/recipes/recipe-cookbook` (or another seeded slug), `/profiles/all` → `/profile/swanhub`, `/join`, a 404. Sign off when ready.

**Wait for explicit approval.** Recipe complete.

## Done

Summarize routes, seeded counts, `output/` location, Vercel deploy notes (env vars, schema already applied).
