# Skills — components, pages, API routes

## Do

1. **`output/components/skill-preview.tsx`** — same shape as `RecipePreview` from the sibling step but for `SkillDatum`. Links to `/skills/${skill.slug}`. Title, truncated summary, bottom row: avatar (xs) + author name + `formatDownloads(installCount)` next to the same sparkle/install glyph.

2. **`output/components/all-skills-catalog.tsx`** — `"use client"`. Search filters title + summary. Grid of `<SkillPreview>`.

3. **`output/components/profile-skills-section.tsx`** — server component. Awaits `fetchSkillsForPersonName`, renders a "Skills" section heading + list of `<SkillPreview>`. Empty state: "No skills yet."

4. **`output/app/skills/all/page.tsx`** — `dynamic = "force-dynamic"`. Calls `fetchCatalogSkills()`, renders heading + subtitle + the catalog component inside `SITE_CONTENT_SHELL_CLASS`.

5. **`output/app/skills/[skillName]/page.tsx`** — `dynamic = "force-dynamic"`. Awaits `params`, calls `fetchSkillBySlugSegment`, `notFound()` on miss. Renders: title, summary, author card linking to `/profile/${author.slug}` (resolve via `fetchPersonByDisplayName` or similar). Then `<SkillDetailHeaderActions kind="skill" …>` per `shared-pack-browser.md`. Then the live pack tree fetched at render time from `skill.source` and passed into `<SkillPackBrowser>`.

6. **API routes** (`dynamic = "force-dynamic"`):
   - `app/api/catalog/skills/route.ts` — GET all skills.
   - `app/api/catalog/skills/[slug]/route.ts` — GET single skill or 404.

## Verify

- `cd output && npm run build` passes.
