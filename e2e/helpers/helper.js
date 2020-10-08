const { browser } = require("protractor");
global.locators = require("./../pageObjects/locators.js");

const MAX_TIMEOUT = 120000;
const EC = protractor.ExpectedConditions;
function webUI(ele) { return global.locators[ele]; }

exports.visibilityOf = async (pageObject) => {
  await browser.wait(EC.visibilityOf(webUI(pageObject)), MAX_TIMEOUT, pageObject + ' not visible');
}

exports.screenSize = async () => {
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

exports.viewPort = () => {
  const JS_GET_VIEWPORT = "return {"
    + "width: window.innerWidth,"
    + "height: window.innerHeight };";

  return viewPort = browser.executeScript(JS_GET_VIEWPORT).then((visualPort) => {
    return visualPort;
  });
}