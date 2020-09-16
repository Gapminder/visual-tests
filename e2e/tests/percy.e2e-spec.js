const { percySnapshot } = require('@percy/protractor')
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser, Browser } = require("protractor");

var ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));

function getSheetKeys() {

  sheetKeys = Object.keys(ALL_SHEETS);
  for (var i = 0; i < sheetKeys.length; i++) {

    //console.log(`\n\n       ${i} SHEET IS :,${sheetKeys[i]}`);
    getEnvForFirstSuite(sheetKeys[i]);
  }
}

function getEnvForFirstSuite(SHEET_KEY) {

  const chartKeys = Object.keys(ALL_SHEETS[`${SHEET_KEY}`]);
  const baseURL = [];

  for (var j = 0; j < chartKeys.length; j++) {

    if (chartKeys[j] == 'BASE URL') {

      const chartSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${chartKeys[j]}`]);
      for (j = 0; j < chartSelcted.length; j++) {
        baseURL.push(chartSelcted[j]);
      }
      break;
    }
  }

  for (var i = 0; i < baseURL.length; i++) {

    const ENV = baseURL[i]['testName'];
    const URL = baseURL[i]['url'];

    describe(`${ENV} > ${SHEET_KEY}`, () => {

      firstSuiteRunner(SHEET_KEY, ENV, URL);
    });
  }
}

function firstSuiteRunner(SHEET_KEY, ENV, URL) {

  const CHART_KEY = Object.keys(ALL_SHEETS[`${SHEET_KEY}`]);
  for (var j = 0; j < CHART_KEY.length; j++) {

    if (CHART_KEY[j] == 'BASE URL') {
      continue;
    }
    secSuiteRunner(SHEET_KEY, ENV, URL, CHART_KEY[j], j);
  }
}

function secSuiteRunner(SHEET_KEY, ENV, URL, CHART_KEY, CHART_INDEX) {

  //console.log(`\n       ${CHART_INDEX} CHART IS :,${CHART_KEY}`);
  const chartSelcted = Object.values(ALL_SHEETS[`${SHEET_KEY}`][`${CHART_KEY}`]);
  describe(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`, () => {

    //console.log(`${ENV} > ${SHEET_KEY} > ${CHART_KEY}`);
    for (j = 0; j < chartSelcted.length; j++) {

      testRunner(SHEET_KEY, CHART_KEY, ENV, URL, chartSelcted[j], j);
    }
  });
}

function testRunner(SHEET_KEY, CHART_KEY, ENV, URL, chartSelcted, index) {

  var testName = chartSelcted['testName'];
  var link = chartSelcted['url'];
  index = index + 1;
  CHART_KEY = CHART_KEY.toLowerCase();

  //console.log(`       ${ENV} > ${SHEET_KEY} > ${CHART_KEY} > ${testName}`);

  it(`${ENV} > ${SHEET_KEY} > ${CHART_KEY} > ${testName}`, async () => {

    console.log(`> ${index} > ${testName} > ${URL + link}`);
    await browser.get(`${URL + link}`);

    if (!(CHART_KEY.match(/(EMBEDDED|Dollar|Gapminder)/gi))) {
      await helper.visibilityOf('mainChart');
      await helper.visibilityOf('buttonPlay');
    }

    await browser.sleep(4000);
    await percySnapshot(`${CHART_KEY}__${index}`);
  });
}

getSheetKeys();
