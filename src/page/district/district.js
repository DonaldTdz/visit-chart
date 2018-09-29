import Dropdown from '../../components/dropdown';
let app = getApp()

Page({
  ...Dropdown,
  data: {
    width: 200,
    height: 200,
    chart: null,
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
  },
  onLoad() {
    this.getNowFormatDate();
  },
  onReady() {

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
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
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
    ddChart.clear()
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetDistrictChartDataAsync',
      method: 'Get',
      data: {
        userId: app.globalData.userInfo.id,
        startDate: this.data.startDate,
        endDate: this.data.endDate
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ districts: res.data.result.districts, items: res.data.result.items })
        const chartDataNew = this.data.items;
        ddChart.source(chartDataNew)
        ddChart.tooltip({

          custom: true, // 自定义 tooltip 内容框
          onChange: function onChange(obj) {
            var legend = chart.get('legendController').legends.top[0];
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
            var legend = chart.get('legendController').legends.top[0];
            legend.setItems(chart.getLegendItems().country);
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
        ddChart.interval().position('district*num').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).adjust({
          type: 'dodge',
          marginRatio: 0.05 // 设置分组间柱子的间距
        })
        ddChart.render()
      },
      fail: function(res) {
        dd.alert({ content: '获取数据异常' });
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
      },
    });
  },
})