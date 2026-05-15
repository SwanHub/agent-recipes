# Formatting helpers

Two tiny utilities used across previews and detail pages.

## Do

1. Write `output/lib/format-downloads.ts` exporting `formatDownloads(n: number): string` — human-readable counts: `980` → `"980"`, `1_960` → `"1.96K"`, `40_200` → `"40.2K"`, `1_300_000` → `"1.3M"`. One decimal place; trim a trailing `.0`.
2. Write `output/lib/format-website-label.ts` exporting `formatWebsiteLabel(url: string): string` — strip protocol and trailing slash for display: `"https://www.example.com/foo/"` → `"example.com/foo"`. Drop a leading `www.`.

## Verify

- Both files compile (`npm run build` from `output/` still passes).
