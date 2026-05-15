# Recipes + Skills — apply migrations, seed, verify

Second checkpoint. The two new migrations land, the seed re-runs (hydrating all three tables from the curated GitHub lists), and the user confirms recipes + skills + the enriched profile page look right.

## Do

All commands run from `output/`.

1. Sanity-check `.env.local` still has real Supabase values.
2. Push schema: `supabase db push`. Both new migrations should apply; the users migration from P4 is a no-op.
3. Re-seed: `npm run supabase:seed`. Expect the trailing summary lines showing real counts driven by the size of `USER_LOGINS`, `SKILL_URLS`, and `RECIPE_URLS` in the script. Counts are exactly those array lengths (minus any author-pairing skips); they are not "around 60–80".
4. Spot-check the row counts in Supabase (dashboard SQL editor or a PostgREST count call). They should match the script's summary exactly.
5. Restart `npm run dev` if it was running.

## Verify — USER PAUSE

Surface the running site:

> Recipes and Skills are live. Each detail page renders the actual GitHub folder contents — click around the file tree to confirm. Open these and confirm:
>
> - `http://localhost:3000/skills/all` — grid of the seeded skills, search filters them.
> - `http://localhost:3000/skills/<one-of-the-slugs>` — title, summary, author, "Use in Cursor" pill + "View on GitHub", and a file tree showing the real `SKILL.md` + any reference files. Click "Use in Cursor" to confirm the modal copy-snippet flow.
> - `http://localhost:3000/recipes/all` — empty state is fine if `RECIPE_URLS` is empty; otherwise the recipes grid.
> - `http://localhost:3000/profile/<one-of-the-slugs>` — now shows Skills (and Recipes, if any) sections below the bio, plus the install-count badge.
>
> Anything broken or off-aesthetic? File tree interaction, modal, pill buttons, the orange accents — all behaving?

**Wait for explicit user approval before moving to Phase 7.**
