# Recipes — apply, seed, verify

Turn on the Recipes vertical.

## Do

From `output/`:

1. Confirm `.env.local` still has real Supabase values.
2. `supabase db push` — recipes migration applies.
3. `npm run supabase:seed` — expect `seeded users` and `seeded recipes` counts (recipes from SwanHub/agent-recipes on GitHub).
4. Spot-check row counts in Supabase.
5. Restart `npm run dev` if needed.

## Verify — USER PAUSE

> Recipes are live. Confirm:
>
> - `/recipes/all` — grid with at least `recipe-cookbook` when the repo is seeded.
> - `/recipes/<slug>` — file tree, thumbnail or placeholder, demo link if frontmatter has `demo url`, install modal.
> - `/profile/swanhub` — recipes section + install badge.
>
> Approve before Phase 7.

**Wait for explicit approval before moving to Phase 7.**
