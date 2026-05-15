# Recipes — components, pages, API routes

User-visible Recipes feature.

## Do

1. **`output/components/recipe-preview.tsx`** — server component. Given a `RecipeDatum`, renders a small card linking to `/recipes/${recipe.slug}` (read the slug from the row; never derive). Title, truncated prompt preview, bottom row with the small avatar + submitter name + `formatDownloads(installCount)` next to a sparkle/install glyph.

2. **`output/components/all-recipes-catalog.tsx`** — `"use client"`. Search input filters case-insensitive over title + prompt preview. Grid of `<RecipePreview>` cards.

3. **`output/components/profile-recipes-section.tsx`** — server component. Awaits `fetchRecipesForPersonName(name)`, renders an "Recipes" section heading + a list of `<RecipePreview>`. Empty state: "No recipes yet."

4. **`output/app/recipes/all/page.tsx`** — `dynamic = "force-dynamic"`. Calls `fetchCatalogRecipes()`, renders heading + one-line subtitle + the catalog component inside `SITE_CONTENT_SHELL_CLASS`. Render an empty-state line when there are no recipes (the seed may not include any until a recipes repo is wired up).

5. **`output/app/recipes/[recipeName]/page.tsx`** — `dynamic = "force-dynamic"`. Awaits `params`, calls `fetchRecipeBySlugSegment`, `notFound()` on miss. Render: title, prompt preview, submitter card linking to `/profile/${submitter.slug}` (look the submitter up via `fetchPersonByDisplayName` or similar; use the returned `slug`). Then the action row (`<SkillDetailHeaderActions kind="recipe" …>` per `shared-pack-browser.md`). Then the live pack tree fetched at render time from `recipe.source` and passed into `<SkillPackBrowser>`.

6. **API routes** (`dynamic = "force-dynamic"`):
   - `app/api/catalog/recipes/route.ts` — GET returns `await fetchCatalogRecipes()`.
   - `app/api/catalog/recipes/[slug]/route.ts` — GET returns single recipe or 404.

## Verify

- `cd output && npm run build` passes. Visual check is the P6 USER PAUSE.
