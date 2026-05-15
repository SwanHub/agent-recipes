# People — apply migration, seed, verify

First real-world checkpoint. Apply the users migration, seed real GitHub profiles, then hand off to the user to confirm the People feature looks right.

## Do

All commands run from `output/`.

1. Sanity-check `.env.local` has real Supabase values (not placeholders). If missing, copy from `assets/.env.example` and pause to ask the user.
2. Push the schema: `supabase db push`. If it errors with "not linked", the user skipped `supabase link` in P1 — back up and resolve.
3. Seed: `npm run supabase:seed`. Expect the trailing summary line `seeded users: <n>` where `<n>` equals the size of `USER_LOGINS` in the script.
4. Spot-check the DB by hitting Supabase directly (the dashboard SQL editor, or a quick PostgREST count call with the service role key). Expect the same count.
5. Start the dev server: `npm run dev`.

## Verify — USER PAUSE

Surface the running site to the user:

> People feature is live. Open these in your browser and confirm they look right:
>
> - `http://localhost:3000/profiles/all` — a grid of real community members with a working search input.
> - `http://localhost:3000/profile/<one-of-the-slugs>` — a single profile with avatar, bio (when GitHub had one), joined date, and the GitHub link. Recipes/skills sections will be added in Phase 5; their absence here is expected.
>
> Does the layout, typography, and color feel right? Anything off?

**Wait for explicit user approval before moving to Phase 5.** If they call out an issue, fix it in place and re-confirm.
