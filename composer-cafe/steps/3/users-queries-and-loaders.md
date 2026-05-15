# People queries + loaders

Wire up the Supabase reads for users behind a small set of loader functions that pages and API routes call.

## Do

Establish server-only loaders for the People feature (a single file, or split between a "Supabase queries" module and a "loaders" facade — whichever you prefer; downstream code only imports the loaders).

- `fetchPeople()` — returns the full list of `Person`. Choose an ordering that reads well in a community grid.
- `fetchPersonByProfileSegment(slug)` — returns a single `Person` (or null) matched by the authoritative `slug` column.

Both must return `Person` shaped objects whose `skillCount` / `recipeCount` reflect real DB rows owned by that user — populated at query time, using whatever Postgres or PostgREST feature is cleanest (embedded count, view, aggregate, RPC). Wrong counts here are visible on every community card, so don't defer this.

The loaders call `catalogSupabase()` from P2 directly. When env vars are missing, `catalogSupabase()` throws — the loader does not catch. Pages render the resulting error instead of a fake catalog.

## Verify

- `cd output && npm run build` passes.
- The next step in this phase (`people-ui-and-routes.md`) consumes both loaders; visual confirmation lands at the P4 USER PAUSE.
