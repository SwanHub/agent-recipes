# Static page stubs

Placeholder routes for `/join` and 404. Real content lives elsewhere; these just need to exist and look on-brand.

## Do

1. Write `output/app/join/page.tsx` — a centered server component reading "Composer Cafe onboarding placeholder — wire sign-up flow when you're ready." Use `text-muted` and `font-mono`. Keep it simple; this is a stub.
2. Write `output/app/not-found.tsx` — a centered "404 — not on the menu" message in the same minimal tone, with a link back to `/`.

## Verify

- `http://localhost:3000/join` renders the placeholder.
- `http://localhost:3000/anything-else` renders the 404. **Human check:** both pages match the design language (font-mono, muted, centered, no chrome surprises).
