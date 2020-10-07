const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const fs = require('fs');
const jsonObjs = './e2e/testData.json';
const creds = {
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', '\g'), '\n')
};

var suiteLinks = {};
var allSheetsLinks = {};
var getLinksArr = [];

async function getSheets() {

  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
  await promisify(doc.useServiceAccountAuth)(creds)
  const info = await promisify(doc.getInfo)()
  //console.log(`Loaded doc: ` + info.title + ` by ` + info.author.email)

  const sheets = info.worksheets;
  return sheets;
}

async function fetchUpdatedSheet() {

  let suite = browser.suite;
  let title = "";

  const sheets = await getSheets();
  for (i = 0; i < sheets.length; i++) {
    title = sheets[i].title;

    if (suite.match(/(smoke)/gi) && title.match(/(smoke)/gi)) {
      await getSheetData(i, sheets[i], title);

    } else if (!(suite.match(/(smoke)/gi) || title.match(/(smoke)/gi))) {
      await getSheetData(i, sheets[i], title);
    }
  }
}

async function getSheetData(index, sheet, sheetTitle) {

  console.log(`   --> SHEET INDEX: ${index} => TITLE: ${sheetTitle}`);
  const slctdSheetCells = await promisify(sheet.getCells)({

    'min-row': 4,
    'max-row': 800,
    'min-col': 2,
    'max-col': 2,
    'return-empty': true

  });

  for (j = 0; j < slctdSheetCells.length; j++) {
    await getSuiteNames(sheet, slctdSheetCells, j);
  }

  /*allSheetsLinks[ sheetTitle ] = await [suiteLinks];
        suiteLinks = {};*/

  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);

    if (obj == {}) {

      obj[sheetTitle] = suiteLinks;
      suiteLinks = {};
      writeToJsonFile(obj);
    }
    else {

      if (obj.hasOwnProperty(sheetTitle)) {

        delete obj[sheetTitle];
        obj[sheetTitle] = suiteLinks;
        suiteLinks = {};
        writeToJsonFile(obj);
      }
      else {

        obj[sheetTitle] = suiteLinks;
        suiteLinks = {};
        writeToJsonFile(obj);
      }
    }
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

async function getSuiteNames(sheet, slctdSheetCells, j) {

  var suiteName = slctdSheetCells[j].value;
  var testNameCol = slctdSheetCells[j].col + 1;
  var urlsCol = slctdSheetCells[j].col + 2;
  var valRow = slctdSheetCells[j].row + 2;

  if (suiteName !== '') {

    await getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName);
  }
}

async function getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName) {

  const testNames = await promisify(sheet.getCells)({
    'min-row': valRow,
    //'max-row': 11,
    'min-col': testNameCol,
    'max-col': testNameCol,
    'return-empty': true
  });

  const urls = await promisify(sheet.getCells)({
    'min-row': valRow,
    //'max-row': 11,
    'min-col': urlsCol,
    'max-col': urlsCol,
    'return-empty': true
  });

  for (k = 0; k < testNames.length; k++) {

    if ((testNames[k].value == '' || urls[k].value == '') && (testNames[k + 1].value != '' || urls[k + 1].value != '')) {
      continue;
    }
    else if ((testNames[k].value == '' || urls[k].value == '') && (testNames[k + 1].value == '' || urls[k + 1].value == '')) {
      break;
    }
    else if (testNames[k].value == '' && urls[k].value == '') {
      break;
    }
    await getLinks(testNames, urls, k);
  }

  suiteLinks[suiteName] = await getLinksArr;
  getLinksArr = [];
}

async function getLinks(testNames, urls, j) {

  await getLinksArr.push({ "testName": testNames[j].value, "url": urls[j].value });
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
