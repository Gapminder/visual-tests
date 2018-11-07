const Eyes = require("eyes.selenium").Eyes;
const helper = require("./../helpers/helper.js");
const fs = require('fs');

var pad0 = function(arg) {
  return (arg < 10 ? "0" : "") + arg;
}

var today = new Date();
var date = today.getUTCFullYear() + '-' + pad0(today.getUTCMonth() + 1) + '-' + pad0(today.getUTCDate());
var time = pad0(today.getUTCHours()) + ":" + pad0(today.getUTCMinutes()) + ":" + pad0(today.getUTCSeconds());

var batchName = date + " " + time + " " + process.env.TRAVIS_JOB_NUMBER;

const eyes = new Eyes();
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
eyes.setBatch(batchName);

var ALL_CHARTS = JSON.parse(fs.readFileSync("./e2e/helpers/list.json"));
var ALL_CHARTS_KEYS = [];

function completeTest(){

  getChartsKey();
  for (var i = 0; i < ALL_CHARTS_KEYS.length; i++) {

    suiteRunner(ALL_CHARTS_KEYS[i]);
  }
}

function getChartsKey(){

  //console.log(`   --> CHARTS LOADED FROM SHEET ARE: `);
  keys = Object.keys(ALL_CHARTS);
  for (var i = 0; i < keys.length; i++) {

    if (keys[i] == 'BASE URL'){
      continue;
    }
    //console.log(`       ${i} CHART IS :,${keys[i]}`);
    ALL_CHARTS_KEYS.push(keys[i]);
  }
}

function suiteRunner(CHART_KEY) {

  const chartSelcted = ALL_CHARTS[`${CHART_KEY}`];

  describe(`${CHART_KEY}`, () => {

    for (j = 0; j < chartSelcted.length; j++) {

      testRunner(CHART_KEY, chartSelcted[j], j);
    }
  });

}

function testRunner(CHART_KEY, link, index ) {

  index = index + 1;
  it (`${CHART_KEY} > ${index}`, async () => {

    console.log(`   --> ${index} > ${link}`);

    eyes.open(browser, CHART_KEY, `${CHART_KEY} > ${index}`);
    helper.navigateToUrl(link);
    eyes.checkWindow(`${index}`);

    //link = link.substring(150, 30);
    //console.log('link : ', link);

    eyes.close();
  });
}

completeTest();
