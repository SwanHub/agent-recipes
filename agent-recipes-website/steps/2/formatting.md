# Formatting

Display helpers for cards and profile links.

> **Subagent task** — one of three parallel siblings. Do not read sibling files.

## Do

- `lib/format-downloads.ts` — `formatDownloads(n)` for compact counts (recipe preview cards).
- `lib/format-website-label.ts` — `formatWebsiteLabel(url)` for readable website link text on profiles.

## Verify (subagent)

- Return when both files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
