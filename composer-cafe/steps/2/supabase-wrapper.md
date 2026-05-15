# Server-only Supabase client

Establish the single entry point every server module uses to talk to Supabase.

## Do

Write `output/lib/supabase/catalog-db.ts`:

- Mark it `import "server-only"` so it can never leak to a client bundle.
- Export a function that returns a configured `SupabaseClient` built from `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Use the service role so seed scripts and loaders can both rely on it; no session auth, no cookie handling.
- If either env var is missing, throw with a clear message naming the missing var. There is no static-data fallback — a misconfigured deployment should fail loudly, not serve a fake catalog.

Loaders in later phases (`lib/server/catalog-loaders.ts`) import this client directly. No wrapper, no fallback layer.

## Verify

- `cd output && npm run build` succeeds.
- The file is referenced by name from at least one loader by the end of P3 (no need to assert here).
