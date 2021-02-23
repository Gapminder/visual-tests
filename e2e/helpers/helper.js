const { browser } = require("protractor");
const fs = require('fs')
const ALL_SHEETS = JSON.parse(fs.readFileSync("./e2e/testData.json"));
const SHEET_KEYS = Object.keys(ALL_SHEETS);
global.locators = require("./../pageObjects/locators.js");

const MAX_TIMEOUT = 90000;
const EC = protractor.ExpectedConditions;
function webUI(ele) { return global.locators[ele.trim()]; }

exports.visibilityOf = visibilityOf = async (element) => {
  await browser.wait(EC.visibilityOf(webUI(element)), MAX_TIMEOUT, element + ' is not visible');
}

exports.clickable = clickable = async (element) => {
  await browser.wait(EC.elementToBeClickable(webUI(element)), MAX_TIMEOUT, element + ' is not clickable');
}

exports.click = async (element) => {
  await clickable(element)
  await webUI(element).click();
}

exports.hover = async (element) => {
  await visibilityOf(element)
  await browser.actions().mouseMove(webUI(element)).click().perform();
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
  await browser.executeScript("window.scrollTo(0, " + (getY + 800) + ")").then(() => {
    this.click(element);
  });
}



exports.screenSize = screenSize = async () => {
  return browserSize = browser.manage().window().getSize().then((size) => {
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

  return padding = browser.executeScript(JS_GET_PADDING).then((pad) => {
    return pad;
  });
}

exports.viewPort = viewPort = () => {
  const JS_GET_VIEWPORT = "return {"
    + "width: window.innerWidth,"
    + "height: window.innerHeight };";

  return viewPort = browser.executeScript(JS_GET_VIEWPORT).then((visualPort) => {
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

exports.ALL_SHEETS = ALL_SHEETS;
exports.SHEET_KEYS = SHEET_KEYS;

exports.exclusiveTests = () => {
  let exclusiveTests = {};
  let multipleSheets = {};
  let singleChart = {};
  let singleSheet = {};
  let singleSheetSelected;

  for (const sheetKey of SHEET_KEYS) {
    var chartKeys = Object.keys(ALL_SHEETS[sheetKey]);

    for (const chartKey of chartKeys) {
      if (chartKey.match(/BASE URL/gi)) continue;
      var choosenTests = [];

      var chartSelcted = Object.values(ALL_SHEETS[sheetKey][chartKey]);
      for (const item of chartSelcted) {
        if (item.testName.match(/(exclusive_test|exclusive)/gi)) {
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
    exclusiveTests = {};
    singleChart = {};
    singleSheet = {};
    singleSheetSelected = null;
  }
  return multipleSheets;
}