# Skills routes

App pages and API handlers.

## Do

- `/skills/all`, `/skills/[slug]`
- Wire `ProfileSkillsSection` on `/profile/[slug]`
- `GET /api/catalog/skills`, `GET /api/catalog/skills/[slug]` — omit if pages pass props only
- `POST /api/skills/[slug]/install`

## Verify

- `cd output && npm run build` passes.
