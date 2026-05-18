# Recipes UI + routes

## Do

- `recipe-preview.tsx`, `all-recipes-catalog.tsx` (client search), `profile-recipes-section.tsx`.
- Pages: `/recipes/all` (empty state OK), `/recipes/[slug]` — reuses pack browser + header actions from P5.
- API: `GET /api/catalog/recipes`, `GET /api/catalog/recipes/[slug]`.
- `POST /api/recipes/[slug]/install` — same shape as skills install route.

## Verify

- `cd output && npm run build` passes.
