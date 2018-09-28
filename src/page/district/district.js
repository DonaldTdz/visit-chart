let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
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
    districts: [{ name: '剑阁县', percent: '60%' }, { name: '昭化区', percent: '45%' }, { name: '旺苍县', percent: '85%'}],
  },
  onLoad() {

  },
  onReady() {

  },
  onDraw(ddChart) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    ddChart.clear()
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
  }
})