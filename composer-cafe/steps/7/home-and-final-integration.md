# Home + final integration

Last checkpoint. Build the landing page that composes featured recipes + featured skills + community members, then walk through the whole site once more for sign-off.

## Do

1. **Featured loaders.** Extend the data layer with `fetchHomeFeaturedRecipes()` and `fetchHomeFeaturedSkills()` — each returns the first N rows ordered alphabetically by title (see `CONVENTIONS.md`: featured = alphabetical first N, no hardcoded slug lists, no `FEATURED_*` constants).

2. **Featured API routes.** `app/api/catalog/recipes/featured/route.ts` and `app/api/catalog/skills/featured/route.ts`, each returning the corresponding featured array.

3. **Landing components** (light polish):
   - `composing-heading.tsx` — multi-line hero `<h1>` like "Recipes for / building things / together", middle line in `text-accent`. Sans, large, tight tracking.
   - `section-heading.tsx` — reusable `<h2>` block with an optional "View all →" link on the right.
   - `landing-join-section.tsx` — closing pull-quote + a `<JoinPillCta>`.
   - `join-pill-cta.tsx` — rounded-full pill linking to `/join`, `bg-foreground text-background`.

4. **Home page.** Replace `output/app/page.tsx`:
   - `dynamic = "force-dynamic"`.
   - Parallel fetch: people, featured recipes, featured skills.
   - Sections in order, wrapped in `SITE_CONTENT_SHELL_CLASS` with generous vertical spacing: hero, Featured Recipes (heading + grid + "View all" → `/recipes/all`), Featured Skills (same shape → `/skills/all`), Community (first 6 people → `/profiles/all`), join section.

## Verify — USER PAUSE

Restart `npm run dev` if it isn't running, then surface the running site:

> Composer Cafe is complete. Final walkthrough:
>
> - `http://localhost:3000/` — landing page with hero, featured recipes, featured skills, community grid, join CTA.
> - `/recipes/all` and `/skills/all` — click into one, confirm the live file browser works and "Use in Cursor" opens the install modal.
> - `/profiles/all` → pick one → confirm Recipes + Skills sections and the install-count badge.
> - `/join` and a 404 (`/nope`) — chrome consistent.
>
> Sign off when ready.

**Wait for explicit user approval.** Once given, the recipe is complete.

## Done

Surface a short summary: routes built, counts seeded (real numbers, not "around N"), where the project lives (`output/`), and how to redeploy (push to Vercel pointing at `output/`, set `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in Vercel, schema already applied to the linked Supabase).
