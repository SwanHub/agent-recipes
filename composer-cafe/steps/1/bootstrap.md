# Bootstrap

Walk the user through prereqs interactively, then scaffold the Next.js 16 project at `output/` with all runtime deps Composer Cafe needs.

## 1. Greet and check prereqs

Open with a brief welcome:

> We're going to build Composer Cafe — a minimal community site for profiles, recipes, and skills. This first step gets your machine ready and scaffolds the project. There are three checkpoints later (after People, after Recipes+Skills, after the landing page) where you'll visually confirm the site looks right before we move on.

Then check, in order. Don't proceed past any failure — work it out with the user.

1. **Node 20+** — verify, install if needed.
2. **Supabase CLI** — verify it's installed; install if needed (Homebrew on macOS, see [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli) otherwise).
3. **Supabase CLI auth** — `supabase link` requires the CLI to be logged in. Run `supabase projects list` to test; if it errors with "Access token not provided", ask the user to run `supabase login` in a separate terminal (it opens a browser). You can't drive that login flow from inside this session.
4. **Supabase project + credentials.** Ask the user for the project URL (e.g. `https://abc123.supabase.co`) and the **service-role** key from Settings → API (the long one, not anon). Hold them in memory until `output/.env.local` exists. Derive the project ref from the URL.

## 2. Scaffold

From the recipe root, scaffold Next.js 16 into `output/`: `npx create-next-app@16.2.4 output --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*"` (accept defaults; skip Turbopack if asked).

All remaining shell commands run **from `output/`** (`cd output && …` if invoking from outside). Inside that directory:

- Install pinned runtime deps the recipe needs: `@supabase/supabase-js@2.76.1`, `lucide-react@1.14.0`, `react-markdown@10.1.0`, `remark-gfm@4.0.1`, `server-only@0.0.1`, plus `@next/env@16.2.4` for the seed script.
- Install pinned dev deps: `tsx@4.21.0`.
- Add `"supabase:seed": "tsx scripts/supabase/seed-catalog.ts"` to `package.json` scripts.
- Copy `assets/AGENTS.md.txt` → `output/AGENTS.md`. Create `output/CLAUDE.md` containing the single line `@AGENTS.md`.
- Copy `assets/.env.example` → `output/.env.example`. Append `.env*` and `/supabase/artifacts/` to `output/.gitignore`.

## 3. Wire up Supabase

From `output/`:

- Write `output/.env.local` with the URL and service-role key from §1.
- Run `supabase link --project-ref <ref>`. If it asks for a database password, surface that prompt to the user. (If `supabase link` errors with "Access token not provided", the user skipped the login step in §1.3 — back up and resolve.)

## Verify

- `node --version` shows 20+, `supabase --version` works, `output/.env.local` has both vars set to real values (not the placeholders).
- From `output/`, `npm run build` completes with no errors. Pages will be near-empty; the build must succeed.
- `output/AGENTS.md` exists and warns about Next 16.

