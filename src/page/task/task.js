
const chartDataNew = [{
  name: '完成',
  task: '备耕',
  num: 500
}, {
    name: '进行中',
    task: '备耕',
    num: 300
  }, {
    name: '逾期',
    task: '备耕',
    num: 30
  }, {
    name: '完成',
    task: '移栽',
    num: 550
  }, {
    name: '进行中',
    task: '移栽',
    num: 200
  }, {
    name: '逾期',
    task: '移栽',
    num: 10
  },
  {
    name: '完成',
    task: '田管',
    num: 800
  }, {
    name: '进行中',
    task: '田管',
    num: 700
  }, {
    name: '逾期',
    task: '田管',
    num: 10
  },
  {
    name: '完成',
    task: '质保病种害',
    num: 800
  }, {
    name: '进行中',
    task: '质保病种害',
    num: 700
  }, {
    name: '逾期',
    task: '质保病种害',
    num: 10
  },
  {
    name: '完成',
    task: '烘烤',
    num: 800
  }, {
    name: '进行中',
    task: '烘烤',
    num: 700
  }, {
    name: '逾期',
    task: '烘烤',
    num: 10
  },
  {
    name: '完成',
    task: '分级',
    num: 800
  }, {
    name: '进行中',
    task: '分级',
    num: 700
  }, {
    name: '逾期',
    task: '分级',
    num: 10
  }]

let app = getApp()

Page({
  data: {
    width: 200,
    height: 200,
    chart: null,
  },
  onLoad() {
  },
  onReady() {

  },
  onDraw(ddChart, F2) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
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
    ddChart.render()
  }
})