CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  avatar_url text,
  bio text,
  website text,
  twitter text,
  github_url text NOT NULL,
  joined_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_slug_unique UNIQUE (slug)
);

CREATE INDEX users_slug_idx ON users (slug);
CREATE INDEX users_joined_at_idx ON users (joined_at DESC);
CREATE INDEX users_name_idx ON users (name);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
