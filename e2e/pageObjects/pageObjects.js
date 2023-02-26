module.exports = (() => {

  const common_objects = {
    get app_menu() { return  $$('.nav-expandable-item') },
    get colors() { return $$("//*[@data-dlg='colors']//*[@class='vzb-ip-select']") },
    get sizes() { return $$("//*[@data-dlg='size']//*[@class='vzb-ip-select']") },
    get other_tools_item() { return $$('.other-tools-item') },
  }

  return {
    //
    // Locators belong to GENERAL CATEGORY
    //
    get gapminder_logo() { return $("//*[@class='flow-container']/a//img") },
    get chart_switcher() { return $('.chart-switcher-button') },
    get facts() { return common_objects.app_menu[0] },
    get teach() { return common_objects.app_menu[1] },
    get about() { return common_objects.app_menu[2] },
    get how_to_use() { return common_objects.app_menu[3] },
    get button_link() { return $('.link.button') },
    get button_download() { return $('.download.button') },
    get button_code() { return $('.button.code') },
    get app_language_switcher() { return $('.lang-current') },
    get button_play() { return $('.vzb-ts-btn .vzb-icon-play') },
    get side_bar() { return $('.vzb-tool-sidebar') },
    get main_chart() { return $('.vzb-tool') },
    get data_doubts() { return $('.vzb-data-warning.vzb-noexport') },
    get side_bar_collapse() { return $("//*[@class='vzb-buttonlist']//*[@data-btn='sidebarcollapse']") },
    get more_options() { return $("//*[@class='vzb-buttonlist']//*[@data-btn='moreoptions']") },
    get present() { return $("//*[@class='vzb-buttonlist']//*[@data-btn='presentation']") },
    get full_screen() { return $("//*[@class='vzb-buttonlist']//*[@data-btn='fullscreen']") },
    get color() { return common_objects.colors[0] },
    get size() { return common_objects.sizes[0] },
    get other_tools_income() { return common_objects.other_tools_item[1] },
    get other_tools_maps() { return common_objects.other_tools_item[2] },
    get other_tools_trends() { return common_objects.other_tools_item[3] },
    get other_tools_ranks() { return common_objects.other_tools_item[4] },
    get other_tools_ages() { return common_objects.other_tools_item[6] },
    get other_tools_dollar_street() { return common_objects.other_tools_item[8] },

    //    
    // Locators belong to BUBBLE CHART
    //
    get axis_y() { return $('.vzb-bc-axis-y-title') },
    get axis_y_info() { return $('.vzb-bc-axis-y-info.vzb-noexport') },
    get axis_x() { return $('.vzb-bc-axis-x-title') },
    get axis_x_info() { return $('.vzb-bc-axis-x-info.vzb-noexport') },
    get hundredpercent() { return $$("//*[@class='vzb-dialog-zoom-buttonlist']//*[@data-btn='hundredpercent']")[0] },

    //
    // Locators belong to LINE CHART
    //
    get line_axis_y() { return $('.vzb-lc-axis-y-title') },
    get line_axis_y_info() { return $('.vzb-lc-axis-y-info') },

    //
    // Locators belong to MOUNTAIN CHART
    //
    get mountain_axis_y() { return $('.vzb-mc-axis-y-title') },
    get mountain_axis_y_info() { return $('.vzb-mc-axis-info.vzb-noexport') },  //

    // Locators belong to BAR CHART
    //
    get barrank_axis_y() { return $('.vzb-br-title') },
    get barrank_axis_y_info() { return $('.vzb-br-axis-info.vzb-noexport') },

    //
    // Locators belong to MAPS CHART
    //
    get maps_axis_y() { return $('.vzb-bmc-axis-y-title') },
    get maps_axis_y_info() { return $('.vzb-bmc-axis-y-info.vzb-noexport') },

    //
    // Locators belong to DOLLAR STREET
    //
    get tour_maybe_later() { return $("//*[@class='Tour_TourContainer__1wCVW']//button[2]") },

  }
})()
