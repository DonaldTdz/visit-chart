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
    items: [{
      name: '计划',
      district: '剑阁县',
      num: 500
    }, {
      name: '完成',
      district: '剑阁县',
      num: 300
    }, {
      name: '逾期',
      district: '剑阁县',
      num: 30
    }, {
      name: '计划',
      district: '昭化区',
      num: 550
    }, {
      name: '完成',
      district: '昭化区',
      num: 200
    }, {
      name: '逾期',
      district: '昭化区',
      num: 10
    },
    {
      name: '计划',
      district: '旺苍县',
      num: 800
    }, {
      name: '完成',
      district: '旺苍县',
      num: 700
    }, {
      name: '逾期',
      district: '旺苍县',
      num: 10
    }],
    districts: [{ district: '剑阁县', percent: 60 }, { district: '昭化区', percent: 45 }, { district: '旺苍县', percent: 85 }],
    itemsPre: [],
    districtsPre: [],
    tabs: [
      { title: '当前任务' },
      { title: '所有任务' },
    ],
    tabIndex: 1,
  },
  onLoad() {
    //this.setData({ items: [] });
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
            text: origin['num'],
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
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    //if (strDate >= 0 && strDate <= 9) {
    //  strDate = "0" + strDate;
    //}
    var lastDay = new Date(year, month, 0);
    var endDay = lastDay.getDate();
    var currentdate = year + seperator1 + month + seperator1 + endDay;
    var startDate = year + seperator1 + month + seperator1 + '01';
    this.setData({
      startDate: startDate,
      endDate: currentdate
    });
    let alistData = this.data.dropdownSelectData.listData;
    alistData[0].nav = startDate;
    alistData[1].nav = currentdate;
    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        listData: alistData
      }
    });
  },
  onDraw(ddChart) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    this.getDistrictChartData(ddChart);
  },

  getDistrictChartData(ddChart) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetDistrictChartDataAsync',
      method: 'Get',
      data: {
        userId: app.globalData.userInfo.id,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        tabIndex: 2,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ districts: res.data.result.districts, items: res.data.result.items });
        const chartDataNew = this.data.items;
        console.log('chartDataNew.length:' + chartDataNew.length);
        var mg = 0.05;
        if (chartDataNew.length == 3) {
          mg = 1;
        }
        if (true) {
          ddChart.clear()
          this.addShape();
          ddChart.source(chartDataNew)
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
          })
          ddChart.axis('date', {
            label(text, index, total) {
              const textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              }
              if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              return textCfg;
            }
          })
          ddChart.interval().position('district*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).shape('text').adjust({
            type: 'dodge',
            marginRatio: mg // 设置分组间柱子的间距
          })
          ddChart.render()
          this.data.chart = ddChart;
        } else {
          ddChart.changeData(chartDataNew);
          ddChart.interval().position('district*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).shape('text').adjust({
            type: 'dodge',
            marginRatio: mg // 设置分组间柱子的间距
          })
          ddChart.render()
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
  onDrawPre(ddChart) {
    this.getDistrictChartDataPre(ddChart);
  },
  getDistrictChartDataPre(ddChart) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetDistrictChartDataAsync',
      method: 'Get',
      data: {
        userId: app.globalData.userInfo.id,
        tabIndex: 1,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ districtsPre: res.data.result.districts, itemsPre: res.data.result.items });
        const chartDataNew = this.data.itemsPre;
        console.log(this.data.itemsPre);
        if (!this.data.chartPre) {
          var mg = 0.05;
          if (chartDataNew.length == 3) {
            mg = 1;
          }
          ddChart.clear()
          this.addShape();
          ddChart.source(chartDataNew);
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
          })
          ddChart.axis('date', {
            label(text, index, total) {
              const textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              }
              if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              return textCfg;
            }
          })
          ddChart.interval().position('district*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).shape('text').adjust({
            type: 'dodge',
            marginRatio: mg // 设置分组间柱子的间距
          })
          ddChart.render()
          this.data.chartPre = ddChart;
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
  handleTabClick({ index }) {
    this.data.tabIndex = index == 0 ? 1 : 2;
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
  onItemDistrictClick(index) {
    console.log(index);
    //var searchStr = this.data.items[index.index].district + '-' + this.data.items[index.index].name;
    /*dd.navigateTo({
      url: "../detail/detail?areaCode=" + this.data.items[index.index].areaCode + "&searchStr=" + searchStr + "&district=" + this.data.items[index.index].district
        + "&startTime=" + this.data.startDate + "&endTime=" + this.data.endDate + "&status=" + this.data.items[index.index].status + "&tabIndex=" + this.data.tabIndex,
      // url: "../task/visit/visit?id=" + this.data.items[data.index].id,
    });*/
    dd.navigateTo({
      url: "dept/dept?startTime=" + this.data.startDate + "&endTime=" + this.data.endDate + "&id=" + this.data.districts[index.index].areaType + "&tabIndex=" + this.data.tabIndex,
    });
  },
  onItemDistrictClickPre(index) {
    //var searchStr = this.data.itemsPre[index.index].district + '-' + this.data.itemsPre[index.index].name;
    /*dd.navigateTo({
      url: "../detail/detail?areaCode=" + this.data.itemsPre[index.index].areaCode + "&searchStr=" + searchStr + "&district=" + this.data.itemsPre[index.index].district
        + "&status=" + this.data.itemsPre[index.index].status + "&tabIndex=" + this.data.tabIndex,
      // url: "../task/visit/visit?id=" + this.data.items[data.index].id,
    });*/
    //console.log(index)
    //console.log(this.data.districtsPre[index.index]);
    dd.navigateTo({
      url: "dept/dept?id=" + this.data.districtsPre[index.index].areaType + "&tabIndex=" + this.data.tabIndex,
    });
  }
})