# People — ship

Turn on the People vertical.

## Do

From `output/`:

1. Confirm `.env.local` has real Supabase values (pause for user if missing).
2. `supabase db push` — users migration applies.
3. `npm run supabase:seed` — expect `seeded users: <n>` matching `USER_LOGINS` length.
4. `npm run dev`.

## Verify — USER PAUSE

> People is live. Check `/profiles/all` (search + grid) and `/profile/<slug>` (avatar, bio, links). Skills/recipes sections come later — ignore for now. Layout and typography OK?

**Wait for explicit approval before Phase 5.** Fix issues in place and re-confirm if needed.