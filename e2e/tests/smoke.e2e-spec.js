const { percySnapshot } = require('@percy/protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

const ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
const SHEET_KEYS = Object.keys(ALL_SHEETS);

let browserWidth;
let browserHeight;
let innerWidth;
let innerHeight;

function getSheetKeys() {
  for (let i = 0; i < SHEET_KEYS.length; i++) {
    getEnvForSheets(SHEET_KEYS[i]);
  }
}

function getEnvForSheets(SHEET_KEY) {

  var chartKeys = Object.keys(ALL_SHEETS[`${SHEET_KEY}`]);
  var baseURL = [];

  for (let i = 0; i < chartKeys.length; i++) {

    if (chartKeys[i].match(/BASE URL/gi)) {

      const envSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${chartKeys[i]}`]);
      for (let j = 0; j < envSelcted.length; j++) {
        baseURL.push(envSelcted[j]);
      }
      break;
    }
  }

  for (i = 0; i < baseURL.length; i++) {

    var ENV = baseURL[i]['testName'];
    var URL = baseURL[i]['url'];

    getSuiteData(ENV, SHEET_KEY, URL);
  }
}

function getSuiteData(ENV, SHEET_KEY, URL) {

  var chartKeys = Object.keys(ALL_SHEETS[`${SHEET_KEY}`]);
  for (let j = 0; j < chartKeys.length; j++) {

    if (chartKeys[j].match(/BASE URL/gi)) {
      continue;
    }
    suiteRunner(ENV, SHEET_KEY, URL, chartKeys[j]);
  }
}

function suiteRunner(ENV, SHEET_KEY, URL, CHART_KEY) {

  var chartSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${CHART_KEY}`]);
  describe(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`, () => {

    for (let j = 0; j < chartSelcted.length; j++) {
      testRunner(ENV, SHEET_KEY, URL, CHART_KEY, chartSelcted[j], j + 1);
    }
  });
}

function testRunner(ENV, SHEET_KEY, URL, CHART_KEY, CHART_SELECTED, INDEX) {

  var testName = CHART_SELECTED['testName'];
  var link = CHART_SELECTED['url'];
  var suiteName = `${ENV} > ${SHEET_KEY} > ${CHART_KEY}`.toLowerCase();

  testName = `> ${INDEX} > ${suiteName} > ${testName}`;
  URL = `${URL + link}`;

  it(testName, async () => {

    await browser.get(URL);
    if (!(CHART_KEY.match(/(EMBEDDED|Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('mainChart');
      await helper.visibilityOf('buttonPlay');
    }

    await browser.sleep(4000);
    console.log(`\n${testName} > ${URL}`);

    var snapshot = `${suiteName} > ${INDEX}`;
    snapshot = browser.name != undefined ? `${browser.name} > ${snapshot}` : snapshot;

    await percySnapshot(`${browser.name} > ${suiteName} > ${INDEX}`, {
      "widths": [innerWidth],
      "minHeight": innerHeight
    });
  });
}

async function getSizeInfo() {
  const browserSize = await helper.screenSize();
  const visualView = await helper.viewPort();
  
  browserWidth = browserSize.width;
  browserHeight = browserSize.height;
  innerWidth = visualView.width;
  innerHeight = visualView.height;

  console.log(`\n   --> Session: ${browser.name}`);
  console.log(`       browserWidth: ${browserWidth}`);
  console.log(`       browserHeight: ${browserHeight}`);
  console.log(`       innerWidth: ${innerWidth}`);
  console.log(`       innerHeight: ${innerHeight}`);
}

function startTest() {
  getSizeInfo();
  getSheetKeys();
}

startTest();
