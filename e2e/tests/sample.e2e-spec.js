const { percySnapshot } = require('@percy/protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

describe(`Sample suite`, () => {

  it(`Sample test`, async () => {

    let link = "#$state$marker$color$which=time&use=indicator&scaleType=time&spaceRef:null;;;&chart-type=bubbles";
    await browser.get(`${"https://tools.gapminder.org/" + link}`);

    await browser.sleep(4000);
    await percySnapshot(`Sample snapshot`, { widths: [1080] });
  });
});