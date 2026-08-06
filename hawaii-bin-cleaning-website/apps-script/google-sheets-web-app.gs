/**
 * Hawaii Bin Cleaning native website form → Google Sheets
 * Matches the Founding Member Interest List fields.
 */

const SPREADSHEET_ID = '1PyIezZ0dCBFFLdjuHTehYTDU4E-6sOVnyPfHPNwOkK4';

// Use your existing Google Form response tab if it exists. If not, this tab will be created.
const PREFERRED_SHEET_NAMES = [
  'Form Responses 1',
  'Founders Discount Responses',
  'Founding Member Interest List'
];

const HEADERS = [
  'Timestamp',
  'Full Name',
  'Email',
  'Phone Number',
  'What is your ZIP Code?',
  'How Many Trash/Recycling Bins Would You Like Cleaned?',
  'What Types of Bins Do You Have?',
  'How Interested Are You In This Service?',
  'Which Service Frequency Sounds Most Appealing?',
  'What Interests You Most?',
  'Other',
  'Additional Comments',
  'Submitted At',
  'Submission Page',
  'Submission URL',
  'User Agent'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const params = e && e.parameter ? e.parameter : {};
    const allParams = e && e.parameters ? e.parameters : {};

    // Honeypot spam protection. Real visitors will not fill this hidden field.
    if (params.company) {
      return jsonResponse({ result: 'ignored' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getResponseSheet_(ss);
    ensureHeaders_(sheet);

    const row = [
      new Date(),
      params.full_name || '',
      params.email || '',
      params.phone || '',
      params.zip || '',
      params.bin_count || '',
      multiValue_(allParams, 'bin_type'),
      params.interest_level || '',
      params.service_frequency || '',
      multiValue_(allParams, 'interests'),
      params.interests_other || '',
      params.additional_comments || '',
      params.submitted_at || '',
      params.submission_page || '',
      params.submission_url || '',
      params.user_agent || ''
    ];

    sheet.appendRow(row);
    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({
      result: 'error',
      message: error && error.message ? error.message : String(error)
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({
    result: 'ready',
    message: 'Hawaii Bin Cleaning form endpoint is running.'
  });
}

function getResponseSheet_(spreadsheet) {
  for (const name of PREFERRED_SHEET_NAMES) {
    const sheet = spreadsheet.getSheetByName(name);
    if (sheet) return sheet;
  }
  return spreadsheet.insertSheet('Founders Discount Responses');
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = currentHeaders.some(String);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function multiValue_(parameters, key) {
  const value = parameters && parameters[key];
  if (!value) return '';
  return Array.isArray(value) ? value.join(', ') : String(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
