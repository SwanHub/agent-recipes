# People — ship

Turn on the People vertical.

## Do

From `output/`:

1. Confirm `.env.local` has real Supabase values (pause for user if missing).
2. `supabase db push` — users migration applies.
3. `npm run supabase:seed` — expect `seeded users: <n>` matching `USERNAMES` length (includes SwanHub).
4. `npm run dev`.

## STOP — REVIEW WITH USER

Send this message to the user, then **stop**. Call **zero tools** — no `Read`, no `Bash`, no subagents, no opening of `steps/5/` — until they reply.

> People is live. Check `/profiles/all` (search + grid) and `/profile/swanhub` (avatar, bio, links). Recipes section comes in step 6 — ignore for now. Layout and typography OK?

Wait for explicit approval before step 5. "Looks good" / "yes" / "approved" / "proceed" all qualify; silence and vague replies do not. If they flag issues, fix in place and re-ask.
