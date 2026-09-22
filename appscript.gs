/**
 * COMPLETE Code.gs for the Dhandha School Applications sheet.
 * Replace the entire contents of Code.gs with this file, then:
 * Deploy > Manage deployments > Edit > New version > Deploy.
 *
 * It holds BOTH halves:
 *   doPost — what the website calls to append an application (with payment_id & status: paid).
 *   doGet  — what the admin portal reads the queue through. Read-only, token-guarded.
 */

var SHEET_NAME = 'Applications';
var READ_TOKEN = 'DhandhaSchoolLMS';

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
      // Auto-migrate: check if 'Payment ID' column is missing from existing sheet
      var lastCol = sheet.getLastColumn();
      if (lastCol > 0) {
        var currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
        if (currentHeaders.indexOf('Payment ID') === -1) {
          var statusIdx = currentHeaders.indexOf('Status');
          if (statusIdx !== -1) {
            sheet.insertColumnBefore(statusIdx + 1);
            sheet.getRange(1, statusIdx + 1).setValue('Payment ID');
          } else {
            sheet.getRange(1, lastCol + 1).setValue('Payment ID');
          }
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
    ]);

    return jsonOut({ ok: true, status: statusVal, payment_id: data.payment_id || null });

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
