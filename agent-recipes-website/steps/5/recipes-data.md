# Recipes data

Types + server fetches.

## Do

- `GitHubSource` + `RecipeDatum` in `cookbook-demo.ts` — include optional `demoUrl` and `thumbnailUrl` when present in source metadata
- Recipe reads + install-count increment
- `fetchCatalogRecipes()`, `fetchRecipeBySlugSegment(slug)`, `fetchRecipesForPersonName(name)`

## Verify

- `cd output && npm run build` passes.
