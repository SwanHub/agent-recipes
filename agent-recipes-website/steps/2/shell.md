# Shell

Shared chrome every page wears. Warm minimal canvas, Geist, single orange accent, dark mode. Brand: **Agent Recipes**. **Catalog only — no auth, no "join" concept.**

> **Subagent task** — one of three parallel siblings (`shell`, `db-client`, `formatting`). Dispatched by the orchestrator in a single message. Do not read sibling files.

## Do

1. `lib/constants.ts` — shared layout classes (outer shell + inner column) + GitHub repo URL footer credit.
2. Copy `assets/CUBE_2D_LIGHT.svg` → `output/public/`.
3. `components/chrome/agent-recipes-website-mark.tsx` — brand mark from that asset.
4. `components/chrome/site-header.tsx` — responsive: brand left; nav `Community` (`/profiles/all`), `Recipes` (`/recipes/all`); **CTA `Submit recipe` link to `/recipes/submit`**, visually distinct from the two nav items (subtle button). **No Sign-in link.** No skills nav.
5. `components/chrome/site-footer.tsx` — credit + repo link.
6. `app/globals.css` — Tailwind v4 semantic tokens (`background`, `foreground`, `muted`, `accent`, `border`, `footer-bg`, …). Components use utilities, not hex.
7. `app/layout.tsx` — Geist, metadata titled **Agent Recipes**, header + footer wrap children.
8. `app/page.tsx` — placeholder; replaced in step 6.
9. `app/not-found.tsx` — friendly 404, link back to `/`.

The `Submit recipe` href points to a route that doesn't exist until pack-recipes runs in step 3; that's fine — it's a `<Link>`, not an import, and resolves at runtime.

## Verify (subagent)

- Return when all listed files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
