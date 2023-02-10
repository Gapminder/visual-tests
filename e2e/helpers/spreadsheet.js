if(!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)  console.error("missing env variable GOOGLE_SERVICE_ACCOUNT_EMAIL");
if(!process.env.GOOGLE_PRIVATE_KEY) console.error("missing env variable GOOGLE_PRIVATE_KEY");
if(!process.env.SPREADSHEET_ID) console.error("missing env variable SPREADSHEET_ID");

const { GoogleSpreadsheet } = require('google-spreadsheet');
//const { promisify } = require('util');
const fs = require('fs');
const jsonObjs = './e2e/testData.json';
const creds = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n')
};

const COLUMN_INDEX = {
  SUITE_NAME: 1,
  FILTER: 2,
  TEST_NAME: 3,
  URL: 4
};
const START_ROW = 4;


var suiteLinks = {};
var allSheetsLinks = {};

async function getSheets() {
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  console.log(`Loaded doc: ` + doc.title)

  const sheets = doc.sheetsByIndex;
  return sheets;
}

async function fetchUpdatedSheet() {

  let suite = browser.suite;
  let title = "";

  const sheets = await getSheets();
  for (i = 0; i < sheets.length; i++) {
    title = sheets[i].title;

    if (suite.match(/(pix_diff)/gi) && !title.match(/(smoke)/gi)) {
      await getSheetData(i, sheets[i], title);

    } else if (suite == 'smoke' && title.match(/(smoke)/gi)) {
      await getSheetData(i, sheets[i], title);

    } else if (suite == title) {
      await getSheetData(i, sheets[i], title);
      break;
    }
  }
}

async function getSheetData(index, sheet, sheetTitle) {

  console.log(`   --> SHEET INDEX: ${index} => TITLE: ${sheetTitle}`);
  await sheet.loadCells(
    `A${START_ROW}:G${sheet.rowCount}`
  );



  for (j = START_ROW - 1; j < sheet.rowCount; j++) {
    getSuiteNames(sheet, j);
  }

  /*allSheetsLinks[ sheetTitle ] = await [suiteLinks];
        suiteLinks = {};*/

  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    
    delete obj[sheetTitle];
    obj[sheetTitle] = suiteLinks;
    suiteLinks = {};
    writeToJsonFile(obj);
  });
}

async function writeToJsonFile(toWrite) {

  await fs.writeFile(jsonObjs, JSON.stringify(toWrite, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    //console.log("The file was saved!");
  });
}

function getSuiteNames(sheet, j) {
  var suiteName = sheet.getCell(j, COLUMN_INDEX.SUITE_NAME).value;
  if (suiteName) {
    console.log(suiteName);
    var testNameCol = COLUMN_INDEX.TEST_NAME;
    var urlsCol = COLUMN_INDEX.URL;
    var valRow = j + 2;  
    getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName);
  }
}

function getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName) {

  const linksArr = [];
  const exclusiveLinksArr = [];

  for (k = valRow; k < sheet.rowCount; k++) {
    const nextSuiteName = sheet.getCell(k, COLUMN_INDEX.SUITE_NAME).value;
    if (nextSuiteName) break;

    const testName = sheet.getCell(k, COLUMN_INDEX.TEST_NAME).value;
    const url = sheet.getCell(k, COLUMN_INDEX.URL).value;
    const filter = ('' + sheet.getCell(k, COLUMN_INDEX.FILTER).value).toLowerCase();

    if (!testName || !url || ['skip','skipped'].includes(filter)) {
      continue;
    }

    if (['only', 'exclusive_test', 'exclusive']) {
      exclusiveLinksArr.push({testName, url});
    } else {
      linksArr.push({testName, url});
    }
  }

  suiteLinks[suiteName] = exclusiveLinksArr.length ? exclusiveLinksArr : linksArr;
}

async function checkIfSheetNameExistInJson() {

  const sheets = await getSheets();
  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;

    obj = JSON.parse(data);
    keys = Object.keys(obj);

    if (keys.length != sheets.length) {

      for (i = 0; i < sheets.length; i++) {
        index = keys.indexOf(sheets[i].title);
        if (index > -1) {
          keys.splice(index, 1);
        }
      }

      for (i = 0; i < keys.length; i++) {

        delete obj[keys[i]];
      }
      writeToJsonFile(obj);
    }
  });
}

async function deleteAllSheetsFromJson() {

  const sheets = await getSheets();
  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;

    obj = JSON.parse(data);
    for (var i = 0; i < sheets.length; i++) {
      delete obj[sheets[i].title];
    }
    writeToJsonFile(obj);
  });
}

exports.sheets = async () => {
  await deleteAllSheetsFromJson();
  await fetchUpdatedSheet();
  await checkIfSheetNameExistInJson();
}
