exports.pageObjects = (cb) => {

  dom.forEach((data) => {
    cb(data);
  });
}

var colors = element.all(by.xpath("//*[@data-dlg='colors']//*[@class='vzb-ip-select']"));

var dom = [
  {
    'commonCharts': {
      '_comment': 'Locators belong to GENERAL CATEGORY',

      'buttonPlay': $('.vzb-ts-btn-play'),
      'sideBar': $('.vzb-tool-sidebar'),
      'mainChart': $('.vzb-tool'),
      'present': element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='presentation']")),
      'color': colors.get(0)
    },

    'bubbleChart': {
      '_comment': 'Locators belong to BUBBLE CHART',

      //'present': element(by.xpath("//*[@class='vzb-tool-buttonlist']//*[@data-btn='presentation']"))
    }
  }
]
