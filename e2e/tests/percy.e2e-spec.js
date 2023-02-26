const percySnapshot = require('@percy/webdriverio');
const helper = require("../helpers/helper.js");

let innerWidth;
let innerHeight;

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
  const baseURL = [];
  const baseEnv = browser.capabilities["custom:params"].baseEnv;

  for (const chartKey of Object.keys(ALL_SHEETS[SHEET_KEY])) {
    if (chartKey.match(/BASE URL/gi)) {

      for (const env of Object.values(ALL_SHEETS[SHEET_KEY][chartKey])) {
        if (!baseEnv) {
          baseURL.push(env);
          break;
        }
        if (baseEnv.includes(env.testName)) baseURL.push(env);
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
  var chartSelected = Object.values(ALL_SHEETS[SHEET_KEY][CHART_KEY]);
  if (!chartSelected.length) return;

  describe(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`, () => {
    for (let j = 0; j < chartSelected.length; j++) {
      testRunner(ENV, SHEET_KEY, URL, CHART_KEY, chartSelected[j], j + 1);
    }
  });
}

function testRunner(ENV, SHEET_KEY, URL, CHART_KEY, CHART_SELECTED, INDEX) {
  var _testName = CHART_SELECTED['testName'];
  var link = CHART_SELECTED['url'];
  var suiteName = `${SHEET_KEY} > ${CHART_KEY}`;

  var testName = `> ${INDEX} > ${ENV} > ${suiteName} > ${_testName}`.toLowerCase();
  URL = link == '/' ? URL : `${URL + link}`;

  it(testName, async () => {

    await browser.url(helper.resetUrl);
    await browser.pause(100);
    await browser.url(URL);
    if (!(CHART_KEY.match(/(Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('main_chart');
      await helper.visibilityOf('button_play');
    }
    await browser.pause(1000);

    var element = await helper.element(testName);
    if ((testName.match(/click/gi))) await helper.click(element);
    if ((testName.match(/refresh/gi))) await helper.refresh();
    if ((testName.match(/hover/gi))) await helper.hover(element);

    await browser.pause(3000);
    console.log(`\n${testName} > ${URL}`);

    var snapshot = `${suiteName} > ${_testName} > ${INDEX}`.toLowerCase();
    //snapshot = browser.name != undefined ? `${browser.name} > ${snapshot}` : snapshot;
    await percySnapshot(snapshot, {
      "widths": [innerWidth],
      "minHeight": innerHeight
    });
  });
}

beforeAll(async function visualView() {
  await helper.getSizeInfo();
  const visualView = await helper.viewPort();
  innerWidth = visualView.width;
  innerHeight = visualView.height;
});

async function startTest() {
  getSheetKeys();
}

startTest();