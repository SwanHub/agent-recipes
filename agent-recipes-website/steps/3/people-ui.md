# People UI

Components only.

## Do

- `preview-avatar.tsx` — circular avatar with initials fallback
- `user-profile-preview.tsx` — card linking to `/profile/${person.slug}` with contribution summary
- `all-people-list.tsx` — client search over name + bio, responsive grid

## Verify

- `cd output && npm run build` passes. Visual check happens at the step 4 STOP — REVIEW gate.
