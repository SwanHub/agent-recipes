# Recipes routes

App pages and API handlers.

## Do

- `/recipes/all` (empty state OK), `/recipes/[slug]` — compose P5 file-tree UI components
- On `/profile/[slug]`: `ProfileRecipesSection` + combined install badge (recipes + skills)
- `GET /api/catalog/recipes`, `GET /api/catalog/recipes/[slug]` — omit if pages pass props only
- `POST /api/recipes/[slug]/install`

## Verify

- `cd output && npm run build` passes.
