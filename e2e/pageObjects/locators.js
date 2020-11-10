const locators = {};

const gotDom = require('./pageObjects.js');
gotDom.pageObjects((dom) => {

  const cc = dom.commonCharts;
  const bc = dom.bubbleChart;

  locators['selected'] = {

    gapminder_logo: cc.gapminder_logo,
    chart_switcher: cc.chart_switcher,
    facts: cc.facts,
    teach: cc.teach,
    about: cc.about,
    how_to_use: cc.how_to_use,
    button_link: cc.button_link,
    button_download: cc.button_download,
    button_code: cc.button_code,
    button_play: cc.button_play,
    side_bar: cc.side_bar,
    main_chart: cc.main_chart,
    side_bar_collapse: cc.side_bar_collapse,
    more_options: cc.more_options,
    present: cc.present,
    full_screen: cc.full_screen,
    color: cc.color,
    size: cc.size,
    other_tools_income: cc.other_tools_income,
    other_tools_maps: cc.other_tools_maps,
    other_tools_trends: cc.other_tools_trends,
    other_tools_ranks: cc.other_tools_ranks,
    other_tools_ages: cc.other_tools_ages,
    other_tools_dollar_street: cc.other_tools_dollar_street,

    axis_y: bc.axis_y,
    axis_y_info: bc.axis_y_info,
    axis_x: bc.axis_x,
    axis_x_info: bc.axis_x_info,
    data_doubts: bc.data_doubts,
    hundredpercent: bc.hundredpercent
  };
});

current_env = 'selected';

const current_locators = locators[ current_env ];
current_locators["current_env"] = current_env;
module.exports = current_locators;
