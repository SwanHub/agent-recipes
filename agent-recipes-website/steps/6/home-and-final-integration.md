# Home + final integration

Landing page composes live people + recipes. Email signup (built in step 5) lands in two places: a dedicated section on `/` and the footer. Lead with what recipes make possible — screenshots, not abstract copy. **Catalog only — no "join" CTA anywhere.**

## Do

- **Featured fetches + API routes** — derive featured from live data, first N by title. **No hardcoded slug lists** in this file or the API route; data is real.
- **Landing components** — hero heading focused on running recipes in Cursor, section headings. Hero includes a secondary `<SubmitRecipeButton />` (from pack-recipes) alongside the primary action.
- **Replace `app/page.tsx`** — parallel fetch, sections in order:
  1. **Hero** — pitch: discover recipes, see what they build, run them in Cursor. Primary CTA + secondary `<SubmitRecipeButton />`.
  2. **Featured recipes** — cards use each recipe's `thumbnailUrl` (from `assets/recipe-thumbnail.png` in source repo). When `demoUrl` is set, link "View demo" prominently. Section header right-aligns a smaller `<SubmitRecipeButton />` so submitting is one click from anywhere on the page.
  3. **Email signup** — short copy ("New recipes weekly. No spam.") + `<EmailSignupForm source="hero" />`. Visually distinct band; semantic tokens; not louder than the recipe section above.
  4. **Community** — first 6 people.
- **Update `components/chrome/site-footer.tsx`** — render `<EmailSignupForm source="footer" />` above the existing repo-credit row. Inline state UI, no toast. Form on top, credits below, separator between if it reads cleanly.
- No join CTA, no skills section, no nav remnants.

## STOP — REVIEW WITH USER

Send this message, then **stop**. Zero tools until they sign off — final gate of the recipe.

> Final walkthrough: `/` (hero + recipe thumbnails/demos + email signup + Submit recipe CTA), `/recipes/all` (grid + Submit button), `/recipes/swanhub-agent-recipes-website` (or another seeded slug), `/recipes/submit` (paste a github repo URL with a `RECIPE.md` → lands in the catalog and redirects to `/recipes/<slug>`; paste a non-github URL → rejection), `/profiles/all` → `/profile/swanhub`, a 404. Submit a test email from both the hero section and the footer — confirm each creates a row in `subscribers` (different `source` values) and that resubmitting the same address shows "already subscribed". Sign off when ready.

Wait for explicit approval. "Looks good" / "yes" / "approved" / "ship it" qualify; silence and vague replies don't. Complete only when they sign off; fix in place and re-ask on issues.

## Done

Summarize routes, total `recipes` count (seeded + any submitted during the walkthrough), subscriber count, `output/` location, Vercel deploy notes (env vars, schema already applied).
