# Person type

Define the shared `Person` type that every server and client component consumes. There is no static seed array — real user data is fetched from GitHub by the seed script in `seed-script-v1-users.md`.

## Do

Write `output/lib/cafe-demo.ts` (this file gets extended in P5 with `RecipeDatum`, `SkillDatum`, and `GitHubSource`):

- Export a `Person` type covering everything a profile page renders: the authoritative `slug`, display name, avatar URL, optional bio, ISO joined-at date, GitHub URL, optional linkedin/website URLs, and the two count fields (`skillCount`, `recipeCount`) which loaders populate from live DB aggregates.
- Match the column nullability from the migration: bio, linkedin, website are `string | null`.

That's the entire file. No fallback array, no slug helper, no derived data.

## Verify

- `npm run build` passes (the type compiles).
- `Person['slug']` is `string` and matches the schema's authoritative `users.slug` column (see `CONVENTIONS.md`).
