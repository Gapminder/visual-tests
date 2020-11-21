const { percySnapshot } = require('@percy/protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

const ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
const SHEET_KEYS = Object.keys(ALL_SHEETS);

let innerWidth;
let innerHeight;
let singleChart;

function getSheetKeys() {
  for (const sheetKey of SHEET_KEYS) {
    getEnvForSheets(sheetKey);
  }
}

function getEnvForSheets(SHEET_KEY) {
  var baseURL = [];

  for (const chartKey of Object.keys(ALL_SHEETS[`${SHEET_KEY}`])) {
    if (chartKey.match(/BASE URL/gi)) {

      for (const env of Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${chartKey}`])) {
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
  var chartKeys = Object.keys(ALL_SHEETS[`${SHEET_KEY}`]);

  for (const chartKey of chartKeys) {
    if (chartKey.match(/BASE URL/gi)) continue;

    var chartSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${chartKey}`]);
    for (const item of chartSelcted) {
      if (item.testName.match(/exclusive_test/gi)) {
        singleChart = {};
        singleChart[chartKey] = chartSelcted.filter(function (el) { return el.testName == item.testName; });
        break;
      }
    }
  }

  if (singleChart != null) chartKeys = Object.keys(singleChart);
  for (const chartKey of chartKeys) {
    if (chartKey.match(/BASE URL/gi)) continue;
    suiteRunner(ENV, SHEET_KEY, URL, chartKey);
  }
}

function suiteRunner(ENV, SHEET_KEY, URL, CHART_KEY) {
  var chartSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${CHART_KEY}`]);
  if (singleChart != null) chartSelcted = Object.values(singleChart[CHART_KEY]);

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

  testName = `> ${INDEX} > ${suiteName} > ${testName}`.toLowerCase();
  URL = link == '/' ? URL : `${URL + link}`;

  it(testName, async () => {

    await browser.get(URL);
    if (!(CHART_KEY.match(/(EMBEDDED|Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('main_chart');
      await helper.visibilityOf('button_play');
    }
    await browser.sleep(1000);

    var element = await helper.element(testName);
    if ((testName.match(/click/gi))) await helper.click(element);
    if ((testName.match(/refresh/gi))) await helper.refresh();
    if ((testName.match(/hover/gi))) await helper.hover(element);

    await browser.sleep(3000);
    console.log(`\n${testName} > ${URL}`);

    var snapshot = `${suiteName} > ${INDEX}`;
    //snapshot = browser.name != undefined ? `${browser.name} > ${snapshot}` : snapshot;
    await percySnapshot(snapshot, {
      "widths": [innerWidth],
      "minHeight": innerHeight
    });
  });
}

async function visualView() {
  await helper.getSizeInfo();
  const visualView = await helper.viewPort();
  innerWidth = visualView.width;
  innerHeight = visualView.height;
}

function startTest() {
  visualView();
  getSheetKeys();
}

startTest();