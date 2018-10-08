
const chartDataNew = [{
  name: '完成',
  month: '2018-01',
  num: 500
}, {
    name: '进行中',
    month: '2018-01',
    num: 300
  }, {
    name: '逾期',
    month: '2018-01',
    num: 30
  }, {
    name: '完成',
    month: '2018-02',
    num: 550
  }, {
    name: '进行中',
    month: '2018-02',
    num: 200
  }, {
    name: '逾期',
    month: '2018-02',
    num: 10
  },
  {
    name: '完成',
    month: '2018-03',
    num: 800
  }, {
    name: '进行中',
    month: '2018-03',
    num: 700
  }, {
    name: '逾期',
    month: '2018-03',
    num: 10
  },
  {
    name: '完成',
    month: '2018-04',
    num: 800
  }, {
    name: '进行中',
    month: '2018-04',
    num: 700
  }, {
    name: '逾期',
    month: '2018-04',
    num: 10
  },
  {
    name: '完成',
    month: '2018-05',
    num: 800
  }, {
    name: '进行中',
    month: '2018-05',
    num: 700
  }, {
    name: '逾期',
    month: '2018-05',
    num: 10
  },
  {
    name: '完成',
    month: '2018-06',
    num: 800
  }, {
    name: '进行中',
    month: '2018-06',
    num: 700
  }, {
    name: '逾期',
    month: '2018-06',
    num: 10
  }, 
  /*{
    name: '完成',
    month: '2018-07',
    num: 500
  }, {
    name: '进行中',
    month: '2018-07',
    num: 300
  }, {
    name: '逾期',
    month: '2018-07',
    num: 30
  }, {
    name: '完成',
    month: '2018-08',
    num: 550
  }, {
    name: '进行中',
    month: '2018-08',
    num: 200
  }, {
    name: '逾期',
    month: '2018-08',
    num: 10
  },
  {
    name: '完成',
    month: '2018-09',
    num: 800
  }, {
    name: '进行中',
    month: '2018-09',
    num: 700
  }, {
    name: '逾期',
    month: '2018-09',
    num: 10
  },
  {
    name: '完成',
    month: '2018-10',
    num: 800
  }, {
    name: '进行中',
    month: '2018-10',
    num: 700
  }, {
    name: '逾期',
    month: '2018-10',
    num: 10
  },
  {
    name: '完成',
    month: '2018-11',
    num: 800
  }, {
    name: '进行中',
    month: '2018-11',
    num: 700
  }, {
    name: '逾期',
    month: '2018-11',
    num: 10
  },
  {
    name: '完成',
    month: '2018-12',
    num: 800
  }, {
    name: '进行中',
    month: '2018-12',
    num: 700
  }, {
    name: '逾期',
    month: '2018-12',
    num: 10
  }*/
  ]

let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
    selectedIndex: 0,
    values: ['近半年', '近一年'],
  },
  onLoad() {
   
  },
  onReady() {

  },
  onDraw(ddChart) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面

    this.getDistrictChartData(ddChart);

  //   ddChart.clear()
  //   ddChart.source(chartDataNew, {
  //     sales: {
  //       tickCount: 5
  //     }
  //   })
  //   ddChart.tooltip(false)
  //   ddChart.axis('date', {
  //     label(text, index, total) {
  //       const textCfg = {};
  //       if (index === 0) {
  //         textCfg.textAlign = 'left';
  //       }
  //       if (index === total - 1) {
  //         textCfg.textAlign = 'right';
  //       }
  //       return textCfg;
  //     }
  //   })
  //   ddChart.tooltip({
  //     custom: true, // 自定义 tooltip 内容框
  //     onChange: function onChange(obj) {
  //       var legend = ddChart.get('legendController').legends.top[0];
  //       var tooltipItems = obj.items;
  //       var legendItems = legend.items;
  //       var map = {};
  //       legendItems.map(function(item) {
  //         map[item.name] = _.clone(item);
  //       });
  //       tooltipItems.map(function(item) {
  //         var name = item.name;
  //         var value = item.value;
  //         if (map[name]) {
  //           map[name].value = value;
  //         }
  //       });
  //       legend.setItems(_.values(map));
  //     },
  //     onHide: function onHide() {
  //       var legend = ddChart.get('legendController').legends.top[0];
  //       legend.setItems(ddChart.getLegendItems().country);
  //     }
  //   });
  //   ddChart.interval().position('month*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).adjust('stack');
  //   ddChart.render()
  },

  getDistrictChartData(ddChart) {

    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetChartByMothAsync',
      method: 'Get',
      data: {
        // userId: app.globalData.userInfo.id,
        startTime: this.data.startDate,
        endTime: this.data.endDate
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ items: res.data.result })
        const chartDataNew = this.data.items;
        if (!this.data.chart) {
          ddChart.clear()
          ddChart.source(chartDataNew, {
            sales: {
              tickCount: 5
            }
          })
          ddChart.tooltip(false)
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
          ddChart.interval().position('district*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).adjust('stack');
          ddChart.render();
          this.data.chart = ddChart;
          
        }else{
          ddChart.changeData(chartDataNew);
          
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取数据异常' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
      
      });
  },

  handleChange: function({ index, value }) {
    this.setData({
      selectedIndex: index,
    });
    this.getDistrictChartData(this.data.chart);
  },

  handleItemTap: function({ index, value }) {
    // dd.showToast({
    //   content: `handleItemTap[index:${index},value:${value}]`,
    //   duration: 1000,
    // });
  },
})