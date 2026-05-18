# Recipes — apply, seed, verify

Turn on the Recipes vertical.

## Do

From `output/`:

1. Confirm `.env.local` still has real Supabase values.
2. `supabase db push` — recipes migration applies.
3. `npm run supabase:seed` — all three summary lines; counts match script array lengths.
4. Spot-check row counts in Supabase.
5. Restart `npm run dev` if needed.

## Verify — USER PAUSE

> Recipes are live. Confirm:
>
> - `/recipes/all` — grid or empty state.
> - `/recipes/<slug>` — if seeded: file tree + install modal.
> - `/profile/<slug>` — recipes and skills sections + combined install badge.
> - `/skills/<slug>` — still works after re-seed.
>
> Approve before Phase 9.

**Wait for explicit approval before moving to Phase 9.**
