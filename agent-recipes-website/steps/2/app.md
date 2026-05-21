# App foundations

Owns `output/app/*` — globals, root layout, home placeholder, 404. Warm minimal canvas, Geist, single orange accent, dark mode. Brand: **Agent Recipes**.

> **Subagent task** — one of three parallel siblings (`app`, `chrome`, `helpers`). Dispatched by the orchestrator in a single message. Do not read sibling files.

## Do

1. `app/globals.css` — Tailwind v4 semantic tokens (`background`, `foreground`, `muted`, `accent`, `border`, `footer-bg`, …). All downstream components consume these utilities, never raw hex.
2. `app/layout.tsx` — Geist; metadata titled **Agent Recipes**; renders `<SiteHeader />` + `{children}` + `<SiteFooter />`. Imports from `@/components/chrome/site-header` and `@/components/chrome/site-footer` (written by the chrome sibling — resolves at fan-in build).
3. `app/page.tsx` — placeholder; replaced in step 6.
4. `app/not-found.tsx` — friendly 404, link back to `/`.

## Verify (subagent)

- Return when all four files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
