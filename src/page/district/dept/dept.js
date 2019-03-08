import F2 from '@antv/my-f2';

let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
    startDate: '',
    endDate: '',
    deptIdOrAreaCode: 0,
    items: [],
    chartDatas: [],
    tabIndex: 0,
    type: null
  },
  onLoad(query) {
    this.setData({ deptIdOrAreaCode: query.id, startDate: query.startDate, endDate: query.endDate, tabIndex: query.tabIndex, type: query.type });
  },
  onReady() {
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
            //x: points[1].x,
            //y: points[1].y,
            //width: points[2].x - points[1].x,
            //height: points[0].y - points[1].y
          }, style)
        }); // 绘制柱形
        shapes.push(interval);
        var origin = cfg.origin._origin; // 获取对应的原始数据
        var textOffsetX = 4;

        var text = new G.Shape.Text({
          attrs: {
            //x: points[0].x + textOffsetX,
            //y: (points[0].y + points[3].y) / 2,
            x: (points[0].x + points[1].x) / 2,
            y: (points[0].y + points[3].y) / 2,
            text: origin.num,
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
  onDraw(ddChart, F2) {
    this.getChartData(ddChart, F2);
  },
  getChartData(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetDeptChartDataAsync',
      method: 'Get',
      data: {
        userId: app.globalData.userInfo.id,
        startTime: this.data.startDate,
        endTime: this.data.endDate,
        tabIndex: this.data.tabIndex,
        deptIdOrAreaCode: this.data.deptIdOrAreaCode,
        type: this.data.type
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ chartDatas: res.data.result.datas, items: res.data.result.items });
        const chartDataNew = res.data.result.items;
        if (!this.data.chart) {
          ddChart.clear()
          this.addShape();
          ddChart.source(chartDataNew, {
            population: {
              tickCount: 5
            }
          })
          ddChart.coord({
            transposed: true
          })
          ddChart.axis('task', {
            line: F2.Global._defaultAxis.line,
            grid: null
          })
          ddChart.axis('num', {
            line: null,
            grid: F2.Global._defaultAxis.grid,
            label: function label(text, index, total) {
              var textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              } else if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              return textCfg;
            }
          })
          ddChart.tooltip({
            custom: true, // 自定义 tooltip 内容框
            onChange: function onChange(obj) {
            },
            onHide: function onHide() {
            }
          });

          ddChart.interval().position('name*num').color('groupName', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack').shape('text');
          ddChart.render()
          this.data.chart = ddChart;
        } else {
          ddChart.changeData(chartDataNew);
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
        console.log('error:', res);
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  handleTabClick({ index }) {
    this.data.tabIndex = index == 0 ? 1 : 2;
  },
  onItemClick(index) {
    //console.log(index)
    //console.log(this.data.chartDatas[index.index])
    const row = this.data.chartDatas[index.index];
    if (row.type == "employee") {
      dd.navigateTo({
        url: "../../detail/detail?employeeId=" + row.id 
        + (this.data.startDate? "&startTime=" + this.data.startDate : '')
        + (this.data.endDate? "&endTime=" + this.data.endDate : '')
        + "&type=" + row.type
        + "&tabIndex=" + this.data.tabIndex,
      });
    } else {
      dd.navigateTo({
        url: "dept?id=" + row.id
          + "&startTime=" + this.data.startDate + "&endTime=" + this.data.endDate
          + "&type=" + row.type
          + "&tabIndex=" + this.data.tabIndex,
      });
    }
  }
})