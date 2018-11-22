var GoogleSpreadsheet = require('google-spreadsheet');
var { promisify } = require('util');
var creds = require('./client_secret.json');
var fs = require('fs');
const SPREADSHEET_ID = '14HrBvsbbaFTwcf-CDRwKUNGxGxD3v-QyyIH-2xe-66E';
var jsonObjs = './e2e/helpers/list.json';

var suiteLinks = {};
var allSheetsLinks = {};
var getLinksArr = [];

async function getSheets() {

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await promisify(doc.useServiceAccountAuth)(creds)
  const info = await promisify(doc.getInfo)()
  //console.log(`Loaded doc: ` + info.title + ` by ` + info.author.email)

  const sheets = info.worksheets;
  return sheets;
}

async function fetchUpdatedSheet() {

  const sheets = await getSheets();
  for (i=0; i<sheets.length; i++){

    await getSheetData(i, sheets[i], sheets[i].title);
  }
}

async function getSheetData(index, sheet, sheetTitle){

  console.log(`\n   --> SHEET INDEX: ${index} => TITLE: ${sheetTitle}`);
  const slctdSheetCells = await promisify(sheet.getCells)({

    'min-row': 4,
    'max-row': 800,
    'min-col': 2,
    'max-col': 2,
    'return-empty': true

  });

  for (j=0; j<slctdSheetCells.length; j++){

    await getSuiteNames(sheet, slctdSheetCells, j);
  }

  /*allSheetsLinks[ sheetTitle ] = await [suiteLinks];
        suiteLinks = {};*/

  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);

    if(obj == {}){

      obj[ sheetTitle ] = suiteLinks;
      suiteLinks = {};
      writeToJsonFile(obj);
    }
    else {

      if(obj.hasOwnProperty(sheetTitle)){

        delete obj[ sheetTitle ];
        obj[ sheetTitle ] = suiteLinks;
        suiteLinks = {};
        writeToJsonFile(obj);
      }
      else {

        obj[ sheetTitle ] = suiteLinks;
        suiteLinks = {};
        writeToJsonFile(obj);
      }
    }
  });
}

async function writeToJsonFile(toWrite){

  await fs.writeFile(jsonObjs, JSON.stringify(toWrite, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    //console.log("The file was saved!");
  });
}

async function getSuiteNames(sheet, slctdSheetCells, j){

  var suiteName = slctdSheetCells[j].value;
  var testNameCol = slctdSheetCells[j].col + 1;
  var urlsCol = slctdSheetCells[j].col + 2;
  var valRow = slctdSheetCells[j].row + 2;

  if (suiteName !== ''){

    await getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName);
  }
}

async function getTestsData(sheet, valRow, testNameCol, urlsCol, suiteName){

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

  for (k=0; k<testNames.length; k++){

    if (testNames[k].value == '' || urls[k].value == ''){
      break;
    }
    await getLinks(testNames, urls, k);
  }

  suiteLinks[ suiteName ] = await getLinksArr;
  getLinksArr = [];
}

async function getLinks(testNames, urls, j){

  await getLinksArr.push({"testName":testNames[j].value, "url":urls[j].value});
}

async function checkIfSheetNameExistInJson(){

  const sheets = await getSheets();
  await fs.readFile(jsonObjs, 'utf8', function (err, data) {
    if (err) throw err;

    obj = JSON.parse(data);
    keys = Object.keys(obj);

    if (keys.length != sheets.length){

      for (i=0; i<sheets.length; i++) {
        index = keys.indexOf(sheets[i].title);
        console.log(`==> index ${index}`);
        if (index > -1) {
          keys.splice(index, 1);
        }
      }

      for (i=0; i<keys.length; i++){

        delete obj[ keys[i] ];
      }
      writeToJsonFile(obj);
    }
  });
}

async function sheets(){

  await fetchUpdatedSheet();
  await checkIfSheetNameExistInJson();
}

sheets();
