
import F2 from '@antv/my-f2';

let app = getApp()

Page({
  data: {
    id: null,
    width: 200,
    height: 200,
    chart: null,
    startTime: '',
    endTime: '',
    items: [],
    areaItem: [],
    type: null,
    tabIndex: 0
  },
  onLoad(query) {
    // console.log(query);
    this.setData({ id: query.id, startTime: query.startTime, endTime: query.endTime, tabIndex: query.tabIndex });
  },
  onReady() {
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
  onDraw(ddChart, F2) {
    this.getDistrictChartData(ddChart, F2);
  },
  getDistrictChartData(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetTaskCommChartByGroupAsync',
      method: 'Get',
      data: {
        deptIdOrAreaCode: this.data.id,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        tabIndex: this.data.tabIndex,
        type: this.data.type,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
        // this.setData({ tasks: res.data.result.tasks, items: res.data.result.items });
        this.setData({ areaItem: res.data.result.areaItem, items: res.data.result.items });
        const chartDataNew = this.data.items;
        const percent = res.data.result.tasks;
        if (!this.data.chart) {
          ddChart.clear()
          ddChart.guide().clear();
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
          });
          // 辅助元素
          percent.forEach(function(obj, index) {
            // 文字部分
            ddChart.guide().text({
              position: [obj.taskName, 'median'],
              content: '完成率：' + obj.percent + '%',
              style: {
                fill: '#DC143C',
                fontSize: '13',
                // fontWeight: 'bold', // 文本粗细
                textBaseline: 'bottom',
                textAlign: 'left'
              },
              offsetX: 8,
              offsetY: 8
            });
          });
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
          ddChart.guide().clear();
          ddChart.repaint()
          percent.forEach(function(obj, index) {
            ddChart.guide().text({
              position: [obj.taskName, 'median'],
              content: '完成率：' + obj.percent + '%',
              style: {
                fill: '#DC143C',
                fontSize: '13',
                // fontWeight: 'bold', // 文本粗细
                textBaseline: 'bottom',
                textAlign: 'left'
              },
              offsetX: 8,
              offsetY: 8
            });
          });
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
  onItemClick(index) {
    const row = this.data.areaItem[index.index]
    if (row.type == 'dept') {
      this.data.id = row.deptId;
      this.data.type = 'dept';
      this.onDraw(this.data.chart);
    } else if (row.type == 'other') {
      this.data.type = 'other';
      this.onDraw(this.data.chart);
    } else {
      //employee
      dd.navigateTo({
        url: "../../detail/detail?employeeId=" + row.deptId
          + (this.data.startTime ? "&startTime=" + this.data.startTime : '')
          + (this.data.endTime ? "&endTime=" + this.data.endTime : '')
          + "&type=" + row.type
          + "&tabIndex=" + this.data.tabIndex,
      });
    }
  },
})