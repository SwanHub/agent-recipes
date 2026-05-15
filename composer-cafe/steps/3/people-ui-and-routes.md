# People feature — components, pages, API

The user-visible half of the People feature: avatar primitive, preview card, searchable catalog grid, two pages, two API routes.

## Do

1. **`output/components/preview-avatar.tsx`** — given an optional `src`, an `alt`, and a size variant (`xs` ≈ 24px, `sm` ≈ 36px, `lg` ≈ 88px), renders a circular avatar on `bg-avatar-off-bg`. Falls back to centered initials in muted mono when `src` is missing or broken.

2. **`output/components/user-profile-preview.tsx`** — server component. Given a `Person`, renders a small clickable card linking to `/profile/${person.slug}` (read the slug from the Person directly; see `CONVENTIONS.md`). Shows the small avatar, the display name, and a single mono line summarizing the person's contribution counts ("3 skills · 1 recipe").

3. **`output/components/all-people-catalog.tsx`** — `"use client"`. Receives the full people array, renders a search input that filters by name + about (case-insensitive substring), and shows a responsive grid of `<UserProfilePreview>` cards. Empty state copy reads "No one matches that search."

4. **`output/app/profiles/all/page.tsx`** — server component, `dynamic = "force-dynamic"`. Loads people via `fetchPeople()`, renders an "Community" heading + one-line subtitle, then the catalog component inside `SITE_CONTENT_SHELL_CLASS`.

5. **`output/app/profile/[slug]/page.tsx`** — server component, `dynamic = "force-dynamic"`. The dynamic segment is the user's authoritative slug. Awaits `params`, calls `fetchPersonByProfileSegment(slug)`, renders `notFound()` if null. Otherwise shows: large avatar, display name as `<h1>`, "Joined &lt;Mon YYYY&gt;" formatted from `joinedAt`, the bio paragraph (skip the element if `about` is null), and a row of external links (GitHub always present; LinkedIn and website only if non-null). Leave a single comment placeholder for the recipes + skills sections P5 will inject.

6. **`output/app/api/catalog/people/route.ts`** — `dynamic = "force-dynamic"`. GET returns `await fetchPeople()` as JSON.

7. **`output/app/api/catalog/people/[segment]/route.ts`** — GET takes the slug from the dynamic segment, returns the person or `{ error: "not found" }` with status 404.

## Verify

- `cd output && npm run build` passes. Routes type-check.
- Visual confirmation happens at the P4 USER PAUSE once the seed runs.
