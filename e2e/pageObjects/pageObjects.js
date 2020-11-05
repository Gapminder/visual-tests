const { $, by } = require("protractor");

exports.pageObjects = (cb) => {

  dom.forEach((data) => {
    cb(data);
  });
}

var colors = element.all(by.xpath("//*[@data-dlg='colors']//*[@class='vzb-ip-select']"));
var sizes = element.all(by.xpath("//*[@data-dlg='size']//*[@class='vzb-ip-select']"));

var dom = [
  {
    'commonCharts': {
      '_comment': 'Locators belong to GENERAL CATEGORY',

      gapminder_logo: element(by.xpath("//*[@class='flow-container']/a//img")),
      chart_switcher: $('.chart-switcher-button'),
      button_play: $('.vzb-ts-btn-play'),
      side_bar: $('.vzb-tool-sidebar'),
      main_chart: $('.vzb-tool'),
      present: element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='presentation']")),
      color: colors.get(0),
      size: sizes.get(0)
    },

    'bubbleChart': {
      '_comment': 'Locators belong to BUBBLE CHART',

      axis_y: $('.vzb-bc-axis-y-title'),
      axis_x: $('.vzb-bc-axis-x-title'),
      data_doubts: $('.vzb-data-warning.vzb-noexport')
    }
  }
]
