/**
 * Dhandha School · Cloudflare Worker (v2)
 *
 * Routes:
 *   POST /api/apply   — submit application (saves to D1 + Google Sheets)
 *   GET  /api/health  — health check
 *
 * Env bindings:
 *   DB                   → Cloudflare D1 database  (wrangler.toml)
 *   SHEETS_WEBHOOK_URL   → Google Apps Script Web App URL  (secret)
 *   ALLOWED_ORIGIN       → your site's origin, e.g. https://dhandhaschool.com  (vars)
 */

import { insertApplication } from './db.js';
import { appendToSheet }      from './sheets.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(data, status = 200, corsOrigin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...(corsOrigin ? corsHeaders(corsOrigin) : {}),
    },
  });
}

function getCorsOrigin(request, env) {
  const reqOrigin = request.headers.get('Origin');
  if (!reqOrigin) return env.ALLOWED_ORIGIN || '*';
  if (
    reqOrigin.includes('dhandhaschool.com') ||
    reqOrigin.includes('localhost') ||
    reqOrigin.includes('127.0.0.1') ||
    reqOrigin.includes('workers.dev') ||
    reqOrigin.includes('pages.dev') ||
    reqOrigin.includes('vercel.app')
  ) {
    return reqOrigin;
  }
  return env.ALLOWED_ORIGIN || '*';
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age':       '86400',
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

const VALID_TRACKS    = ['karkhana', 'sevadaata'];
const VALID_HOW_FOUND = [
  'Twitter / X', 'Instagram', 'LinkedIn', 'YouTube',
  'Friend / Word of mouth', 'WhatsApp group',
  'College / University', 'Google Search', 'Podcast', 'Other',
];

function validate(body) {
  const errors = [];

  // Step 1
  if (!body.full_name?.trim())    errors.push('full_name is required');
  if (!body.age)                  errors.push('age is required');
  else {
    const a = Number(body.age);
    if (isNaN(a) || a < 13 || a > 60) errors.push('age must be between 13 and 60');
  }
  if (!body.email?.trim())        errors.push('email is required');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
                                  errors.push('email is invalid');
  if (!body.whatsapp?.trim())     errors.push('whatsapp is required');
  if (!body.city?.trim())         errors.push('city is required');
  if (!body.current_role?.trim()) errors.push('current_role is required');

  // Step 2
  if (!body.track)                errors.push('track is required');
  else if (!VALID_TRACKS.includes(body.track))
                                  errors.push(`track must be one of: ${VALID_TRACKS.join(', ')}`);
  if (!body.sold_story?.trim())        errors.push('sold_story is required');
  if (!body.time_commitment?.trim())   errors.push('time_commitment is required');
  if (!body.background_story?.trim())  errors.push('background_story is required');
  if (!body.why_apply?.trim())         errors.push('why_apply is required');

  // Step 3
  if (!body.how_found || !Array.isArray(body.how_found) || body.how_found.length === 0)
                                  errors.push('how_found must have at least one selection');
  if (!body.attend_commit)        errors.push('attend_commit must be accepted');
  if (!body.checkpoint_commit)    errors.push('checkpoint_commit must be accepted');

  return errors;
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url    = new URL(request.url);
    const origin = getCorsOrigin(request, env);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Health check
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json(
        { ok: true, service: 'dhandha-api', timestamp: new Date().toISOString() },
        200, origin,
      );
    }

    // Submit application
    if (url.pathname === '/api/apply' && request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ ok: false, error: 'Invalid JSON body' }, 400, origin);
      }

      // Validate
      const errors = validate(body);
      if (errors.length > 0) {
        return json({ ok: false, errors }, 422, origin);
      }

      // Build normalised payload
      const submission_id = crypto.randomUUID();
      const created_at    = new Date().toISOString();

      const payload = {
        submission_id,
        created_at,
        // Step 1
        full_name:        String(body.full_name).trim(),
        age:              Number(body.age),
        email:            String(body.email).trim().toLowerCase(),
        whatsapp:         String(body.whatsapp).trim(),
        city:             String(body.city).trim(),
        current_role:     String(body.current_role).trim(),
        // Step 2
        track:            body.track,
        sold_story:       String(body.sold_story).trim(),
        time_commitment:  String(body.time_commitment).trim(),
        background_story: String(body.background_story).trim(),
        why_apply:        String(body.why_apply).trim(),
        // Step 3
        how_found:        body.how_found,          // array — stored as JSON in D1
        attend_commit:    Boolean(body.attend_commit),
        checkpoint_commit: Boolean(body.checkpoint_commit),
        // Payment
        payment_id:       body.payment_id ? String(body.payment_id).trim() : '',
        status:           body.payment_id ? 'paid' : (body.status ? String(body.status).trim() : 'pending'),
      };

      // 1️⃣  Save to D1 (primary store — error blocks submission)
      try {
        await insertApplication(env.DB, payload);
      } catch (err) {
        console.error('D1 insert failed:', err.message);
        if (err.message?.includes('UNIQUE')) {
          return json(
            { ok: false, error: 'An application with this email already exists.' },
            409, origin,
          );
        }
        return json(
          { ok: false, error: 'Failed to save application. Please try again.' },
          500, origin,
        );
      }

      // 2️⃣  Forward to Google Sheets via Apps Script (non-fatal)
      if (env.SHEETS_WEBHOOK_URL) {
        const sheetsResult = await appendToSheet(env.SHEETS_WEBHOOK_URL, payload);
        if (!sheetsResult.ok) {
          console.warn('Sheets webhook failed (non-fatal):', sheetsResult.error);
        }
      }

      return json(
        {
          ok: true,
          submission_id,
          message: "Application received! We\u2019ll be in touch on WhatsApp within 5\u20137 days.",
        },
        201, origin,
      );
    }

    return json({ ok: false, error: 'Not found' }, 404, origin);
  },
};
