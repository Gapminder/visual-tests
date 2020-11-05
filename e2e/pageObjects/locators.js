const locators = {};

const gotDom = require('./pageObjects.js');
gotDom.pageObjects((dom) => {

  const commonCharts = dom.commonCharts;
  const bubbleChart = dom.bubbleChart;

  locators['selected'] = {

    buttonPlay: commonCharts.buttonPlay,
    sideBar: commonCharts.sideBar,
    mainChart: commonCharts.mainChart,
    present: commonCharts.present,
    color: commonCharts.color

    //present: bubbleChart.present
  };
});

current_env = 'selected';

const current_locators = locators[ current_env ];
current_locators["current_env"] = current_env;
module.exports = current_locators;
