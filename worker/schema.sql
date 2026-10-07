-- Dhandha School · Application submissions (v2 — matches live form)
-- Run: wrangler d1 execute dhandha-db --file=./schema.sql

CREATE TABLE IF NOT EXISTS applications (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id      TEXT    NOT NULL UNIQUE,   -- UUID v4
  created_at         TEXT    NOT NULL,           -- ISO 8601 timestamp

  -- Step 1 · Who you are
  full_name          TEXT    NOT NULL,
  age                INTEGER NOT NULL,
  email              TEXT    NOT NULL,
  whatsapp           TEXT    NOT NULL,
  city               TEXT    NOT NULL,
  current_role       TEXT    NOT NULL,

  -- Step 2 · Your mindset
  track              TEXT    NOT NULL CHECK (track IN ('karkhana', 'sevadaata')),
  sold_story         TEXT    NOT NULL,
  time_commitment    TEXT    NOT NULL,
  background_story   TEXT    NOT NULL,
  why_apply          TEXT    NOT NULL,
  building_now       TEXT    NOT NULL DEFAULT '', -- optional

  -- Step 3 · The handshake
  how_found          TEXT    NOT NULL,           -- JSON array e.g. '["Instagram","YouTube"]', '[]' if not shared
  attend_commit      INTEGER NOT NULL DEFAULT 0 CHECK (attend_commit IN (0, 1)),
  checkpoint_commit  INTEGER NOT NULL DEFAULT 0 CHECK (checkpoint_commit IN (0, 1)),

  -- Admin
  status             TEXT    NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'accepted', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_applications_email    ON applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_created  ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status   ON applications (status);
