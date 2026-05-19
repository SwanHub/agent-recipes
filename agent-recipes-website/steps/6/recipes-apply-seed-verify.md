# Recipes — apply, seed, verify

Turn on the Recipes vertical.

## Do

From `output/`:

1. Confirm `.env.local` still has real Supabase values.
2. `supabase db push` — recipes migration applies.
3. `npm run supabase:seed` — expect `seeded users` and `seeded recipes` counts (recipes from SwanHub/agent-recipes on GitHub).
4. Spot-check row counts in Supabase.
5. Restart `npm run dev` if needed.

## STOP — REVIEW WITH USER

Send this message to the user, then **stop**. Call **zero tools** — no `Read`, no `Bash`, no subagents, no opening of `steps/7/` — until they reply.

> Recipes are live. Confirm:
>
> - `/recipes/all` — grid with at least `agent-recipes-website` when the repo is seeded.
> - `/recipes/<slug>` — file tree, thumbnail or placeholder, demo link if frontmatter has `demo url`, install modal.
> - `/profile/swanhub` — recipes section + install badge.
>
> Approve before Phase 7.

Wait for explicit approval before Phase 7. "Looks good" / "yes" / "approved" / "proceed" all qualify; silence and vague replies do not. If they flag issues, fix in place and re-ask.
