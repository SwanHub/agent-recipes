# Bootstrap

Walk prereqs interactively, then scaffold Next.js 16 at `output/`. **Cold start** — verify each item; don't skip because the user might already be set up.

## 1. Prereqs

Step 0 has greeted. Continue directly. Don't proceed past any failure — resolve with the user.

1. **Node 20+** — verify; install if needed (includes `npm`).
2. **Supabase CLI** — verify; install if needed (Homebrew on macOS; see [supabase docs](https://supabase.com/docs/guides/cli) otherwise).
3. **Supabase CLI auth** — `(cd /tmp && supabase projects list)`. The subshell + `/tmp` cwd is deliberate: the Supabase CLI writes a `./supabase/.temp/` cache into whatever cwd it runs in, and **nothing should land at the recipe root**. Every other `supabase` command in this recipe runs from `output/` (see §2). On "Access token not provided", ask user to run `supabase login` in a separate terminal (browser opens; you can't drive that flow from here). On success, continue.
4. **Supabase cloud project + creds** — hosted on supabase.com.
   - No project: sign up / log in at [supabase.com](https://supabase.com), create one, open Settings → API.
   - Collect project URL (e.g. `https://abc123.supabase.co`) + **service-role** key (not anon). Derive project ref from URL.
5. **GitHub token** — public API read for the seed script. No token: Settings → Developer settings → Personal access tokens (classic or fine-grained w/ public read). Token goes in `.env.local` as `GITHUB_TOKEN` in §3.

## 2. Scaffold

If `output/` exists, stop and ask before overwriting.

From recipe root: `npx create-next-app@16.2.4 output --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"` (accept defaults; skip Turbopack if asked).

All remaining shell commands run **from `output/`**. Inside:

- Pinned runtime deps: `@supabase/supabase-js@2.76.1`, `lucide-react@1.14.0`, `react-markdown@10.1.0`, `remark-gfm@4.0.1`, `server-only@0.0.1`, `@next/env@16.2.4`.
- Pinned dev deps: `tsx@4.21.0`.
- Add to `package.json` scripts: `"supabase:seed": "tsx scripts/supabase/seed.ts"`.
- Copy `assets/AGENTS.md.txt` → `output/AGENTS.md`. Create `output/CLAUDE.md` with one line: `@AGENTS.md`.
- Copy `assets/.env.example` → `output/.env.example`. Append `.env*` and `/supabase/artifacts/` to `output/.gitignore`.

## 3. Wire Supabase

From `output/`:

1. `supabase init` if `supabase/config.toml` missing.
2. Write `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN` — real values from §1.
3. `supabase link --project-ref <ref>`. Surface DB-password prompt to user. "Access token not provided" → §1.3 was skipped; resolve.

## Verify

- `node --version` ≥ 20; `supabase --version` works.
- `output/.env.local` has all three vars set to real values.
- `output/supabase/config.toml` exists; project linked.
- From `output/`, `npm run build` completes. Pages near-empty; build must succeed.
- `output/AGENTS.md` exists and warns about Next 16.
