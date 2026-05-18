# People data layer

Types + server fetches in `cafe-demo.ts` and the catalog fetch modules.

## Do

- Export `Person` in `cafe-demo.ts` — slug, display fields, optional bio/links, `joinedAt`, `skillCount` / `recipeCount` (from live aggregates). Skills/recipes types extend this file in P5/P7.
- `fetchPeople()` — all people, sensible catalog ordering.
- `fetchPersonByProfileSegment(slug)` — one person or null by authoritative slug.
- Use `catalog-db` from P2; do not catch missing-env errors.

## Verify

- `cd output && npm run build` passes.
