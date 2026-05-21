# Chrome

Owns `output/components/chrome/*` + the brand asset. **Catalog only — no auth, no "join" concept.**

> **Subagent task** — one of three parallel siblings (`app`, `chrome`, `helpers`). Dispatched by the orchestrator in a single message. Do not read sibling files.

## Do

1. Copy `assets/CUBE_2D_LIGHT.svg` → `output/public/`.
2. `components/chrome/agent-recipes-website-mark.tsx` — brand mark wrapping that asset.
3. `components/chrome/site-header.tsx` — responsive: brand left; nav `Community` (`/profiles/all`), `Recipes` (`/recipes/all`); **CTA `Submit recipe` link to `/recipes/submit`**, visually distinct from the two nav items (subtle button). **No Sign-in link.** No skills nav. `/recipes/submit` doesn't exist until pack-recipes runs in step 3 — fine, it's a `<Link>` href, not an import.
4. `components/chrome/site-footer.tsx` — credit + repo link. Imports the repo URL from `@/lib/constants` (written by the helpers sibling — resolves at fan-in).

## Verify (subagent)

- Return when all listed files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
