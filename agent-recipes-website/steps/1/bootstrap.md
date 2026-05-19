# Bootstrap

Walk the user through prereqs interactively, then scaffold the Next.js 16 project at `output/` with all runtime deps Agent Recipes Website needs. **Assume a cold start** — verify each item; do not skip checks because the user might already be set up.

## 1. Check prereqs

The recipe-level welcome (in `RECIPE.md`) has already been sent. Continue directly into prereq checks, in order. Don't proceed past any failure — work it out with the user.

1. **Node 20+** — verify, install if needed (includes `npm`).
2. **Supabase CLI** — verify it's installed; install if needed (Homebrew on macOS, see [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli) otherwise).
3. **Supabase CLI auth** — run `supabase projects list` to test. If it errors with "Access token not provided", ask the user to run `supabase login` in a separate terminal (it opens a browser). You can't drive that login flow from inside this session. If it succeeds, the user is already logged in — continue.
4. **Supabase cloud project + credentials** — hosted project on supabase.com.
   - If the user has no project: have them sign up / log in at [supabase.com](https://supabase.com), create a project, then open Settings → API.
   - Collect the project URL (e.g. `https://abc123.supabase.co`) and the **service-role** key (not the anon key). Derive the project ref from the URL.
5. **GitHub token** — needed for the seed script (public API read). If the user has no token, guide them to GitHub → Settings → Developer settings → Personal access tokens (classic or fine-grained with public read). Collect the token; it goes in `.env.local` as `GITHUB_TOKEN` in §3.

## 2. Scaffold

If `output/` already exists, stop and ask the user before overwriting or re-scaffolding.

From the recipe root, scaffold Next.js 16 into `output/`: `npx create-next-app@16.2.4 output --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"` (accept defaults; skip Turbopack if asked).

All remaining shell commands run **from `output/`** (`cd output && …` if invoking from outside). Inside that directory:

- Install pinned runtime deps the recipe needs: `@supabase/supabase-js@2.76.1`, `lucide-react@1.14.0`, `react-markdown@10.1.0`, `remark-gfm@4.0.1`, `server-only@0.0.1`, plus `@next/env@16.2.4` for the seed script.
- Install pinned dev deps: `tsx@4.21.0`.
- Add `"supabase:seed": "tsx scripts/supabase/seed-catalog.ts"` to `package.json` scripts.
- Copy `assets/AGENTS.md.txt` → `output/AGENTS.md`. Create `output/CLAUDE.md` containing the single line `@AGENTS.md`.
- Copy `assets/.env.example` → `output/.env.example`. Append `.env*` and `/supabase/artifacts/` to `output/.gitignore`.

## 3. Wire up Supabase

From `output/`:

1. If `supabase/config.toml` is missing, run `supabase init`.
2. Write `output/.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GITHUB_TOKEN` from §1 (real values, not placeholders).
3. Run `supabase link --project-ref <ref>`. If it asks for a database password, surface that prompt to the user. (If `supabase link` errors with "Access token not provided", the user skipped §1.3 — back up and resolve.)

## Verify

- `node --version` shows 20+, `supabase --version` works.
- `output/.env.local` has `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GITHUB_TOKEN` set to real values.
- `output/supabase/config.toml` exists; project is linked (`.supabase` or link success message).
- From `output/`, `npm run build` completes with no errors. Pages will be near-empty; the build must succeed.
- `output/AGENTS.md` exists and warns about Next 16.
