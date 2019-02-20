const chartDataNew = []

let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
    actual:0,
    expected:0,
    items: []
  },
  onLoad() {

  },
  onReady() {

  },
  onDraw(ddChart) {
    this.getAreaChar(ddChart);
  },
  getAreaChar(ddChart) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetCityDDChartDataAsync',
      method: 'Get',
      data: {
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ actual:res.data.result.actual,expected:res.data.result.expected,items: res.data.result.list });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear();
          ddChart.source(chartDataNew);
          ddChart.tooltip({
            // custom: true, // 自定义 tooltip 内容框
            // onChange: function onChange(obj) {
            //   var legend = ddChart.get('legendController').legends.top[0];
            //   var tooltipItems = obj.items;
            //   var legendItems = legend.items;
            //   var map = {};
            //   legendItems.map(function(item) {
            //     // map[item.name] = Object.clone(item);
            //     map[item.name] = Object.assign({}, item);
            //   });
            //   tooltipItems.map(function(item) {
            //     var name = item.name;
            //     var value = item.value;
            //     if (map[name]) {
            //       map[name].value = value;
            //     }
            //   });
            //   legend.setItems(Object.values(map));
            // },
            // onHide: function onHide() {
            //   var legend = ddChart.get('legendController').legends.top[0];
            //   legend.setItems(ddChart.getLegendItems().country);
            // }
                custom: true, // 自定义 tooltip 内容框  
                onChange: function (obj) {  
                    const legend = ddChart.get('legendController').legends.top[0]  
                    const tooltipItems = obj.items  
                    const legendItems = legend.items  
                    const map = {}  
                    legendItems.map(item => {  
                    map[item.name] = JSON.parse(JSON.stringify(item))  
                    })  
                    tooltipItems.map(item => {  
                    const { name, value } = item  
                    if (map[name]) {  
                        map[name].value = value  
                    }  
                    })  
                    legend.setItems(Object.values(map))  
                },  
                onHide: function onHide() {  
                    var legend = ddChart.get("legendController").legends.top[0];  
                    legend.setItems(ddChart.getLegendItems().country);  
                }  
          });
          // ddChart.axis('area', {
          //   label(text, index, total) {
          //     const textCfg = {};
          //     if (index === 0) {
          //       textCfg.textAlign = 'left';
          //     }
          //     if (index === total - 1) {
          //       textCfg.textAlign = 'right';
          //     }
          //     return textCfg;
          //   }
          // })
          ddChart.interval().position('areaName*area').color('groupName').adjust({
            type: 'dodge',
            marginRatio: 1 // 设置分组间柱子的间距
          })
          ddChart.render()
          this.data.chart = ddChart;
        } else {
          ddChart.changeData(chartDataNew);
        }
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
    onItemMothClick(index){
    dd.navigateTo({
      url: "../area/district-area/district-area",
    });
  }
})