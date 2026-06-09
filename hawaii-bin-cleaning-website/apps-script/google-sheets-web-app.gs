/**
 * Hawaii Bin Cleaning native website form → Google Sheets
 * Founding Member Interest List
 */

const SPREADSHEET_ID = '1PyIezZ0dCBFFLdjuHTehYTDU4E-6sOVnyPfHPNwOkK4';
const SHEET_NAME = 'Founding Member Interest List';

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

    // Honeypot spam check. This hidden field should stay empty.
    if (params.company) {
      return jsonResponse({ result: 'ignored' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);
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
      params.other_interest || '',
      params.additional_comments || '',
      params.submitted_at || '',
      params.submission_page || '',
      params.submission_url || '',
      params.user_agent || ''
    ];

    sheet.appendRow(row);

    return jsonResponse({
      result: 'success',
      message: 'Submission saved successfully.'
    });
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

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaders_(sheet) {
  const currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = currentHeaders.some(function(header) {
    return String(header).trim() !== '';
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function multiValue_(parameters, key) {
  const value = parameters && parameters[key];

  if (!value) {
    return '';
  }

  return Array.isArray(value) ? value.join(', ') : String(value);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
