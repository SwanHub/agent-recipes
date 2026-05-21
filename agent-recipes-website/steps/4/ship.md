# Ship — People + Recipes

Both packs returned from step 3. Wire the seed orchestrator, apply both migrations, seed users + recipes, boot dev. **One** review gate.

## Do

From `output/`:

1. Confirm `.env.local` has real Supabase values (pause for user if missing).
2. **Write `scripts/supabase/seed.ts`** — orchestrator:
   - Load env (`@next/env`) + build service-role client + read `GITHUB_TOKEN`. Hard-fail on any missing var.
   - `import { seedPeople } from '@/features/people/seed'`
   - `import { seedRecipes } from '@/features/recipes/seed'`
   - Order: `seedPeople` (FK target) → `seedRecipes`.
   - Print `seeded users: <n>` and `seeded recipes: <n>`.
3. `supabase db push` — both migrations apply (users first by timestamp, then recipes).
4. `npm run supabase:seed` — expect both counts.
5. Spot-check counts in Supabase.
6. `npm run dev`.

## STOP — REVIEW WITH USER

Send this message, then **stop**. Zero tools — no `Read`, `Bash`, subagents, or opening `steps/5/` — until they reply.

> People + Recipes are live. Confirm:
>
> - `/profiles/all` — search + grid.
> - `/profile/swanhub` — avatar, bio, links, recipes section + install badge.
> - `/recipes/all` — grid with at least `swanhub-agent-recipes-website` when seeded; `Submit recipe` button visible above the grid.
> - `/recipes/<slug>` — file tree, thumbnail or placeholder, demo link if frontmatter has `demo url`, install modal.
> - `/recipes/submit` — submit a non-github URL → "Only github.com URLs are accepted"; submit a `github.com` repo URL with a valid `RECIPE.md` → redirected to its new `/recipes/<slug>` page and the row appears in `recipes`; resubmitting the same URL → "Already in the catalog."
>
> Approve before step 5 (email signup).

Wait for explicit approval. "Looks good" / "yes" / "approved" / "proceed" qualify; silence and vague replies don't. If they flag issues, fix in place and re-ask.
