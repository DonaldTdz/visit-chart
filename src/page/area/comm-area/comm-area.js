const chartDataNew = []

let app = getApp()

Page({
  data: {
    id: null,
    width: 200,
    height: 200,
    chart: null,
    items: [],
    details: [],
    dataType: 0,
    type: null
  },
  onLoad(query) {
    if (query.id) {
      this.setData({ id: query.id });
    }
  },
  onReady() {

  },
  onDraw(ddChart, F2) {
    this.getAreaChar(ddChart, F2);
  },
  getAreaChar(ddChart, F2) {
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetAreaOrganization',
      method: 'Get',
      data: {
        id: this.data.id,
        type: this.data.type
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({
          items: res.data.result.list,
          details: res.data.result.detail,
          dataType: res.data.result.type
        });
        // console.log(this.data.details);
        // this.setData({ actual:res.data.result.actual,expected:res.data.result.expected,items: res.data.result.list });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear();
          ddChart.source(chartDataNew);
          // ddChart.source(chartDataNew.reverse(), {
          //   value: {
          //     tickInterval: 750
          //   }
          // });
          ddChart.source(chartDataNew);
          ddChart.coord({
            transposed: true
          });
            ddChart.tooltip({
            custom: true, // 自定义 tooltip 内容框
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
                // custom: true, // 自定义 tooltip 内容框  
                // onChange: function (obj) {  
                //     const legend = ddChart.get('legendController').legends.top[0]  
                //     const tooltipItems = obj.items  
                //     const legendItems = legend.items  
                //     const map = {}  
                //     legendItems.map(item => {  
                //     map[item.name] = JSON.parse(JSON.stringify(item))  
                //     })  
                //     tooltipItems.map(item => {  
                //     const { name, value } = item  
                //     if (map[name]) {  
                //         map[name].value = value  
                //     }  
                //     })  
                //     legend.setItems(Object.values(map))  
                // },  
                // onHide: function onHide() {  
                //     var legend = ddChart.get("legendController").legends.top[0];  
                //     legend.setItems(ddChart.getLegendItems().country);  
                // }  
          });
          // ddChart.axis('area', {
          //   line: null,
          //   grid: F2.Global._defaultAxis.grid,
          //   label: function label(text, index, total) {
          //     var textCfg = {};
          //     if (index === 0) {
          //       textCfg.textAlign = 'left';
          //     } else if (index === total - 1) {
          //       textCfg.textAlign = 'right';
          //     }
          //     return textCfg;
          //   }
          // });
          // ddChart.interval().position('areaName*area').color('groupName', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack');
          ddChart.interval().position('areaName*area').color('groupName').adjust({
            type: 'dodge',
            marginRatio: 1 / 32 // 设置分组间柱子的间距
          });
          ddChart.render()
          this.data.chart = ddChart;
          this.setData({ type: '' });
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
  onItemMothClick(index) {
    if (this.data.dataType === 0) {
      if (this.data.details[index.index].areaName == "其他") {
        this.setData({ type: 'otherArea', id: this.data.details[index.index].departmentId });
      } else {
        this.setData({ type: 'children', id: this.data.details[index.index].departmentId });
      }
      this.onDraw(this.data.chart);
    } else {
      dd.navigateTo({
        url: "../grow-list/grow-list?id=" + this.data.details[index.index].departmentId,
      });
    }
  }
})