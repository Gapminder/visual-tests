const { browser } = require("protractor");
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
  await browser.actions().mouseMove(webUI(element)).perform();
}

exports.refresh = async () => {
  await browser.refresh();
}

exports.element = (testName) => {
  return testName.split(":").pop();
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