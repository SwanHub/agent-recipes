# Helpers

Owns `output/lib/*` leaf utilities — shared constants, server-only DB client, display formatters.

> **Subagent task** — one of three parallel siblings (`app`, `chrome`, `helpers`). Dispatched by the orchestrator in a single message. Do not read sibling files.

## Do

1. `lib/constants.ts` — shared layout classes (outer shell + inner content column) + the Agent Recipes GitHub repo URL used by the footer credit.
2. `lib/supabase/db.ts` — server-only client from `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (service role). Missing env throws clearly; never silent-fallback to fake rows. All downstream fetches inherit this.
3. `lib/format-downloads.ts` — `formatDownloads(n: number): string`. Compact counts: `< 1000` → as-is (`42` → `"42"`); `>= 1000` → one decimal + `k` (`1234` → `"1.2k"`, `12000` → `"12.0k"`); `>= 1_000_000` → one decimal + `M`. Used by recipe preview cards in pack-recipes.
4. `lib/format-website-label.ts` — `formatWebsiteLabel(url: string): string`. Strip `https://`/`http://` and any trailing slash; if the path is just `/` return just the host; otherwise return `host + path` truncated to ~40 chars with `…`. Used on profile pages.

## Verify (subagent)

- Return when all four files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
