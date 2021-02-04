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
    'common_charts': {
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
      app_language_switcher: $('.lang-current'),
      button_play: $('.vzb-ts-btn'),
      side_bar: $('.vzb-tool-sidebar'),
      main_chart: $('.vzb-tool'),
      data_doubts: $('.vzb-data-warning.vzb-noexport'),
      side_bar_collapse: element(by.xpath("//*[@class='vzb-buttonlist']//*[@data-btn='sidebarcollapse']")),
      more_options: element(by.xpath("//*[@class='vzb-buttonlist']//*[@data-btn='moreoptions']")),
      present: element(by.xpath("//*[@class='vzb-buttonlist']//*[@data-btn='presentation']")),
      full_screen: element(by.xpath("//*[@class='vzb-buttonlist']//*[@data-btn='fullscreen']")),
      color: colors.get(0),
      size: sizes.get(0),
      other_tools_income: other_tools_item.get(1),
      other_tools_maps: other_tools_item.get(2),
      other_tools_trends: other_tools_item.get(3),
      other_tools_ranks: other_tools_item.get(4),
      other_tools_ages: other_tools_item.get(6),
      other_tools_dollar_street: other_tools_item.get(8)
    },

    'bubble_chart': {
      '_comment': 'Locators belong to BUBBLE CHART',

      axis_y: $('.vzb-bc-axis-y-title'),
      axis_y_info: $('.vzb-bc-axis-y-info.vzb-noexport'),
      axis_x: $('.vzb-bc-axis-x-title'),
      axis_x_info: $('.vzb-bc-axis-x-info.vzb-noexport'),
      hundredpercent: element.all(by.xpath("//*[@class='vzb-dialog-zoom-buttonlist']//*[@data-btn='hundredpercent']")).get(0),
    },

    'line_chart': {
      '_comment': 'Locators belong to LINE CHART',

      line_axis_y: $('.vzb-lc-axis-y-title'),
      line_axis_y_info: $('.vzb-lc-axis-y-info'),
    },

    'mountain_chart': {
      '_comment': 'Locators belong to MOUNTAIN CHART',

      mountain_axis_y: $('.vzb-mc-axis-y-title'),
      mountain_axis_y_info: $('.vzb-mc-axis-info.vzb-noexport'),
    },
    
    'barrank_chart': {
      '_comment': 'Locators belong to BAR CHART',

      barrank_axis_y: $('.vzb-br-title'),
      barrank_axis_y_info: $('.vzb-br-axis-info.vzb-noexport'),
    },

    'maps_chart': {
      '_comment': 'Locators belong to MAPS CHART',

      maps_axis_y: $('.vzb-bmc-axis-y-title'),
      maps_axis_y_info: $('.vzb-bmc-axis-y-info.vzb-noexport'),
    },
  }
]