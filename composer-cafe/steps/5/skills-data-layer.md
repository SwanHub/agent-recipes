# Skills data layer

Types + fetches for skills.

## Do

- Add `GitHubSource` and `SkillDatum` in `cafe-demo.ts`. See `CONVENTIONS.md` for slug authority and source pointers.
- Supabase reads: list skills, skill by slug, skills for a person. Install-count increment by slug.
- Fetches: `fetchCatalogSkills()`, `fetchSkillBySlugSegment(slug)`, `fetchSkillsForPersonName(name)`. No fallback catalog when env is missing.

## Verify

- `cd output && npm run build` passes.
- Fetch return types expose `source: GitHubSource` for detail pages.
