# Recipes data layer

Extend the catalog files from P5 — add `RecipeDatum` and recipe fetches only.

## Do

- Add `RecipeDatum` (slug, title, promptPreview, installCount, submitterName, source, optional demoUrl).
- Supabase reads: list recipes, recipe by slug, recipes for a person. Recipe install-count increment.
- Fetches: `fetchCatalogRecipes()`, `fetchRecipeBySlugSegment(slug)`, `fetchRecipesForPersonName(name)`.

## Verify

- `cd output && npm run build` passes.
