# Pack browser + install CTA

Live GitHub folder tree and "Use in Cursor" flow for skill detail pages (recipes reuse this in P7).

## Do

- Server helper (e.g. `lib/server/github-pack.ts`) — walk a `GitHubSource` via GitHub Contents API, build a `SkillPackNode` tree, cache ~1h, optional `GITHUB_TOKEN`.
- Client: `skill-pack-browser.tsx`, `skill-markdown-preview.tsx`, `skill-detail-header-actions.tsx` (`kind: "recipe" | "skill"` for reuse later).
- `POST /api/skills/[slug]/install` — bump `install_count`, return new count.

No static demo packs. See `CONVENTIONS.md` for discovery-surface CTA rules.

## Verify

- `cd output && npm run build` passes. Full visual check at P6 USER PAUSE.
