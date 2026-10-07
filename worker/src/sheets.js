/**
 * Google Sheets helper via Google Apps Script Web App
 *
 * The Worker POSTs JSON to the Apps Script Web App URL.
 * The Apps Script receives it and appends a row to the sheet.
 * No GCP, no service account, no OAuth required.
 *
 * env.SHEETS_WEBHOOK_URL is set via: wrangler secret put SHEETS_WEBHOOK_URL
 */

/**
 * Forward a submission to the Google Apps Script Web App.
 * Failures are non-fatal — the D1 write is the source of truth.
 *
 * @param {string} webhookUrl - Apps Script Web App URL from env
 * @param {object} data       - full application payload
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function appendToSheet(webhookUrl, data) {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      // 8-second timeout via AbortController
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${text}` };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
