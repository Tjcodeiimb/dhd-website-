-- One-off migration for the live D1 database (adds the optional Step 2 question).
-- Run: wrangler d1 execute dhandha-db --remote --file=./migrations_add_building_now.sql
ALTER TABLE applications ADD COLUMN building_now TEXT NOT NULL DEFAULT '';
