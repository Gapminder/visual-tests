const { $, by } = require("protractor");

exports.pageObjects = (cb) => {

  dom.forEach((data) => {
    cb(data);
  });
}

var app_menu = $$('.nav-expandable-item');
var colors = element.all(by.xpath("//*[@data-dlg='colors']//*[@class='vzb-ip-select']"));
var sizes = element.all(by.xpath("//*[@data-dlg='size']//*[@class='vzb-ip-select']"));

var dom = [
  {
    'commonCharts': {
      '_comment': 'Locators belong to GENERAL CATEGORY',

      gapminder_logo: element(by.xpath("//*[@class='flow-container']/a//img")),
      chart_switcher: $('.chart-switcher-button'),
      facts: app_menu.get(0),
      teach: app_menu.get(1),
      about: app_menu.get(2),
      how_to_use: app_menu.get(3),
      button_link: $('.link.button'),
      button_download: $('.download.button'),
      button_code: $('.button.code'),
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
