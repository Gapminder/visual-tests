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
    present: cc.present,
    color: cc.color,
    size: cc.size,

    axis_y: bc.axis_y,
    axis_x: bc.axis_x,
    data_doubts: bc.data_doubts
  };
});

current_env = 'selected';

const current_locators = locators[ current_env ];
current_locators["current_env"] = current_env;
module.exports = current_locators;
