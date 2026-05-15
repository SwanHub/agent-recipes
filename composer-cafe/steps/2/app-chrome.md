# App chrome, design tokens, brand mark

Establish the visual shell every page renders inside: design tokens (colors), fonts, layout, header, footer. **The aesthetic matters** — minimal, warm, single-accent. Get the tokens exactly right; freedom in everything else.

## Design tokens (use verbatim)

Replace `output/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --background: rgb(247 247 244);
  --foreground: #26251e;
  --muted: #5a5852;
  --border: #e6e5e0;
  --accent: #f54e00;
  --avatar-off-bg: rgb(235 232 223);
  --footer-bg: rgb(242 241 238);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #14120b;
    --foreground: #edecec;
    --muted: #807d72;
    --border: #2a2824;
    --accent: #f54e00;
    --avatar-off-bg: rgb(38 35 31);
    --footer-bg: rgb(28 26 22);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-avatar-off-bg: var(--avatar-off-bg);
  --color-footer-bg: var(--footer-bg);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

Tailwind utilities like `bg-background`, `text-muted`, `text-accent`, `border-border`, `bg-footer-bg` follow from the `@theme inline` block. Use those tokens — never hard-code colors.

## Do

1. Write `output/lib/constants.ts` exporting:
   - `SITE_SHELL_CLASS = "mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-14"` (header/footer outer width)
   - `SITE_CONTENT_SHELL_CLASS = "mx-auto w-full max-w-4xl"` (inner reading column)
   - `COMPOSER_CAFE_GITHUB_URL` — any plausible GitHub URL for the project
2. Copy `assets/CUBE_2D_LIGHT.svg` to `output/public/CUBE_2D_LIGHT.svg`.
3. Write `output/components/composer-cafe-mark.tsx` — a small component that renders `/CUBE_2D_LIGHT.svg` via `<img>` (use the `next/no-img-element` eslint-disable comment; the SVG is a local brand asset).
4. Write `output/components/site-header.tsx`. On `md+`: brand lockup left, primary nav (`/profiles/all` "Community", `/recipes/all` "Recipes", `/skills/all` "Skills") absolutely centered, "Sign in" link right (to `/join`). On narrow: stack with brand+sign-in row, nav row below. Brand lockup is `<ComposerCafeMark className="size-5" />` next to "COMPOSER CAFE" in font-mono uppercase tracking-wider, plus a subline "concept by jackson" with an external link.
5. Write `output/components/site-footer.tsx`. Centered single line in font-mono on a `bg-footer-bg` strip: "Built by [you] with Composer 2", followed by a GitHub glyph link to `COMPOSER_CAFE_GITHUB_URL`.
6. Replace `output/app/layout.tsx` to load Geist + Geist Mono via `next/font/google`, set metadata (title: "Composer Cafe"), wrap children with `SiteHeader` inside `SITE_SHELL_CLASS`, place `SiteFooter` outside the shell at the bottom of a flex column. Body is `flex min-h-dvh flex-col`.
7. Replace `output/app/page.tsx` with a temporary placeholder (one centered `<h1>` saying "Composer Cafe — under construction"). It will be rewritten in P7.

## Verify

- `cd output && npm run dev`, open `http://localhost:3000`. **Human check:** background is warm off-white, header centered nav with three links + sign-in, footer strip slightly darker, fonts are Geist. No console errors. Toggle dark mode in OS settings — colors invert correctly.
