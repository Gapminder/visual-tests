const { percySnapshot } = require('@percy/protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

const ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
const SHEET_KEYS = Object.keys(ALL_SHEETS);

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