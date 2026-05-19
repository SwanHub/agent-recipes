# People data

Types + server fetches.

## Do

- `Person` in `types.ts` — slug, display fields, optional bio/links, `joinedAt`, `recipeCount`
- `fetchPeople()`, `fetchPersonByProfileSegment(slug)`
- Use the `db` client from P2; do not catch missing-env errors

## Verify

- `cd output && npm run build` passes.
