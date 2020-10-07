const { percySnapshot } = require('@percy/protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

describe(`Sample suite`, () => {

  it(`Sample test`, async () => {

    let link = "#$state$marker$color$which=time&use=indicator&scaleType=time&spaceRef:null;;;&chart-type=bubbles";
    await browser.get(`${"https://tools.gapminder.org/" + link}`);

    var browserSize = await helper.screenSize();

    console.log("width :" + browserSize.width);
    console.log("height :" + browserSize.height);

    //expect(browserSize.width).toEqual(1366);
    //expect(browserSize.height).toEqual(768);

    await browser.sleep(4000);
    await percySnapshot(`Sample snapshot with perccy options`, {
      "widths": [browserSize.width],
      "minHeight": browserSize.height
      //"enableJavaScript": true
    });
  });
});