var GoogleSpreadsheet = require('google-spreadsheet');
var { promisify } = require('util');
var creds = require('./client_secret.json');
var fs = require('fs');
const SPREADSHEET_ID = '14HrBvsbbaFTwcf-CDRwKUNGxGxD3v-QyyIH-2xe-66E';

const suiteLinks = {};
var getLinksArr = [];

async function getIndexSheet(sheetIndex) {

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
  await promisify(doc.useServiceAccountAuth)(creds)
  const info = await promisify(doc.getInfo)()
  //console.log(`Loaded doc: ` + info.title + ` by ` + info.author.email)

  const sheet = info.worksheets[sheetIndex];

  return sheet;
}

async function getCellData() {

  const sheet = await getIndexSheet(0);
  const cells = await promisify(sheet.getCells)({

    'min-row': 6,
    'max-row': 800,
    'min-col': 2,
    'max-col': 2,
    'return-empty': true

  });

  for (i=0; i<cells.length; i++){
    await getRequiredData(sheet, cells, i);
  }
}

async function getRequiredData(sheet, cells, i){

  var suiteName = cells[i].value;
  var minCol = cells[i].col + 1;
  var maxCol = cells[i].col + 2;
  var minRow = cells[i].row + 2;

  if (suiteName !== ''){

    getChartRows(sheet, minRow, minCol, maxCol, suiteName);
  }
}

async function getChartRows(sheet, minRow, minCol, maxCol, suiteName){

  const testNames = await promisify(sheet.getCells)({
    'min-row': minRow,
    //'max-row': 11,
    'min-col': minCol,
    'max-col': minCol,
    'return-empty': true
  });

  const urls = await promisify(sheet.getCells)({
    'min-row': minRow,
    //'max-row': 11,
    'min-col': maxCol,
    'max-col': maxCol,
    'return-empty': true
  });

  for (j=0; j<testNames.length; j++){

    if (testNames[j].value == ''){
      break;
    }
    await getLinks(testNames, urls, j);
  }

  suiteLinks[ suiteName ] = await getLinksArr;

  fs.writeFile("./e2e/helpers/list.json", JSON.stringify(suiteLinks, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    //console.log("The file was saved!");
  });
  getLinksArr = [];
}

async function getLinks(testNames, urls, j){

  await getLinksArr.push({"testName":testNames[j].value, "url":urls[j].value});
  //await getLinksArr.push(testNames[j].value);
}

exports.allChartsLinks = allChartsLinks = async function(){

  /*var links = await getCellData().then(function(){
    var listLinks = JSON.parse(fs.readFileSync("./e2e/helpers/list.json"));
    return listLinks;
  });
  return links;*/

  const sheet = await getIndexSheet(0);
  const cells = await promisify(sheet.getCells)({

    'min-row': 5,
    'max-row': 5,
    'min-col': 3,
    'max-col': 3,
    'return-empty': false

  });
  var refreshVal = cells[0].value;
  var afterRefreshVal = cells[0];
  console.log(`   --> REFRESH SHEET IS :,${refreshVal}`);

  if (refreshVal == 'TRUE'){
    console.log(`       REFRESHING... `);

    var links = await getCellData().then(function(){

      console.log(`       REFRESHING IS COMPLETE!`);
      var listLinks = JSON.parse(fs.readFileSync("./e2e/helpers/list.json"));
      return listLinks;
    });

    afterRefreshVal.value = 'FALSE';
    await afterRefreshVal.save();
    console.log(`   --> SET REFRESH SHEET's FLAG BACK TO :,${afterRefreshVal.value}`);

    return links;
  }
  /*else {

    var listLinks = JSON.parse(fs.readFileSync("./e2e/helpers/list.json"));
    return listLinks;
  }*/
}

allChartsLinks();
