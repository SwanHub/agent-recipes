# Pack — People

The People vertical end-to-end: types, fetches, migration, seed module, API, pages, UI. **One subagent, full context** — do not sub-split into parallel sub-tasks.

> **Subagent task** — one of two parallel packs (with `pack-recipes`). Dispatched by the orchestrator in a single message. Do not read `pack-recipes.md`.

## Pack-owned paths (you write these)

- `app/(people)/profiles/all/page.tsx`, `app/(people)/profile/[slug]/page.tsx`
- `app/api/people/...` (omit if pages pass props only)
- `components/people/*` — `preview-avatar.tsx`, `user-profile-preview.tsx`, `all-people-list.tsx`
- `features/people/types.ts`, `features/people/server.ts`, `features/people/seed.ts`
- `supabase/migrations/<14-digit UTC ts>_create_users.sql`

## Read-only (frozen in step 2)

`lib/supabase/db.ts`, `lib/constants.ts`, `lib/format-*.ts`, `app/layout.tsx`, `app/globals.css`, `components/chrome/*`. Never write.

## Cross-pack import

On `app/(people)/profile/[slug]/page.tsx`, render `<ProfileRecipesSection person={…} />` and `import { ProfileRecipesSection } from '@/components/recipes/profile-recipes-section'`. **That file is written by `pack-recipes` in parallel; you do not write it.** The import resolves at fan-in build.

## Do

**Types — `features/people/types.ts`** — `Person`: slug, display fields, optional bio/links, `joinedAt`, `recipeCount`.

**Fetches — `features/people/server.ts`** — `fetchPeople()`, `fetchPersonBySlug(slug)`. Use the `db` client from step 2; do not catch missing-env errors.

**Migration** — `supabase/migrations/<14-digit UTC ts>_create_users.sql`: identity, unique `slug` (GitHub username — authoritative URL handle), display fields, optional bio/links, `joined_at`, timestamps, sensible indexes. **Enable RLS** at the end. No policies — every read/write is server-side service-role.

**Seed module — `features/people/seed.ts`** — exports `seedPeople(supabase, githubToken): Promise<number>`:

- `USERNAMES = ['SwanHub', ...]` — start with **`SwanHub`** ([github.com/SwanHub](https://github.com/SwanHub)).
- Fetch each user's GitHub profile, map to a `users` row (`slug` = username).
- Truncate `users`, insert, return count.

The orchestrator `scripts/supabase/seed.ts` is written in step 4 and calls this module.

**Routes**

- `app/(people)/profiles/all/page.tsx` — search + grid.
- `app/(people)/profile/[slug]/page.tsx` — avatar, bio, links, plus the cross-pack `<ProfileRecipesSection />` + install-badge slot.

**UI — `components/people/*`**

- `preview-avatar.tsx` — circular, initials fallback.
- `user-profile-preview.tsx` — card → `/profile/${slug}`, contribution summary.
- `all-people-list.tsx` — client search over name + bio, responsive grid.

## Verify (subagent)

- Return when all pack-owned files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
