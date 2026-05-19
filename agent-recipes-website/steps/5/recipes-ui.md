# Recipes UI

Components only.

## Do

- Recipe preview card (thumbnail when `thumbnailUrl` set; optional external link when `demoUrl` set)
- Searchable recipes list
- `profile-recipes-section`
- GitHub file-tree preview, markdown preview, detail header with **Use in Cursor** — primary CTA on every recipe detail page. Opens a modal with a copyable install path/snippet; confirming the copy calls the install endpoint that increments the recipe's `install_count` in Supabase.

## Verify

- `cd output && npm run build` passes.
