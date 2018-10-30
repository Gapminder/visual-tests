/*

*/

const locators = {};

const got_dom = require('./pageObjects.js');
got_dom.page_objects(function(dom){

  const commonCharts = dom.commonCharts;

  locators['selected'] = {

    buttonPlay : commonCharts.buttonPlay,
    sideBar : commonCharts.sideBar,
    mainChart : commonCharts.mainChart
  };
});

current_env = 'selected';

const current_locators = locators[ current_env ];
current_locators["current_env"] = current_env;
module.exports = current_locators;
