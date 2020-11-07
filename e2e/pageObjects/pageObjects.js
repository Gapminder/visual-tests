const { $, by, element } = require("protractor");

exports.pageObjects = (cb) => {

  dom.forEach((data) => {
    cb(data);
  });
}

var app_menu = $$('.nav-expandable-item');
var colors = element.all(by.xpath("//*[@data-dlg='colors']//*[@class='vzb-ip-select']"));
var sizes = element.all(by.xpath("//*[@data-dlg='size']//*[@class='vzb-ip-select']"));
var other_tools_item = $$('.other-tools-item');

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
      side_bar_collapse: element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='sidebarcollapse']")),
      more_options: element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='moreoptions']")),
      present: element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='presentation']")),
      full_screen: element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='fullscreen']")),
      color: colors.get(0),
      size: sizes.get(0),
      other_tools_income: other_tools_item.get(1),
      other_tools_maps: other_tools_item.get(2),
      other_tools_trends: other_tools_item.get(3),
      other_tools_ranks: other_tools_item.get(4),
      other_tools_ages: other_tools_item.get(5),
      other_tools_dollar_street: other_tools_item.get(7),

    },

    'bubbleChart': {
      '_comment': 'Locators belong to BUBBLE CHART',

      axis_y: $('.vzb-bc-axis-y-title'),
      axis_y_info: $('.vzb-bc-axis-y-info.vzb-noexport'),
      axis_x: $('.vzb-bc-axis-x-title'),
      axis_x_info: $('.vzb-bc-axis-x-info.vzb-noexport'),
      data_doubts: $('.vzb-data-warning.vzb-noexport'),
      hundredpercent: element.all(by.xpath("//*[@class='vzb-dialog-zoom-buttonlist']//*[@data-btn='hundredpercent']")).get(0),
    }
  }
]