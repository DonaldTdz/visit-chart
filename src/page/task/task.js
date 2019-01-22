
import Dropdown from '../../components/dropdown';


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
    tabIndex:1
  },
  onLoad() {
    this.getNowFormatDate();
  },
  onReady() {

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
    /*ddChart.clear()
   
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
          map[item.name] = _.clone(item);
        });
        tooltipItems.map(function(item) {
          var name = item.name;
          var value = item.value;
          if (map[name]) {
            map[name].value = value;
          }
        });
        legend.setItems(_.values(map));
      },
      onHide: function onHide() {
        var legend = ddChart.get('legendController').legends.top[0];
        legend.setItems(ddChart.getLegendItems().country);
      }
    });

    ddChart.interval().position('task*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).adjust('stack');
    ddChart.render()*/
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
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ tasks: res.data.result.tasks, items: res.data.result.items });
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear()

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
              legendItems.map(function (item) {
                map[item.name] = _.clone(item);
              });
              tooltipItems.map(function (item) {
                var name = item.name;
                var value = item.value;
                if (map[name]) {
                  map[name].value = value;
                }
              });
              legend.setItems(_.values(map));
            },
            onHide: function onHide() {
              var legend = ddChart.get('legendController').legends.top[0];
              legend.setItems(ddChart.getLegendItems().country);
            }
          });

          ddChart.interval().position('district*num').color('name', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack');
          ddChart.render()
          this.data.chart = ddChart;
        } else {
          ddChart.changeData(chartDataNew);
        }
      },
      fail: function (res) {
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
        console.log('error:', res);
      },
      complete: function (res) {
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
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ tasksPre: res.data.result.tasks, itemsPre: res.data.result.items });
        const chartDataNew = this.data.itemsPre;
        if (!this.data.chartPre) {
          ddChart.clear()
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
              legendItems.map(function (item) {
                map[item.name] = _.clone(item);
              });
              tooltipItems.map(function (item) {
                var name = item.name;
                var value = item.value;
                if (map[name]) {
                  map[name].value = value;
                }
              });
              legend.setItems(_.values(map));
            },
            onHide: function onHide() {
              var legend = ddChart.get('legendController').legends.top[0];
              legend.setItems(ddChart.getLegendItems().country);
            }
          });

          ddChart.interval().position('district*num').color('name', ['#13C2C2', '#9AC2AB', '#FE5D4D']).adjust('stack');
          ddChart.render()
          this.data.chartPre = ddChart;
        } else {
          ddChart.changeData(chartDataNew);
        }
      },
      fail: function (res) {
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
        console.log('error:', res);
      },
      complete: function (res) {
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
    this.data.tabIndex=index==0?1:2;
    console.log(index)
  },
  onItemClick(index) {
    console.log('index:')
    console.log(index)
    dd.navigateTo({
      url: "../district-statis/district-statis?taskId=" + this.data.items[index.index].id + "&district=" + this.data.items[index.index].district
       + "&startTime=" + this.data.startDate + "&endTime=" + this.data.endDate + "&status=" + this.data.items[index.index].status+"&tabIndex="+this.data.tabIndex,
      // url: "../task/visit/visit?id=" + this.data.items[data.index].id,
    });
  }

})