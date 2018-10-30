exports.page_objects = function (cb) {

  dom.forEach(function (data) {
    cb(data);
  });
}

var dom = [
  {
    "commonCharts": {
      "_comment": "Locators belong to GENERAL CATEGORY",

      "buttonPlay" : $(".vzb-ts-btn-play"),
      "sideBar" : $(".vzb-tool-sidebar"),
      "mainChart" : $(".vzb-tool")
    },

    "bubbleChart": {
      "_comment": "",

      "button" : "#side > div"
    }
  }
]
