# People data

Types + server fetches.

## Do

- `Person` in `cookbook-demo.ts` — slug, display fields, optional bio/links, `joinedAt`, `recipeCount`
- `fetchPeople()`, `fetchPersonByProfileSegment(slug)`
- Use `catalog-db` from P2; do not catch missing-env errors

## Verify

- `cd output && npm run build` passes.
