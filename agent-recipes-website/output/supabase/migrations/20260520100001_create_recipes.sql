CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  install_count integer NOT NULL DEFAULT 0,
  demo_url text,
  thumbnail_url text,
  author_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  owner text NOT NULL,
  repo text NOT NULL,
  default_branch text NOT NULL DEFAULT 'main',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT recipes_slug_unique UNIQUE (slug),
  CONSTRAINT recipes_owner_repo_unique UNIQUE (owner, repo)
);

CREATE INDEX recipes_slug_idx ON recipes (slug);
CREATE INDEX recipes_author_id_idx ON recipes (author_id);
CREATE INDEX recipes_install_count_idx ON recipes (install_count DESC);
CREATE INDEX recipes_created_at_idx ON recipes (created_at DESC);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
