# DB client

Single server entry point for Postgres. Downstream fetches and seed modules use this.

> **Subagent task** — one of three parallel siblings. Do not read sibling files.

## Do

`lib/supabase/db.ts` — server-only client from `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (service role). Missing env throws clearly; never silent-fallback to fake rows.

## Verify (subagent)

- Return when the file is written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
