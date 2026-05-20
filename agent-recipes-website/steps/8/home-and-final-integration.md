# Home + final integration

Landing page composes live people and recipes, and the email signup form built in step 7 lands in two places: a dedicated landing section and the footer. Lead with what recipes make possible — end-state screenshots, not abstract copy.

## Do

- Featured fetches + API routes: derive featured recipes from live data — first N by title. **No hardcoded slug lists** in this file or the API route; the data is real.
- Landing components: hero heading focused on running recipes in Cursor, section headings, join CTA pill.
- Replace `output/app/page.tsx` — parallel fetch, sections in order:
  1. **Hero** — Agent Recipes Website pitch: discover recipes, see what they build, run them in Cursor.
  2. **Featured recipes** — cards use each recipe’s `thumbnailUrl` (from `assets/recipe-thumbnail.png` on GitHub). When `demoUrl` is set, link “View demo” prominently so visitors see deployed outcomes.
  3. **Email signup** — short copy ("New recipes weekly. No spam.") + `<EmailSignupForm source="hero" />` from step 7. Visually distinct band, semantic tokens, not louder than the recipe section above it.
  4. **Community** — first 6 people.
  5. **Join** CTA.
- Update `output/components/site-footer.tsx` — render `<EmailSignupForm source="footer" />` above the existing repo credit row. The form keeps its inline state UI; no toast. Layout: form on top, credits below, separator between if it reads cleanly.
- No skills section or nav remnants.

## STOP — REVIEW WITH USER

Send this message to the user, then **stop**. Call **zero tools** until they sign off — this is the final gate of the recipe.

> Final walkthrough: `/` (hero + recipe thumbnails/demos + email signup section), `/recipes/all`, `/recipes/agent-recipes-website` (or another seeded slug), `/profiles/all` → `/profile/swanhub`, `/join`, a 404. Submit a test email from both the hero section and the footer — confirm each creates a row in `subscribers` (different `source` values) and that resubmitting the same address shows the "already subscribed" state. Sign off when ready.

Wait for explicit approval. "Looks good" / "yes" / "approved" / "ship it" all qualify; silence and vague replies do not. The recipe is complete only when they sign off; if they flag issues, fix in place and re-ask.

## Done

Summarize routes, seeded counts, subscriber count after the walkthrough, `output/` location, Vercel deploy notes (env vars, schema already applied).
