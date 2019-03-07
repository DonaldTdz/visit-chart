
import Dropdown from '../../components/dropdown';
import F2 from '@antv/my-f2';

let app = getApp()

Page({
  ...Dropdown,
  data: {
    width: 200,
    height: 200,
    chart: null,
    chartPre: null,
    startDate: '',
    endDate: '',
    items: [{ id: 16, name: "计划", district: "除草", num: 2, status: 1, areaCode: null, timeGroup: null }],//给予默认数据原因，页面if控制的图标才会出发请求数据
    tasks: [],
    dropdownSelectData: {
      active: false,
      selectedNav: 0,
      listData: [
        {
          nav: '开始日期',
          selectedItem: '',
          type: 'button',
          data: []
        },
        {
          nav: '结束日期',
          selectedItem: '',
          type: 'button',
          data: []
        },
      ],
    },
    itemsPre: [],
    tasksPre: [],
    tabs: [
      { title: '当前任务' },
      { title: '所有任务' },
    ],
    tabIndex: 1
  },
  onLoad() {
    this.getNowFormatDate();
  },
  onReady() {

  },
  addShape() {
    var Shape = F2.Shape;
    var Util = F2.Util;
    Shape.registerShape('interval', 'text', {
      draw: function draw(cfg, container) {
        var points = this.parsePoints(cfg.points);
        var style = {
          fill: cfg.color,
          z: true // 需要闭合
        };
        container.addShape('rect', {
          attrs: Util.mix({
            x: points[1].x,
            y: points[1].y,
            width: points[2].x - points[1].x,
            height: points[0].y - points[1].y
          }, style)
        });

        var origin = cfg.origin._origin; // 获取对应的原始数据
        return container.addShape('text', {
          attrs: {
            x: (points[1].x + points[2].x) / 2,
            y: (points[0].y + points[1].y) / 2,
            text: origin.num,
            fill: '#fff',
            textAlign: 'center',
            textBaseline: 'middle'
          }
        });
      }
    });
  },
  addShape2() {
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
  //获取默认时间（当月的第一天和最后一天）
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var lastDay = new Date(year, month, 0);
    var endDay = lastDay.getDate();
    // var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (endDay >= 0 && endDay <= 9) {
      endDay = "0" + endDay;
    }
    var lastdate = year + seperator1 + month + seperator1 + endDay;
    var startDate = year + seperator1 + month + seperator1 + '01';
    this.setData({
      startDate: startDate,
      endDate: lastdate
    });
    let alistData = this.data.dropdownSelectData.listData;
    alistData[0].nav = startDate;
    alistData[1].nav = lastdate;
    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        listData: alistData
      }
    });
  },
  onDraw(ddChart, F2) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    this.getDistrictChartData(ddChart, F2);
  },
  getDistrictChartData(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetChartByGroupAsync',
      method: 'Get',
      data: {
        // userId: app.globalData.userInfo.id,
        startTime: this.data.startDate,
        endTime: this.data.endDate,
        tabIndex: 2,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ tasks: res.data.result.tasks, items: res.data.result.items });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear()
          this.addShape2();
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
              var legend = ddChart.get('legendController').legends.top[0];
              legend.setItems(ddChart.getLegendItems().country);
            }
          });

          ddChart.interval().position('district*num').color('name', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack').shape('text');
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
  onDrawPre(ddChart, F2) {
    this.getDistrictChartDataPre(ddChart, F2);
  },
  getDistrictChartDataPre(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetChartByGroupAsync',
      method: 'Get',
      data: {
        // userId: app.globalData.userInfo.id,
        startTime: this.data.startDate,
        endTime: this.data.endDate,
        tabIndex: 1,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ tasksPre: res.data.result.tasks, itemsPre: res.data.result.items });
        const chartDataNew = this.data.itemsPre;
        if (!this.data.chartPre) {
          ddChart.clear()
          this.addShape2();
          var defs = {
            district: {
              range: [0.15, 0.85],
              type: 'cat'
            }
            //,
            //population: {
            //  tickCount: 5
            //}
          };
          ddChart.source(chartDataNew, defs)
          ddChart.coord({
            transposed: true
          })
          ddChart.axis('district', {
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
              /*var legend = ddChart.get('legendController').legends.top[0];
              var tooltipItems = obj.items;
              var legendItems = legend.items;
              var map = {};
              legendItems.map(function(item) {
                map[item.name] = Object.assign({}, item);//_.clone(item);
              });
              tooltipItems.map(function(item) {
                var name = item.name;
                var value = item.value;
                if (map[name]) {
                  map[name].value = value;
                }
              });
              legend.setItems(Object.values(map));*/
            },
            onHide: function onHide() {
              /*var legend = ddChart.get('legendController').legends.top[0];
              legend.setItems(ddChart.getLegendItems().country);*/
            }
          });

          ddChart.interval().position('district*num').color('name', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack').shape('text');
          ddChart.render()
          this.data.chartPre = ddChart;
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
  onButtonNavItemTap(e, index) {
    const { selectedNav, active } = this.data.dropdownSelectData;
    let nextactive = !active;
    if (selectedNav !== index) {
      nextactive = true;
    }

    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        active: nextactive,
        selectedNav: index,
      }
    });
    const alistData = this.data.dropdownSelectData.listData;
    //弹出日历
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: index == 0 ? this.data.startDate : this.data.endDate,
      startDate: index == 0 ? '' : this.data.startDate,
      endDate: index == 0 ? this.data.endDate : '',
      success: (res) => {
        alistData[index].nav = res.date;
        if (index == 0) {
          this.data.startDate = res.date;
        } else {
          this.data.endDate = res.date;
        }
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false,
            listData: alistData
          }
        });
        this.getDistrictChartData(this.data.chart);
      },
      fail: (res) => {
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false
          }
        })
      },
    });
  },
  handleTabClick({ index }) {
    this.data.tabIndex = index == 0 ? 1 : 2;
  },
  onItemClick(index) {
    console.log('index:')
    console.log(index)
    dd.navigateTo({
      url: "../district-statis/district-statis?taskId=" + this.data.items[index.index].id + "&district=" + this.data.items[index.index].district
        + "&startTime=" + this.data.startDate + "&endTime=" + this.data.endDate + "&status=" + this.data.items[index.index].status + "&tabIndex=" + this.data.tabIndex + "&areaCode=" + app.globalData.userInfo.areaCode,
      // url: "../task/visit/visit?id=" + this.data.items[data.index].id,
    });
  },
  onItemClickPre(index) {
    dd.navigateTo({
      url: "../district-statis/district-statis?taskId=" + this.data.itemsPre[index.index].id + "&district=" + this.data.itemsPre[index.index].district
        + "&status=" + this.data.itemsPre[index.index].status + "&tabIndex=" + this.data.tabIndex + "&areaCode=" + app.globalData.userInfo.areaCode,
    });
  }

})