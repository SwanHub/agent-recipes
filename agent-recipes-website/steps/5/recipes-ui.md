# Recipes UI

Components only.

## Do

- Recipe preview card (thumbnail when `thumbnailUrl` set; optional external link when `demoUrl` set)
- Searchable recipes list
- `profile-recipes-section`
- **GitHub file-tree preview** (folder contents fetched live from the GitHub Contents API at request time, cached ~1h) — render as a real code-browser, not a flat list:
  - **Two-pane layout at desktop** — tree on the left (~260–300px wide), content pane on the right with `min-w-0` so long lines wrap. At mobile widths, collapse the tree behind a "Files" toggle and give the content pane the full width.
  - **Tree:** folders expand/collapse with a chevron (rotated on open); files indented under their folder; `lucide-react` icons by type (`folder`/`folder-open`, `file-text` for `.md`, `file-code` for source files like `.ts`/`.tsx`/`.py`/`.sh`, `file` otherwise). When a folder opens, auto-select its `README.md` if present; otherwise the first `.md`.
  - **Content pane — markdown:** render `.md` with `react-markdown` + `remark-gfm` so headings, lists, tables, and fenced code blocks visibly format. Style the prose with Tailwind (generous `leading`, distinct heading sizes, fenced code in a `bg-muted` `<pre>`) — it must not look like default browser HTML.
  - **Content pane — non-markdown:** render in a `<pre>` with `font-mono`, `text-sm`, preserved whitespace, and a subtle `bg-muted` tint. No syntax highlighting needed; readability and structure are the goal.
  - **Active state:** the selected file in the tree has a clear background tint **and** bold weight — the user must never lose track of which file they're viewing.
  - **Empty + error states:** never a blank content pane. Empty folder → "No files to preview." Fetch error / rate-limit → "Couldn't load from GitHub — try again in a minute." Style these the same as content so they feel intentional, not broken.
- **Detail header + Use in Cursor** — primary CTA on every recipe detail page. Opens a modal with a copyable install path/snippet; confirming the copy calls the install endpoint that increments the recipe's `install_count` in Supabase.

## Verify

- `cd output && npm run build` passes.
