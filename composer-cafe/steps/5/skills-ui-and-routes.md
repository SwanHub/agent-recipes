# Skills UI + routes

## Do

- `skill-preview.tsx`, `all-skills-catalog.tsx` (client search), `profile-skills-section.tsx`.
- Pages: `/skills/all`, `/skills/[slug]` — detail uses pack browser + header actions from sibling step.
- API: `GET /api/catalog/skills`, `GET /api/catalog/skills/[slug]`.

## Verify

- `cd output && npm run build` passes.
