# Recipes data

Extend catalog files from P5 — `RecipeDatum` and recipe fetches only.

## Do

- `RecipeDatum` in `cafe-demo.ts`
- Recipe reads + install-count increment
- `fetchCatalogRecipes()`, `fetchRecipeBySlugSegment(slug)`, `fetchRecipesForPersonName(name)`

## Verify

- `cd output && npm run build` passes.
