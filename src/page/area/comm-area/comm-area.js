import F2 from '@antv/my-f2';
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
    type: null,
    m:1
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
  addShape() {
    var Shape = F2.Shape;
    var Util = F2.Util;
    var G = F2.G;
    Shape.registerShape('interval', 'text', {
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        var style = {
          fill: cfg.color,
          z: true // 需要闭合
        };
        var shapes = [];
        var intervalWidth = points[1].x - points[0].x;
        var interval = container.addShape('rect', {
          attrs: Util.mix({
            x: points[0].x,
            y: points[0].y,
            width: intervalWidth,
            height: points[3].y - points[0].y
          }, style)
        }); // 绘制柱形
        shapes.push(interval);
        var origin = cfg.origin._origin; // 获取对应的原始数据
        var textOffsetX = 4;

        var text = new G.Shape.Text({
          attrs: {
            x: (points[0].x + points[1].x) / 2,
            y: (points[0].y + points[3].y) / 2,
            text: origin.area,
            fill: '#fff',
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 10
          }
        });
        var textWidth = text.getBBox().width;
        if (textWidth + textOffsetX < intervalWidth) {
          container.add(text);
          shapes.push(text);
        }
        return shapes;
      }
    });
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
        var m = 0.05;
        if(chartDataNew.length == 2){
          //this.setData({m:1});
          m = 1;
        }
        if (true) {
          ddChart.clear();
          this.addShape();
          ddChart.source(chartDataNew);
          ddChart.coord({
            transposed: true
          });
            ddChart.tooltip({
            custom: true, // 自定义 tooltip 内容框
          });
          
          //console.log(m);
          ddChart.interval().position('areaName*area').color('groupName').shape('text').adjust({
            type: 'dodge',
            marginRatio: m // 设置分组间柱子的间距
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