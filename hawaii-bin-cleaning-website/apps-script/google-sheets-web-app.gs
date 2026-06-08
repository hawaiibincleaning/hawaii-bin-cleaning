/**
 * Hawaii Bin Cleaning native website form → Google Sheets
 *
 * Setup:
 * 1) Open your Google Sheet.
 * 2) Extensions → Apps Script.
 * 3) Paste this entire file into Code.gs and save.
 * 4) Deploy → New deployment → Web app.
 * 5) Execute as: Me.
 * 6) Who has access: Anyone.
 * 7) Copy the Web App URL and paste it into:
 *    assets/js/site-config.js → googleAppsScriptEndpoint
 */

const SPREADSHEET_ID = '1PyIezZ0dCBFFLdjuHTehYTDU4E-6sOVnyPfHPNwOkK4';
const SHEET_NAME = 'Founders Discount Responses';

const HEADERS = [
  'Timestamp',
  'Submitted At',
  'Submission Page',
  'Submission URL',
  'First Name',
  'Last Name',
  'Email',
  'Phone',
  'Service Address',
  'City / Neighborhood',
  'ZIP Code',
  'Property Type',
  'Bin Count',
  'Preferred Service Frequency',
  'Pickup Day',
  'Bin Types',
  'Pressure Washing Add-Ons',
  'HOA / Community',
  'Source',
  'Notes',
  'SMS Consent',
  'Contact Consent',
  'User Agent'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const params = e && e.parameter ? e.parameter : {};
    const allParams = e && e.parameters ? e.parameters : {};

    // Basic spam trap: the website includes a hidden field named "company".
    if (params.company) {
      return jsonResponse({ result: 'ignored' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getOrCreateSheet_(ss, SHEET_NAME);
    ensureHeaders_(sheet);

    const row = [
      new Date(),
      params.submitted_at || '',
      params.submission_page || '',
      params.submission_url || '',
      params.first_name || '',
      params.last_name || '',
      params.email || '',
      params.phone || '',
      params.address || '',
      params.city_neighborhood || '',
      params.zip || '',
      params.property_type || '',
      params.bin_count || '',
      params.service_frequency || '',
      params.pickup_day || '',
      multiValue_(allParams, 'bin_type'),
      multiValue_(allParams, 'pressure_add_ons'),
      params.hoa_community || '',
      params.source || '',
      params.message || '',
      params.sms_consent || '',
      params.consent || '',
      params.user_agent || ''
    ];

    sheet.appendRow(row);
    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', message: error && error.message ? error.message : String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse({ result: 'ready', message: 'Hawaii Bin Cleaning form endpoint is running.' });
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
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
