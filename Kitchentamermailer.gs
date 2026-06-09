// Kitchen Tamer — GAS Email Endpoint
// Deploy as: Extensions > Apps Script > Deploy > New Deployment
//   Type: Web app
//   Execute as: Me
//   Who has access: Anyone
// Copy the Web App URL into Kitchen Tamer Settings.

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var to       = payload.to;
    var subject  = payload.subject  || 'Kitchen Tamer Meal Plan';
    var htmlBody = payload.htmlBody || '';
    var plainBody = payload.plainBody || '';

    if (!to) {
      return jsonResponse({ status: 'error', message: 'Missing "to" field.' });
    }

    GmailApp.sendEmail(to, subject, plainBody, {
      htmlBody: htmlBody,
      name: 'Kitchen Tamer'
    });

    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// Handle preflight OPTIONS requests (CORS)
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Kitchen Tamer mailer is running.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
