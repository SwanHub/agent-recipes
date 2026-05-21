# Pack — Recipes

The Recipes vertical end-to-end. **One subagent, full context** — do not sub-split.

> **Subagent task** — one of two parallel packs (with `pack-people`). Dispatched by the orchestrator in a single message. Do not read `pack-people.md`.

## Pack-owned paths (you write these)

- `app/(recipes)/recipes/all/page.tsx`, `app/(recipes)/recipe/[slug]/page.tsx`, `app/(recipes)/recipes/submit/page.tsx`
- `app/api/recipes/...`, `app/api/recipes/[slug]/install/route.ts`, `app/api/recipes/submit/route.ts`
- `components/recipes/*` — preview card, list, **`profile-recipes-section.tsx`** (consumed by pack-people's profile page), GitHub file-tree, Use-in-Cursor modal, **`submit-recipe-button.tsx`** (reusable CTA, consumed by the header in step 2 + home page in step 6), **`submit-recipe-form.tsx`**
- `features/recipes/types.ts`, `features/recipes/server.ts`, `features/recipes/ingest.ts`, `features/recipes/seed.ts`
- `supabase/migrations/<14-digit UTC ts>_create_recipes.sql`

## Read-only

`lib/supabase/db.ts`, `lib/format-*.ts`, `app/layout.tsx`, `app/globals.css`, `components/chrome/*`. Never write.

## Cross-pack handoff

`components/recipes/profile-recipes-section.tsx` is imported by pack-people's profile page. **You own writing it.** Accept a `person` prop and render the user's recipes + install badge as a self-contained block.

## Do

**Types — `features/recipes/types.ts`** — `GitHubSource`, `RecipeDatum`. Include optional `demoUrl`, `thumbnailUrl`.

**Fetches — `features/recipes/server.ts`** — `fetchRecipes()`, `fetchRecipeBySlug(slug)`, `fetchRecipesForPersonName(name)`, install-count increment.

**Migration** — `supabase/migrations/<14-digit UTC ts>_create_recipes.sql` (after users migration; use a later UTC timestamp):

- `recipes` — `slug` (unique; format `<lowercase-owner>-<lowercase-recipe-name>`), `title`, `summary`, `install_count`, optional `demo_url`, optional `thumbnail_url`, author FK → users, GitHub source columns (`owner`, `repo`, default branch), timestamps. **`UNIQUE (owner, repo)`** in addition to `UNIQUE (slug)` — `(owner, repo)` is the natural key; `slug` is the URL handle.
- **Enable RLS** at the end. No policies — every read/write is server-side service-role.

**Ingestion — `features/recipes/ingest.ts`** — single source of truth, used by both seed and submit. Exports:

- `ingestRecipeFromRepo(supabase, githubToken, { owner, repo, recipeMdPath? }): Promise<IngestResult>` where `IngestResult` is one of:
  - `{ ok: true, slug, created: boolean }` — recipe upserted; `created` is false on idempotent resubmit.
  - `{ ok: false, code: 'no_recipe_md' | 'invalid_recipe_md' | 'repo_not_found' | 'github_rate_limit' | 'author_fetch_failed' }`.
- Steps: fetch `RECIPE.md` (at `recipeMdPath` if given, else repo root) via Contents API → parse frontmatter → check thumbnail → fetch owner profile → upsert `users` → upsert `recipes` keyed by `(owner, repo)`. Idempotent on resubmit: if `(owner, repo)` already exists, return its existing slug with `created: false`.
- Slug: `<lowercase(owner)>-<lowercase(recipeName)>` where `recipeName` = last path segment of `recipeMdPath` if set, else `repo`. Uniqueness is structural — GitHub guarantees owners are unique and an owner's repo-names + monorepo-subdir-names are unique within their own scopes. **Tiny fallback** for the one cross-path edge case (same owner has a standalone repo AND a monorepo subdir with the same name): on the off chance the slug is already taken by a *different* `(owner, repo)`, append `-2`, `-3`, … until free (cap ~5; error `slug_collision` past that). No random chars, no separate helper.

**Seed module — `features/recipes/seed.ts`** — exports `seedRecipes(supabase, githubToken): Promise<number>`:

- Source: [github.com/SwanHub/agent-recipes/tree/main](https://github.com/SwanHub/agent-recipes/tree/main). Top-level dirs containing `RECIPE.md` are recipes.
- For each, call `ingestRecipeFromRepo(supabase, githubToken, { owner: 'SwanHub', repo: 'agent-recipes', recipeMdPath: '<dir>/RECIPE.md' })`.
- Truncate `recipes` before the loop. Return count. (Users are seeded before by step 4's orchestrator; `ingestRecipeFromRepo`'s upsert handles any missing authors.)

**Routes**

- `app/(recipes)/recipes/all/page.tsx` — empty state OK. Mount `<SubmitRecipeButton />` above the grid.
- `app/(recipes)/recipe/[slug]/page.tsx` — composes file-tree + detail header + Use-in-Cursor.
- `app/(recipes)/recipes/submit/page.tsx` — server page; centered on-brand layout; one-line intro ("Paste a GitHub repo. It joins the catalog as soon as we can parse its RECIPE.md."); renders `<SubmitRecipeForm />`.
- `GET /api/recipes`, `GET /api/recipes/[slug]` — omit if pages pass props only.
- `POST /api/recipes/[slug]/install` — increments `install_count`; called when the user confirms the **Use in Cursor** snippet copy.
- `POST /api/recipes/submit` — body `{ url: string }`. Pipeline:
  1. `new URL(url)` parses → else `400 invalid_url`.
  2. `url.hostname` is `github.com` or `www.github.com` → else `400 not_github`.
  3. Parse `owner` / `repo` from `url.pathname` (`/owner/repo[/...]`) → else `400 invalid_url`.
  4. Call `ingestRecipeFromRepo(supabase, githubToken, { owner, repo })` — handles `(owner, repo)` idempotency and slug-collision internally.
     - `{ ok: true, slug, created: true }` → `201 { slug }`.
     - `{ ok: true, slug, created: false }` → `200 { slug, already_in_catalog: true }`.
     - `{ ok: false, code: 'no_recipe_md' }` → `400 no_recipe_md`.
     - `{ ok: false, code: 'invalid_recipe_md' }` → `400 invalid_recipe_md`.
     - `{ ok: false, code: 'repo_not_found' }` → `404 repo_not_found`.
     - `{ ok: false, code: 'github_rate_limit' }` → `429 github_rate_limit`.
     - Anything else → `500`.

**UI — `components/recipes/*`**

- `recipe-card.tsx` — thumbnail when `thumbnailUrl` set; "View demo" external link when `demoUrl` set.
- `all-recipes-list.tsx` — client search.
- `profile-recipes-section.tsx` — for the cross-pack handoff (imported by pack-people's profile page).
- `submit-recipe-button.tsx` — reusable styled `<Link href="/recipes/submit">` CTA. Single source of truth so the header (step 2) + recipes list + home page (step 6) all render identically. (Header in step 2 uses a plain `<Link>` for the CTA — this component is for page-level mounts.)
- `submit-recipe-form.tsx` — client. Single text input (`url`, placeholder `https://github.com/owner/repo`), submit button. POSTs `{ url }` to `/api/recipes/submit`. Inline status (no toast); on success, redirect to `/recipes/<slug>`. Error mapping:
  - `200 already_in_catalog` → "Already in the catalog — opening it now." (redirect)
  - `400 not_github` → "Only github.com URLs are accepted."
  - `400 invalid_url` → "That doesn't look like a GitHub repo URL."
  - `400 no_recipe_md` → "That repo doesn't have a `RECIPE.md` at its root."
  - `400 invalid_recipe_md` → "We found `RECIPE.md` but couldn't parse the frontmatter."
  - `404 repo_not_found` → "Couldn't find that repo (private or doesn't exist?)."
  - `429 github_rate_limit` → "GitHub rate-limited us. Try again in a minute."
  - `500` → "Something went wrong. Try again."
- `github-file-tree.tsx` — folder contents from GitHub Contents API at request time, cached ~1h. Render as a real code-browser, not a flat list:
  - **Two-pane at desktop** — tree left (~260–300px), content right with `min-w-0` so long lines wrap. Mobile: tree collapses behind a "Files" toggle, content takes full width.
  - **Tree** — chevron toggle on folders (rotate on open); files indented under their folder; `lucide-react` icons by type (`folder`/`folder-open`; `file-text` for `.md`; `file-code` for `.ts/.tsx/.py/.sh`; `file` otherwise). On folder open, auto-select `README.md` if present; else first `.md`.
  - **Markdown content** — `react-markdown` + `remark-gfm`. Tailwind prose: generous `leading`, distinct heading sizes, fenced code in `bg-muted` `<pre>`. Must not look like default browser HTML.
  - **Non-markdown content** — `<pre>` with `font-mono`, `text-sm`, preserved whitespace, subtle `bg-muted`. No syntax highlighting.
  - **Active state** — selected file gets clear `bg-` tint **and** bold weight.
  - **Empty/error** — never blank. Empty folder → "No files to preview." Fetch fail / rate-limit → "Couldn't load from GitHub — try again in a minute." Styled like content; not broken-looking.
- `use-in-cursor-modal.tsx` — primary CTA on detail. Copyable install snippet; confirming copy calls the install endpoint to bump `install_count`.

## Verify (subagent)

- Return when all pack-owned files are written. **Do not run `npm run build`** — orchestrator runs it once at fan-in.
