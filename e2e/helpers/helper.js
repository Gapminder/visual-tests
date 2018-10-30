global.locators = require("./../pageObjects/locators.js");

const MAX_TIMEOUT = 60000;

const EC = protractor.ExpectedConditions;
function ui(ele) { return global.locators[ele]; }

exports.navigateToUrl = async (endPoint) => {

  browser.get(browser.baseUrl + endPoint);
  browser.wait(EC.visibilityOf(ui('sideBar')), MAX_TIMEOUT, 'sideBar not visible')
    .then(() => browser.wait(EC.visibilityOf(ui('mainChart')), MAX_TIMEOUT, 'mainChart not visible'))
    .then(() => browser.wait(EC.visibilityOf(ui('buttonPlay')), MAX_TIMEOUT, 'buttonPlay not visible'));

  browser.sleep(3000);
}
