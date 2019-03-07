import F2 from '@antv/my-f2';
const chartDataNew = []

let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
    zhActual: 0,
    zhExpected: 0,
    jgActual: 0,
    jgExpected: 0,
    wcActual: 0,
    wcExpected: 0,
    items: [],
    areaCode: 0
  },
  onLoad() {

  },
  onReady() {
    // console.log(app.globalData.userInfo)
    this.setData({ areaCode: app.globalData.userInfo.areaCode });
  },
  onDraw(ddChart) {
    this.getAreaChar(ddChart);
  },
  addShape() {
    var Shape = F2.Shape;
    var Util = F2.Util;
    Shape.registerShape('interval', 'text', {
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        // points 顶点的顺序
        // 1 ---- 2
        // |      |
        // 0 ---- 3
        var style = Util.mix({
          fill: cfg.color,
          z: true // 需要闭合
        }, cfg.style);
        var intervalShape = container.addShape('rect', {
          attrs: Util.mix({
            x: points[1].x,
            y: points[1].y,
            width: points[2].x - points[1].x,
            height: points[0].y - points[1].y
          }, style)
        });

        var origin = cfg.origin._origin; // 获取对应的原始数据记录
        var textShape = container.addShape('text', {
          zIndex: 1,
          attrs: {
            x: (points[1].x + points[2].x) / 2,
            y: points[1].y - 5, // 往上偏移 5 像素
            text: origin['area'],
            fill: '#808080',
            textAlign: 'center',
            textBaseline: 'bottom',
            fontSize: 10 // 字体大小
          }
        });
        container.sort();
        return [intervalShape, textShape];
      }
    });
  },
  getAreaChar(ddChart) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetDistrictDDChartDataAsync',
      method: 'Get',
      data: {
        id: app.globalData.userInfo.id
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({
          zhActual: res.data.result.zhActual, zhExpected: res.data.result.zhExpected,
          jgActual: res.data.result.jgActual, jgExpected: res.data.result.jgExpected,
          wcActual: res.data.result.wcActual, wcExpected: res.data.result.wcExpected,
          items: res.data.result.list
        });
        // this.setData({ actual:res.data.result.actual,expected:res.data.result.expected,items: res.data.result.list });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear()
          ddChart.source(chartDataNew)
          ddChart.tooltip({
            custom: true, // 自定义 tooltip 内容框
            onChange: function onChange(obj) {
              // console.log(obj);
              var legend = ddChart.get('legendController').legends.top[0];
              var tooltipItems = obj.items;
              var legendItems = legend.items;
              var map = {};
              legendItems.map(function(item) {
                map[item.name] = Object.assign({}, item);
              });
              tooltipItems.map(function(item) {
                var name = item.name;
                var value = item.value;
                if (map[name]) {
                  map[name].value = value;
                }
              });
              legend.setItems(Object.values(map));
            },
            onHide: function onHide() {
                            // console.log(obj);
              var legend = ddChart.get('legendController').legends.top[0];
              legend.setItems(ddChart.getLegendItems().country);
            }
            // onHide() {
            //   const legend = ddChart.get('legendController').legends.top[0];
            //   legend.setItems(ddChart.getLegendItems().country);
            // }
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
          ddChart.interval().position('areaName*area').color('groupName').shape('text').adjust({
            type: 'dodge',
            marginRatio: 1 / 32 // 设置分组间柱子的间距
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
  onItemMothClick(id) {
    dd.navigateTo({
      url: "../comm-area/comm-area?id=" + id.index,
    });
    // this.onDraw(this.data.chart);
  }
})