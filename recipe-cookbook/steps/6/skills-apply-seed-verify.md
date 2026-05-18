# Skills — apply, seed, verify

Turn on the Skills vertical.

## Do

From `output/`:

1. Confirm `.env.local` has real Supabase values.
2. `supabase db push` — skills migration applies (users migration is a no-op).
3. `npm run supabase:seed` — expect `seeded users` and `seeded skills` counts matching the script arrays.
4. Spot-check row counts in Supabase.
5. `npm run dev`.

## Verify — USER PAUSE

> Skills are live. Confirm:
>
> - `/skills/all` — seeded grid, search works.
> - `/skills/<slug>` — summary, author, live file tree, "Use in Cursor" modal.
> - `/profile/<slug>` — skills section (recipes section comes in P8).
>
> Approve before Phase 7.

**Wait for explicit approval before moving to Phase 7.**
