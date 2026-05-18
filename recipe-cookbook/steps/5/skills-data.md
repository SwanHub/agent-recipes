# Skills data

Types, Supabase access, and server-side fetch helpers.

## Do

- `GitHubSource` + `SkillDatum` in `cafe-demo.ts`
- Skill reads + install-count increment
- `fetchCatalogSkills()`, `fetchSkillBySlugSegment(slug)`, `fetchSkillsForPersonName(name)`
- Server helper to fetch a GitHub folder tree from `GitHubSource` (Contents API, ~1h cache, optional `GITHUB_TOKEN`)

## Verify

- `cd output && npm run build` passes.
