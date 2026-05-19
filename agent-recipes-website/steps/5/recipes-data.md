# Recipes data

Types + server fetches.

## Do

- `GitHubSource` + `RecipeDatum` in `types.ts` — include optional `demoUrl` and `thumbnailUrl` when present in source metadata
- Recipe reads + install-count increment
- `fetchRecipes()`, `fetchRecipeBySlugSegment(slug)`, `fetchRecipesForPersonName(name)`

## Verify

- `cd output && npm run build` passes.
