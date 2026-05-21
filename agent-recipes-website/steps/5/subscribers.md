# Subscribers

Email capture vertical. Step 6 mounts the form in the landing page + footer.

## Do

**Migration** — `supabase/migrations/<14-digit UTC ts>_create_subscribers.sql` (after recipes): unique email, `source` constrained to `'hero' | 'footer'`, `created_at`. **Enable RLS** at the end. No policies — every write is server-side service-role.

**Server** — `lib/subscribers.ts` (helper) + `app/api/subscribe/route.ts` (POST). Validate email shape; distinguish duplicate from invalid from server error.

**Component** — `components/agent-recipes-website-email-signup-form.tsx`, client; takes `source: 'hero' | 'footer'`; inline status (no toast); styled with semantic tokens.

From `output/`: `supabase db push`. No re-seed — `subscribers` starts empty.

## Verify

- Migration file exists with 14-digit UTC ts prefix; `subscribers` table present in Supabase.
- `POST /api/subscribe` with `{ email: "test+1@example.com", source: "hero" }` → `200`.
- Repeat → `409`.
- `{ email: "nope", source: "hero" }` → `400`. `{ email: "a@b.co", source: "sidebar" }` → `400`.
- One row in `subscribers` with `source = 'hero'`.
