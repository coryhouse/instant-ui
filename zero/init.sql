-- Runs once, the first time the Postgres volume is created.
CREATE TABLE todo (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  done       BOOLEAN NOT NULL DEFAULT false,
  created_at DOUBLE PRECISION NOT NULL
);

INSERT INTO todo (id, title, done, created_at) VALUES
  ('seed-1', 'Write the talk', true,  1),
  ('seed-2', 'Demo a real sync engine', false, 2),
  ('seed-3', 'Open this page in two windows', false, 3);
