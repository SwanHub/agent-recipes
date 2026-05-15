# Enrich profile detail page with recipes + skills

The minimal `/profile/[slug]` from P3 left a placeholder for these sections. Wire them up now.

## Do

In `output/app/profile/[slug]/page.tsx`, below the bio + external links area, render:

- A divider.
- `<ProfileRecipesSection name={person.name} />`.
- A divider.
- `<ProfileSkillsSection name={person.name} />`.

Also surface a small mono badge near the avatar: total install count across this person's recipes + skills (sum of `installCount`). Fetch the two lists in parallel and reduce locally — no new loader needed.

The badge label is "X installs" (or "X install" when n is 1), not "downloads". See `CONVENTIONS.md` for the CTA / install terminology.

## Verify

- `cd output && npm run build` passes. Visual check is the P6 USER PAUSE.
