const _ = require("lodash");
const fs = require("fs");
const { google } = require("googleapis");


// SNooker Plus Sheet
const SHEET_ID =
  process.env.SHEET_ID ?? "1Bcl1EVN-7mXUP7M1FL9TBB5v4O4AFxGTVB6PwqOn9ss";

const credentials = JSON.parse(
  fs.readFileSync("google-credentials.json", "utf-8")
);

const {
  client_secret: clientSecret,
  client_id: clientId,
  redirect_uris: redirectUris,
} = credentials.web;

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUris[0]
);

const token = fs.readFileSync("google-oauth-token.json", "utf-8");
oAuth2Client.setCredentials(JSON.parse(token));

/**
 * Read a spreadsheet.
 * @param {string} spreadsheetId
 * @param {string} range
 * @returns {Promise.<Array>}
 */
exports.read = async (range, spreadsheetId = SHEET_ID) => {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  return sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range,
    })
    .then(_.property("data.values"));
};

/**
 * Append content to the next line of a spreadsheet on specified range.
 * @param {string} spreadsheetId
 * @param {string} range
 * @returns {Promise}
 */
exports.append = async (range, values, spreadsheetId = SHEET_ID) => {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  return sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
};

/**
 * Update cells on a spreadsheet.
 * @param {string} spreadsheetId
 * @param {string} range
 * @returns {Promise}
 */
exports.update = async (range, values, spreadsheetId = SHEET_ID) => {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  return sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    resource: { values },
  });
};

/**
 * Create a new spreadsheet.
 * @param {string} spreadsheetId
 * @param {string} range
 * @returns {Promise}
 */
exports.create = async (title) => {
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  return sheets.spreadsheets.create({
    resource: {
      properties: { title },
    },
  });
};
