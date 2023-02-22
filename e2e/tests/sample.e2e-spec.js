const percySnapshot = require('@gapminder/percy-protractor');
const helper = require("../helpers/helper.js");
const fs = require('fs');
const { browser } = require("protractor");

let browserWidth;
let browserHeight;
let innerWidth;
let innerHeight;

describe(`Sample suite`, () => {

  it(`Sample test`, async () => {

    let link = "#$model$markers$bubble$encoding$color$data$space@=time;&concept=time;&scale$type:null&domain:null&zoomed:null;;;;;;&chart-type=bubbles&url=v1";
    await browser.get(`${"https://tools.gapminder.org/" + link}`);

    const browserSize = await helper.screenSize();
    const visualView = await helper.viewPort();
    
    browserWidth = browserSize.width;
    browserHeight = browserSize.height;
    innerWidth = visualView.width;
    innerHeight = visualView.height;

    console.log(`\n   --> Session: ${browser.name}`);
    console.log(`       browserWidth: ${browserWidth}`);
    console.log(`       browserHeight: ${browserHeight}`);
    console.log(`       innerWidth: ${innerWidth}`);
    console.log(`       innerHeight: ${innerHeight}`);

    await browser.sleep(6000);
    await percySnapshot(`Sample snapshot with perccy options`, {
      "widths": [visualView.width],
      "minHeight": visualView.height
      //"enableJavaScript": true
    });
  });
});