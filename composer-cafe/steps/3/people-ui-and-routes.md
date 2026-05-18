# People UI + routes

User-visible People feature.

## Do

- `preview-avatar.tsx` — circular avatar with initials fallback.
- `user-profile-preview.tsx` — card linking to `/profile/${person.slug}` with contribution summary.
- `all-people-catalog.tsx` — client search over name + bio, responsive grid.
- `/profiles/all` — community catalog.
- `/profile/[slug]` — profile detail (avatar, joined date, bio, external links). Leave placeholders for skills (P5) and recipes (P7).
- `GET /api/catalog/people` and `GET /api/catalog/people/[segment]`.

## Verify

- `cd output && npm run build` passes. Visual check at P4 USER PAUSE.

