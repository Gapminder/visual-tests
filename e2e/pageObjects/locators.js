const locators = {};

const gotDom = require('./pageObjects.js');
gotDom.pageObjects((dom) => {

  const cc = dom.common_charts;
  const bc = dom.bubble_chart;
  const lc = dom.line_chart;
  const mc = dom.mountain_chart;
  const br = dom.barrank_chart;
  const mp = dom.maps_chart;
  const ds = dom.dollar_street;

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
    app_language_switcher: cc.app_language_switcher,
    button_play: cc.button_play,
    side_bar: cc.side_bar,
    main_chart: cc.main_chart,
    data_doubts: cc.data_doubts,
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

    // Bubble Chart
    axis_y: bc.axis_y,
    axis_y_info: bc.axis_y_info,
    axis_x: bc.axis_x,
    axis_x_info: bc.axis_x_info,
    hundredpercent: bc.hundredpercent,

    // Line Chart
    line_axis_y: lc.line_axis_y,
    line_axis_y_info: lc.line_axis_y_info,

    // Mountain Chart
    mountain_axis_y: mc.mountain_axis_y,
    mountain_axis_y_info: mc.mountain_axis_y_info,

    // Barrank Chart
    barrank_axis_y: br.barrank_axis_y,
    barrank_axis_y_info: br.barrank_axis_y_info,

    // Maps Chart
    maps_axis_y: mp.maps_axis_y,
    maps_axis_y_info: mp.maps_axis_y_info,

    // Dollar Street
    tour_maybe_later: ds.tour_maybe_later,
  };
});

current_env = 'selected';

const current_locators = locators[current_env];
current_locators["current_env"] = current_env;
module.exports = current_locators;
