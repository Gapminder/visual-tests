const { browser } = require("protractor");
global.locators = require("./../pageObjects/locators.js");

const MAX_TIMEOUT = 120000;
const EC = protractor.ExpectedConditions;
function webUI(ele) { return global.locators[ele]; }

exports.visibilityOf = async (pageObject) => {
  await browser.wait(EC.visibilityOf(webUI(pageObject)), MAX_TIMEOUT, pageObject + ' not visible');
}

exports.screenSize = async () => {
  return browserSize = await browser.manage().window().getSize().then(function (size) {
    return size;
  });
}