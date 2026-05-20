# Subscribers

Email capture vertical. Step 8 mounts the form into the landing page and footer.

## Do

**Migration** — `output/supabase/migrations/<fresh-utc-ts>_create_subscribers.sql` (after recipes migration): unique email, `source` constrained to `'hero' | 'footer'`, `created_at`. **Enable RLS** at the end. No policies — every write goes through the server's service-role client.

**Server** — `output/lib/subscribers.ts` (helper) + `output/app/api/subscribe/route.ts` (POST). Validate email shape, distinguish duplicate from invalid from server error.

**Component** — `output/components/agent-recipes-website-email-signup-form.tsx`, client, takes `source: 'hero' | 'footer'`, inline status (no toast), styled with semantic tokens.

From `output/`: `supabase db push` to apply the migration. No re-seed — `subscribers` starts empty.

## Verify

- Migration file exists with a 14-digit UTC timestamp prefix; `subscribers` table present in Supabase.
- `POST /api/subscribe` with `{ email: "test+1@example.com", source: "hero" }` → `200`.
- Repeat → `409`.
- `{ email: "nope", source: "hero" }` → `400`. `{ email: "a@b.co", source: "sidebar" }` → `400`.
- One row in `subscribers` with `source = 'hero'`.

