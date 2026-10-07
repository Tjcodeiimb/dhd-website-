/**
 * COMPLETE Code.gs for the Dhandha School Applications sheet.
 * Replace the entire contents of Code.gs in Google Sheets with this file, then:
 * 1. Paste your RESEND_API_KEY below (or set in Project Settings > Script Properties).
 * 2. Select 'sendTestEmail' in the function dropdown and click Run (to authorize permissions).
 * 3. Deploy > Manage deployments > Edit > New version > Deploy.
 *
 * It holds:
 *   doPost — what the website calls to append an application (with payment_id & status: paid),
 *            AND automatically triggers the confirmation email via Resend API!
 *   doGet  — what the admin portal reads the queue through. Read-only, token-guarded.
 *   sendTestEmail — 1-click test in Apps Script editor.
 *   sendPendingConfirmationEmails — sends confirmation emails to any existing rows not yet marked SENT.
 */

var SHEET_NAME = 'Applications';
var READ_TOKEN = 'DhandhaSchoolLMS';

// ============ RESEND EMAIL CONFIG ============
// In Google Sheets Apps Script, paste your key below or set it in Script Properties:
var RESEND_API_KEY = PropertiesService.getScriptProperties().getProperty('RESEND_API_KEY') || 'PASTE_RESEND_API_KEY_HERE';
var FROM_EMAIL     = 'Dhandha School <founder@dhandhaschool.com>';
var EMAIL_SUBJECT  = "We've received your application · Dhandha School";

// ============ WRITE: the website posts applications here ============

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    var headers = [
      'Submission ID',
      'Timestamp',
      'Full Name',
      'Age',
      'Email',
      'WhatsApp',
      'City',
      'Current Role',
      'Track',
      "What You've Sold",
      'Time Cut (10 hrs/week)',
      'Background Story',
      'Why This Cohort?',
      'How Found',
      'Attend Commit',
      'Checkpoint Commit',
      'Payment ID',
      'Status',
      'Email Sent',
      'Building Now',
    ];

    // Auto-create sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(headers);

      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1C1B17');
      headerRange.setFontColor('#F6F4EE');
      headerRange.setFontFamily('Courier New');
      sheet.setFrozenRows(1);
      sheet.autoResizeColumns(1, headers.length);
    } else {
      // Auto-migrate: ensure 'Payment ID' and 'Email Sent' columns exist
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0) {
        var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        if (currentHeaders.indexOf('Payment ID') === -1) {
          var statusIdx = currentHeaders.indexOf('Status');
          if (statusIdx !== -1) {
            sheet.insertColumnBefore(statusIdx + 1);
            sheet.getRange(1, statusIdx + 1).setValue('Payment ID');
          } else {
            sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Payment ID');
          }
        }
        var updatedHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (updatedHeaders.indexOf('Email Sent') === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Email Sent');
        }
        updatedHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (updatedHeaders.indexOf('Building Now') === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Building Now');
        }
      }
    }

    // how_found arrives as a JSON array — flatten to comma-separated string
    var howFoundStr = '';
    if (Array.isArray(data.how_found)) {
      howFoundStr = data.how_found.join(', ');
    } else if (typeof data.how_found === 'string') {
      try {
        var parsed = JSON.parse(data.how_found);
        howFoundStr = Array.isArray(parsed) ? parsed.join(', ') : data.how_found;
      } catch (ignored) {
        howFoundStr = data.how_found;
      }
    }

    var statusVal = data.status || (data.payment_id ? 'paid' : 'pending');

    // Trigger Resend confirmation email immediately
    var emailStatus = 'NOT_SENT';
    if (data.email) {
      try {
        var emailResult = sendConfirmationEmail(data.email, data.full_name);
        emailStatus = emailResult.ok ? 'SENT' : ('FAILED: ' + emailResult.error);
      } catch (mailErr) {
        emailStatus = 'FAILED: ' + mailErr.message;
        Logger.log('Confirmation email error: ' + mailErr.message);
      }
    }

    sheet.appendRow([
      data.submission_id     || '',
      data.created_at        || new Date().toISOString(),
      data.full_name         || '',
      data.age               || '',
      data.email             || '',
      data.whatsapp          || '',
      data.city              || '',
      data.current_role      || '',
      data.track             || '',
      data.sold_story        || '',
      data.time_commitment   || '',
      data.background_story  || '',
      data.why_apply         || '',
      howFoundStr,
      data.attend_commit     ? 'Yes' : 'No',
      data.checkpoint_commit ? 'Yes' : 'No',
      data.payment_id        || '',
      statusVal,
      emailStatus,
      data.building_now      || '',
    ]);

    return jsonOut({
      ok: true,
      status: statusVal,
      payment_id: data.payment_id || null,
      email_status: emailStatus,
    });

  } catch (err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// ============ READ: the admin portal reads the queue here ============

function doGet(e) {
  var supplied = (e && e.parameter && e.parameter.token) || '';
  if (supplied.length !== READ_TOKEN.length || !safeEquals(supplied, READ_TOKEN)) {
    return jsonOut({ ok: false, error: 'Unauthorized' });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return jsonOut({ ok: true, headers: [], rows: [] });

  var values = sheet.getDataRange().getValues();
  if (!values.length) return jsonOut({ ok: true, headers: [], rows: [] });

  var headers = values[0].map(function (h) { return String(h); });
  var rows = values.slice(1).map(function (row) {
    return row.map(function (cell) {
      return cell instanceof Date ? cell.toISOString() : String(cell);
    });
  }).filter(function (row) {
    return row.join('').trim().length > 0;
  });

  return jsonOut({ ok: true, headers: headers, rows: rows });
}

/** Compares every character regardless of where the first difference is, so the time taken
 *  doesn't tell a caller how much of the token they guessed correctly. */
function safeEquals(a, b) {
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function jsonOut(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ RESEND EMAIL HELPER & TEMPLATES ============

function sendConfirmationEmail(toEmail, fullName) {
  if (!toEmail) return { ok: false, error: 'No email provided' };
  var key = RESEND_API_KEY;
  if (!key || key.indexOf('re_') !== 0) {
    return { ok: false, error: 'RESEND_API_KEY not configured. Set your key at the top of Code.gs or in Script Properties.' };
  }

  var firstName = (fullName || 'there').trim().split(/\s+/)[0];
  if (firstName.length > 0) {
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }
  var html = applicationReceivedHtml(escapeHtml_(firstName));

  var payload = {
    from: FROM_EMAIL,
    to: [toEmail.trim().toLowerCase()],
    subject: EMAIL_SUBJECT,
    html: html,
  };

  var res = UrlFetchApp.fetch('https://api.resend.com/emails', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + key,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  var content = res.getContentText();
  if (code >= 200 && code < 300) {
    Logger.log('Confirmation email sent to ' + toEmail + ': ' + content);
    return { ok: true, response: content };
  } else {
    Logger.log('Failed to send email to ' + toEmail + ' (' + code + '): ' + content);
    return { ok: false, error: 'Resend ' + code + ': ' + content };
  }
}

function applicationReceivedHtml(name) {
  var inner =
    heading_("WE'VE GOT IT.", 'SIT TIGHT.') +
    script_('we read every single one.') +
    '<p style="margin:22px 0 16px;">Hi ' + name + ',</p>' +
    '<p style="margin:0 0 16px;">Thanks for applying to Dhandha School. Your application is in, and your fee has been received.</p>' +
    '<p style="margin:0 0 16px;">We read every application ourselves. There is a lot of thought that goes into putting a cohort together, and we would rather take the time than get it wrong.</p>' +
    '<p style="margin:0 0 16px;">You will hear from us <strong>within 72 hours</strong>. There is nothing more you need to do until then.</p>' +
    '<p style="margin:0;">We are glad you want to build with us.</p>';
  return emailWrapper(inner, pill_('Application received'));
}

// ============ BRAND SHELL ============
// Tables with inline styles, not divs: Gmail strips <style> blocks and Outlook applies its own box
// model, and this layout leans on an offset "hard shadow" that box-shadow cannot provide in email.
// Matches the acceptance and decision emails sent from the portal — same shell, same fonts, same
// footer — so every message from Dhandha School looks like it came from the same place.

var INK_ = '#0d0d0d';
var PAPER_ = '#f6f4ee';
var OUTER_ = '#e8e4db';
var YELLOW_ = '#fad06b';
var MINT_ = '#cdebd8';
var MUTED_ = '#6f6a61';
var DISPLAY_ = "Helvetica Neue,Helvetica,Arial,sans-serif";
var MONO_ = "'SF Mono',Menlo,Consolas,'Courier New',monospace";
var SCRIPT_ = "'Segoe Script','Bradley Hand','Apple Chancery',cursive";
var LOGO_URL_ = 'https://www.portal.dhandhaschool.com/logo-ink.png';

function pill_(text) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td style="background:' + MINT_ + ';border:2px solid ' + INK_ + ';border-radius:999px;padding:6px 14px;' +
    'font-family:' + MONO_ + ';font-size:10.5px;font-weight:700;letter-spacing:.1em;color:' + INK_ + ';">' + text + '</td>' +
    '</tr></table>';
}

function heading_(lineOne, lineTwo) {
  return '<h1 style="margin:0 0 6px;font-family:' + DISPLAY_ + ';font-size:40px;line-height:1.02;font-weight:800;' +
    'letter-spacing:-.02em;color:' + INK_ + ';">' + lineOne + '<br>' +
    '<span style="display:inline-block;background:' + YELLOW_ + ';padding:2px 8px;margin-top:6px;">' + lineTwo + '</span></h1>';
}

function script_(text) {
  return '<p style="margin:10px 0 0;font-family:' + SCRIPT_ + ';font-style:italic;font-size:17px;color:#d08a2c;">' + text + '</p>';
}

function emailWrapper(bodyHtml, badge) {
  badge = badge || '';
  return '' +
  '<div style="background:' + OUTER_ + ';padding:28px 14px;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%;max-width:600px;margin:0 auto;">' +
      '<tr><td style="padding:0 4px 4px 0;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:' + INK_ + ';">' +
          '<tr><td style="padding:0 4px 4px 0;">' +
            '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:' + PAPER_ + ';border:2px solid ' + INK_ + ';">' +
              '<tr><td style="padding:24px 28px 0;">' +
                '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>' +
                  '<td align="left" valign="middle">' + badge + '</td>' +
                  '<td align="right" valign="middle" style="width:140px;">' +
                    '<img src="' + LOGO_URL_ + '" width="140" height="35" alt="Dhandha School" ' +
                    'style="display:block;border:0;outline:none;text-decoration:none;width:140px;height:auto;max-width:140px;">' +
                  '</td>' +
                '</tr></table>' +
              '</td></tr>' +
              '<tr><td style="padding:20px 28px 26px;font-family:' + DISPLAY_ + ';font-size:15px;line-height:1.65;color:' + INK_ + ';">' +
                bodyHtml +
              '</td></tr>' +
            '</table>' +
          '</td></tr>' +
        '</table>' +
      '</td></tr>' +
      '<tr><td style="padding:16px 4px 0;font-family:' + DISPLAY_ + ';font-size:13px;color:' + MUTED_ + ';">' +
        'Questions? Reply to this mail. A human reads it.' +
        '<div style="margin-top:14px;font-family:' + MONO_ + ';font-size:11px;letter-spacing:.09em;color:' + MUTED_ + ';">' +
          'DHANDHA SCHOOL &middot; BANGALORE &middot; EST. 2026' +
          '<div style="margin-top:4px;"><a href="https://dhandhaschool.com" style="color:' + MUTED_ + ';">dhandhaschool.com</a></div>' +
        '</div>' +
      '</td></tr>' +
    '</table>' +
  '</div>';
}


function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Test function:
 * Run this once in the Apps Script editor to authorize UrlFetchApp permissions
 * and verify that emails arrive in your inbox.
 */
function sendTestEmail() {
  var testEmail = 'founder@dhandhaschool.com';
  var result = sendConfirmationEmail(testEmail, 'Gaurav');
  Logger.log('Test send result: ' + JSON.stringify(result));
}

/**
 * Backfill function:
 * Scans the sheet and sends confirmation emails to any previous applications where 'Email Sent' is not 'SENT'.
 */
function sendPendingConfirmationEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  var headers = data[0].map(function (h) { return String(h).trim(); });
  var emailColIdx = headers.indexOf('Email');
  var nameColIdx = headers.indexOf('Full Name');
  var sentColIdx = headers.indexOf('Email Sent');

  if (emailColIdx === -1) return;
  if (sentColIdx === -1) {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Email Sent');
    sentColIdx = sheet.getLastColumn() - 1;
  }

  var count = 0;
  for (var i = 1; i < data.length; i++) {
    var email = String(data[i][emailColIdx] || '').trim();
    var name = String(data[i][nameColIdx] || '').trim();
    var sent = String(data[i][sentColIdx] || '').trim();

    if (email && email.indexOf('@') !== -1 && sent !== 'SENT') {
      var res = sendConfirmationEmail(email, name);
      if (res.ok) {
        sheet.getRange(i + 1, sentColIdx + 1).setValue('SENT');
        Logger.log('Sent to row ' + (i + 1) + ': ' + email);
        count++;
      } else {
        sheet.getRange(i + 1, sentColIdx + 1).setValue('FAILED: ' + res.error);
        Logger.log('Failed row ' + (i + 1) + ': ' + email + ' - ' + res.error);
      }
      Utilities.sleep(600); // 600ms pause to respect Resend rate limit
    }
  }
  Logger.log('Finished sending pending emails. Total sent: ' + count);
}
