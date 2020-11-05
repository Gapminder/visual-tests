const locators = {};

const gotDom = require('./pageObjects.js');
gotDom.pageObjects((dom) => {

  const commonCharts = dom.commonCharts;
  const bubbleChart = dom.bubbleChart;

  locators['selected'] = {

    gapminder_logo: commonCharts.gapminder_logo,
    chart_switcher: commonCharts.chart_switcher,
    button_play: commonCharts.button_play,
    side_bar: commonCharts.side_bar,
    main_chart: commonCharts.main_chart,
    present: commonCharts.present,
    color: commonCharts.color,
    size: commonCharts.size,

    axis_y: bubbleChart.axis_y,
    axis_x: bubbleChart.axis_x,
    data_doubts: bubbleChart.data_doubts
  };
});

current_env = 'selected';

const current_locators = locators[ current_env ];
current_locators["current_env"] = current_env;
module.exports = current_locators;
