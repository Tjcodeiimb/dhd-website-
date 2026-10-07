/**
 * D1 database helper — Cloudflare D1 (SQLite)
 * Matches live form fields (v2).
 */

/**
 * Insert a new application row into D1.
 * @param {D1Database} db   - D1 binding from env
 * @param {object}     data - validated + normalised payload
 */
export async function insertApplication(db, data) {
  const stmt = db.prepare(`
    INSERT INTO applications (
      submission_id, created_at,
      full_name, age, email, whatsapp, city, current_role,
      track, sold_story, time_commitment, background_story, why_apply, building_now,
      how_found, attend_commit, checkpoint_commit
    ) VALUES (
      ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  await stmt.bind(
    data.submission_id,   data.created_at,
    data.full_name,       data.age,          data.email,
    data.whatsapp,        data.city,         data.current_role,
    data.track,           data.sold_story,   data.time_commitment,
    data.background_story, data.why_apply,  data.building_now,
    JSON.stringify(data.how_found),          // store as JSON array string
    data.attend_commit    ? 1 : 0,
    data.checkpoint_commit ? 1 : 0,
  ).run();
}
