const PixDiff = require('pix-diff');
const helper = require("../helpers/helper.js");
const { browser } = require("protractor");

let ALL_SHEETS = helper.ALL_SHEETS;
let SHEET_KEYS;

function getSheetKeys() {
  var onlyTest = helper.onlyTest();
  var skipTest = helper.skipTest();

  if (!(helper.isEmptyObj(onlyTest) && helper.isEmptyObj(skipTest))) ALL_SHEETS = onlyTest;
  if (helper.isEmptyObj(onlyTest) && !helper.isEmptyObj(skipTest)) ALL_SHEETS = helper.removedSkipTest(skipTest);

  SHEET_KEYS = Object.keys(ALL_SHEETS);
  console.log("\n   --> SHEETS GOT FOR TEST EXECUTION ARE: " + JSON.stringify(SHEET_KEYS));
  helper.totalTests(ALL_SHEETS);
  for (const sheetKey of SHEET_KEYS) {
    getEnvForSheets(sheetKey);
  }
}

function getEnvForSheets(SHEET_KEY) {
  var baseURL = [];

  for (const chartKey of Object.keys(ALL_SHEETS[SHEET_KEY])) {
    if (chartKey.match(/BASE URL/gi)) {

      for (const env of Object.values(ALL_SHEETS[SHEET_KEY][chartKey])) {
        baseURL.push(env);
      }
      break;
    }
  }

  for (const item of baseURL) {
    getSuiteData(SHEET_KEY, item.testName, item.url);
  }
}

function getSuiteData(SHEET_KEY, ENV, URL) {
  var chartKeys = Object.keys(ALL_SHEETS[SHEET_KEY]);

  for (const chartKey of chartKeys) {
    if (chartKey.match(/BASE URL/gi)) continue;
    suiteRunner(ENV, SHEET_KEY, URL, chartKey);
  }
}

function suiteRunner(ENV, SHEET_KEY, URL, CHART_KEY) {
  var chartSelcted = Object.values(ALL_SHEETS[SHEET_KEY][CHART_KEY]);

  describe(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`, () => {
    for (let j = 0; j < chartSelcted.length; j++) {
      testRunner(ENV, SHEET_KEY, URL, CHART_KEY, chartSelcted[j], j + 1);
    }
  });
}

function testRunner(ENV, SHEET_KEY, URL, CHART_KEY, CHART_SELECTED, INDEX) {

  var testName = CHART_SELECTED['testName'];
  var link = CHART_SELECTED['url'];
  var suiteName = `${ENV} > ${SHEET_KEY} > ${CHART_KEY}`;

  testName = `> ${INDEX} > ${suiteName} > ${testName}`;
  URL = link == '/' ? URL : `${URL + link}`;

  it(testName, async () => {

    await browser.get(URL);
    if (!(CHART_KEY.match(/(EMBEDDED|Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('main_chart');
      await helper.visibilityOf('button_play');
    }

    await browser.sleep(4000);
    console.log(`\n${testName} > ${URL}`);

    var snapshot = `${suiteName} > ${INDEX}`.toLowerCase();
    //snapshot = browser.name != undefined ? `${browser.name} > ${snapshot}` : snapshot;
    snapshot = snapshot.replace(/>/g, '_');
    await browser.pixDiff.checkScreen(`${snapshot}`).then(result => {
      if (result.code != 5) {
        expect(URL).toContain("identical screenshot");

      } else {
        expect(result.code).toEqual(PixDiff.RESULT_IDENTICAL);
      }
    });
  });
}

function startTest() {
  helper.getSizeInfo();
  getSheetKeys();
}

startTest();