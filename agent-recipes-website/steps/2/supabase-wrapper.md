# Supabase server client

Single server entry point for Postgres (fetches and seed scripts use it later).

## Do

Write `output/lib/supabase/catalog-db.ts`: server-only client from `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (service role). Throw with a clear message if env is missing — no fake catalog fallback.

## Verify

- `cd output && npm run build` succeeds.
