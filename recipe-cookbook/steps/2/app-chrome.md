# App chrome

Site shell every page shares: theme tokens, fonts, header, footer, brand mark, placeholder home. Match the aesthetic in `RECIPE.md` (warm minimal canvas, Geist, single orange accent, dark mode).

## Do

1. `output/lib/constants.ts` — shared layout classes (outer shell + inner content column) and a GitHub URL for the footer.
2. Copy `assets/CUBE_2D_LIGHT.svg` → `output/public/`.
3. `output/components/composer-cafe-mark.tsx` — brand mark from that asset.
4. `output/components/site-header.tsx` — responsive header with brand, nav to Community (`/profiles/all`), Recipes (`/recipes/all`), Skills (`/skills/all`), Sign in (`/join`).
5. `output/components/site-footer.tsx` — footer crediting the builder + repo link.
6. `output/app/globals.css` — Tailwind v4 semantic color tokens (`background`, `foreground`, `muted`, `accent`, `border`, `footer-bg`, etc.) so components use utilities, not hard-coded hex.
7. `output/app/layout.tsx` — Geist fonts, site metadata, header + footer wrapping children.
8. `output/app/page.tsx` — temporary home placeholder (replaced in P9).

## Verify

- `cd output && npm run dev` → `http://localhost:3000`. **Human check:** on-brand shell (header nav, footer, warm palette, Geist, dark mode). No console errors.
