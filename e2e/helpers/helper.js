const fs = require('fs')
let ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
let SHEET_KEYS = Object.keys(ALL_SHEETS);

const MAX_TIMEOUT = 90000;
const EC = require("wdio-wait-for");
function webUI(ele) { return global.locators[ele.trim()]; }

exports.ALL_SHEETS = ALL_SHEETS;

exports.resetUrl = "data:text/html,<html></html>";

exports.visibilityOf = visibilityOf = async (element) => {
  await browser.waitUntil(EC.visibilityOf(webUI(element)), {
    timeout: MAX_TIMEOUT,
    timeoutMsg: element + ' is not visible'
  });
}

exports.clickable = clickable = async (element) => {
  await browser.waitUntil(EC.elementToBeClickable(webUI(element)), {
    timeout: MAX_TIMEOUT,
    timeoutMsg: element + ' is not clickable'
  });
}

exports.click = async (element) => {
  await clickable(element)
  await webUI(element).click();
}

exports.hover = async (element) => {
  await visibilityOf(element)
  await webUI(element).moveTo();
  //await webUI(element).moveTo().click();
}

exports.refresh = async () => {
  await browser.refresh();
}

exports.element = (testName) => {
  return testName.split(":").pop();
}

exports.scrollByElement = async (element) => {

  var getY = await webUI(element).getLocation().then((axis) => {
    console.log("axis.y : " + axis.y);
    return axis.y;
  });
  await browser.execute("window.scrollTo(0, " + (getY + 800) + ")").then(() => {
    this.click(element);
  });
}



exports.screenSize = screenSize = async () => {
  return browserSize = browser.getWindowRect().then((size) => {
    return size;
  });
}

/*
exports.screenSize = async (width, height) => {
  browser.manage().window().setSize(width, height);
}
*/

exports.padding = () => {
  const JS_GET_PADDING = "return {"
    + "width: window.outerWidth - window.innerWidth,"
    + "height: window.outerHeight - window.innerHeight };";

  return padding = browser.execute(JS_GET_PADDING).then((pad) => {
    return pad;
  });
}

exports.viewPort = viewPort = () => {
  const JS_GET_VIEWPORT = "return {"
    + "width: window.innerWidth,"
    + "height: window.innerHeight };";

  return viewPort = browser.execute(JS_GET_VIEWPORT).then((visualPort) => {
    return visualPort;
  });
}

exports.getSizeInfo = async () => {
  const browserSize = await screenSize();
  const visualView = await viewPort();

  browserWidth = browserSize.width;
  browserHeight = browserSize.height;
  innerWidth = visualView.width;
  innerHeight = visualView.height;

  if (browser.name != null) console.log(`\n   --> Session: ${browser.name}`);
  console.log(`       browserWidth: ${browserWidth}`);
  console.log(`       browserHeight: ${browserHeight}`);
  console.log(`       innerWidth: ${innerWidth}`);
  console.log(`       innerHeight: ${innerHeight}`);
}

exports.isEmptyObj = isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0;
}

exports.onlyTest = () => {
  return exclusiveTests("only");
}

exports.skipTest = () => {
  return exclusiveTests("skip");
}

exports.removedSkipTest = (skipTest) => {
  for (const sheetKey of Object.keys(skipTest)) {

    for (const chartKey of Object.keys(skipTest[sheetKey])) {
      if (chartKey.match(/BASE URL/gi)) continue;
      var choosenTests = [];

      var chartSelcted = Object.values(ALL_SHEETS[sheetKey][chartKey]);
      for (const item of chartSelcted) {
        if (!item.testName.match(/(skip|skiped)/gi)) {
          choosenTests.push(item);
        }
      }
      delete ALL_SHEETS[sheetKey][chartKey];
      if (choosenTests.length != 0) ALL_SHEETS[sheetKey][chartKey] = choosenTests;
    }
  }
  return ALL_SHEETS;
}

exports.exclusiveTests = exclusiveTests = (exclusiveType) => {
  let multipleSheets = {};

  if (exclusiveType === "only") exclusiveType = /(exclusive_test|exclusive|only)/gi;
  if (exclusiveType === "skip") exclusiveType = /(skip|skiped)/gi;

  for (const sheetKey of SHEET_KEYS) {
    let exclusiveTests = {};
    let singleChart = {};
    let singleSheet = {};
    let singleSheetSelected = null;

    var chartKeys = Object.keys(ALL_SHEETS[sheetKey]);
    for (const chartKey of chartKeys) {
      if (chartKey.match(/BASE URL/gi)) continue;
      var choosenTests = [];

      var chartSelcted = Object.values(ALL_SHEETS[sheetKey][chartKey]);
      for (const item of chartSelcted) {
        if (item.testName.match(exclusiveType)) {
          singleSheetSelected = sheetKey;
          choosenTests.push(item);
        }
      }
      if (choosenTests.length > 0) exclusiveTests[chartKey] = choosenTests;
    }

    if (singleSheetSelected != null) {
      for (const chartKey of chartKeys) {
        if (chartKey.match(/BASE URL/gi)) singleChart[chartKey] = Object.values(ALL_SHEETS[singleSheetSelected][chartKey]);
      }
      Object.assign(singleChart, singleChart, exclusiveTests);
    }
    if (singleSheetSelected != null) singleSheet[singleSheetSelected] = singleChart;
    Object.assign(multipleSheets, multipleSheets, singleSheet);
  }
  return multipleSheets;
}

exports.totalTests = (allSheets) => {
  ALL_SHEETS = allSheets;
  SHEET_KEYS = Object.keys(ALL_SHEETS);

  for (const sheetKey of SHEET_KEYS) {

    console.log(`\n   --> SHEET: ${sheetKey}`);
    var totalTests = 0;

    for (const chartKey of Object.keys(ALL_SHEETS[sheetKey])) {
      if (chartKey.match(/BASE URL/gi)) continue;
      var chartSelcted = Object.values(ALL_SHEETS[sheetKey][chartKey]);
      console.log(`       ${chartKey} -> Tests: ${chartSelcted.length}`);
      totalTests = totalTests + chartSelcted.length;
    }
    console.log(`       ${sheetKey} => Total Tests: ${totalTests}`);
  }
}