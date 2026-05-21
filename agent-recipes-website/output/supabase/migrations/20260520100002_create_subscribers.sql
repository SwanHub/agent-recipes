CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL CHECK (source IN ('hero', 'footer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_unique UNIQUE (email)
);

CREATE INDEX subscribers_email_idx ON subscribers (email);
CREATE INDEX subscribers_created_at_idx ON subscribers (created_at DESC);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
