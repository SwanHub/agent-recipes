# Recipes routes

App pages and API handlers.

## Do

- `/recipes/all` (empty state OK), `/recipes/[slug]` — compose file-tree UI from the recipes-ui step
- On `/profile/[slug]`: `ProfileRecipesSection` + recipe install badge
- `GET /api/catalog/recipes`, `GET /api/catalog/recipes/[slug]` — omit if pages pass props only
- `POST /api/recipes/[slug]/install`

## Verify

- `cd output && npm run build` passes.
