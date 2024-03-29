const Eyes = require("eyes.selenium").Eyes;
const helper = require("../helpers/helper.js");
const fs = require('fs');

const eyes = new Eyes();
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
eyes.setBatch(`${browser.name}`);

const ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
const SHEET_KEYS = Object.keys(ALL_SHEETS);

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
  var chartSelected = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${CHART_KEY}`]);
  if (!chartSelected.length) return;

  describe(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`, () => {

    for (let j = 0; j < chartSelected.length; j++) {
      testRunner(ENV, SHEET_KEY, URL, CHART_KEY, chartSelected[j], j + 1);
    }
  });
}

function testRunner(ENV, SHEET_KEY, URL, CHART_KEY, CHART_SELECTED, INDEX) {

  var testName = CHART_SELECTED['testName'];
  var link = CHART_SELECTED['url'];
  var suiteName = `${ENV} > ${SHEET_KEY} > ${CHART_KEY}`.toLowerCase();

  testName = `> ${INDEX} > ${suiteName} > ${testName}`;
  URL = link == '/' ? URL : `${URL + link}`;

  it(testName, async () => {

    await browser.url(helper.resetUrl);
    await browser.pause(100);

    eyes.open(browser, `${ENV} > ${SHEET_KEY}`, testName);

    await browser.url(URL);
    if (!(CHART_KEY.match(/(Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('mainChart');
      await helper.visibilityOf('buttonPlay');
    }

    await browser.pause(4000);
    console.log(`\n${testName} > ${URL}`);

    var snapshot = `${suiteName} > ${INDEX}`;
    eyes.checkWindow(snapshot);
    eyes.close();
  });
}

getSheetKeys();