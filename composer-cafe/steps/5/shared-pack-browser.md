# Shared pack browser, live GitHub fetch, install CTA

Two cross-cutting pieces used by both the recipe and skill detail pages:

1. The interactive folder/file tree (`SkillPackBrowser`) plus markdown previewer.
2. The "Use in Cursor" action row plus the install-count tracking route.

The browser renders trees fetched from GitHub at render time — there is no static `DEMO_SKILL_PACK` or `RECIPE_GOLDENS` (see `CONVENTIONS.md`).

## Do

### Live GitHub fetch helper (server-only)

Create a small server helper (e.g. `output/lib/server/github-pack.ts`) that takes a `GitHubSource` and returns a fully-populated `SkillPackNode` tree.

- Walks the folder recursively via the GitHub Contents API.
- Inlines text-file contents from `download_url` (raw.githubusercontent.com is not rate-limited).
- Caches with `next: { revalidate: 3600 }` so repeat page views don't re-fetch.
- Skips noise (`LICENSE`, `.DS_Store`) and any file over a modest size cap (~200 KB) so the JSON we ship to the browser stays reasonable.
- Auth: include `GITHUB_TOKEN` if present (lifts the rate limit from 60/hr unauth → 5000/hr). Optional — for a small catalog, unauth works.

Also export a couple of trivial helpers: `githubFolderUrl(source)` (for the "View on GitHub" link) and `installSnippet(kind, source, slug)` (for the copyable command in the modal).

### `SkillPackBrowser` (client)

`output/components/skill-pack-browser.tsx`. Exports `type SkillPackNode = { kind: "file"; name; content; language? } | { kind: "folder"; name; children: SkillPackNode[] }`.

Two-column layout: left is a collapsible folder/file tree (default expanded), right is the preview pane. Selecting a markdown file renders it via `<SkillMarkdownPreview>`; other files render in a monospace `<pre>` with a small path strip. Initial selection: the first file in DFS order.

### Markdown previewer (client)

`output/components/skill-markdown-preview.tsx`. Wraps `react-markdown` + `remark-gfm`, with overrides for headings, paragraphs, lists, inline code (mono on `bg-avatar-off-bg`), code blocks, and links (`text-accent` underline). No global typography plugin needed — style with overrides on the design tokens.

### Action row (client) — "Use in Cursor" + "View on GitHub"

`output/components/skill-detail-header-actions.tsx`. Props: `{ kind: "recipe" | "skill"; slug; source; sourceUrl; installCount }`.

Three elements:

- **Use in Cursor** — primary pill (`bg-accent text-white`). On click: open a modal showing the `installSnippet` (typically a `git clone --depth 1 && cp -R … ~/.claude/skills/<slug>` one-liner) with a Copy button. Also POST to `/api/{kind}/[slug]/install` to bump the counter; optimistic-update the displayed count from the response.
- **View on GitHub** — secondary outline pill linking to `sourceUrl` (open in new tab).
- Install count text, e.g. "1.2K installs".

No "Download" button. Composer Cafe is a discovery surface, not a file portal (see `CONVENTIONS.md`).

### Install-count routes

- `output/app/api/skills/[slug]/install/route.ts` — `POST` increments the skill row's `install_count`, returns `{ installCount: n }` or `{ error: "not found" }` 404.
- `output/app/api/recipes/[slug]/install/route.ts` — same shape for recipes.

Both `dynamic = "force-dynamic"`, both use the increment helpers defined in `data-layer-extensions.md`.

## Verify

- `cd output && npm run build` passes. Visual check at the P6 USER PAUSE.
- A `POST /api/skills/<some-seeded-slug>/install` against the dev server returns an incrementing number across calls.
