
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
    tasks:[],
    areaItem: [],
    type: null,
    status: null,
    tabIndex:1
  },
  onLoad(query) {
    // console.log(query);
    this.setData({ id: query.id, status: query.status });
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
  onDraw(ddChart, F2) {
    this.getDistrictChartData(ddChart, F2);
  },
  getDistrictChartData(ddChart, F2) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetStatusTaskCommChartAsync',
      method: 'Get',
      data: {
        deptIdOrAreaCode: this.data.id,
        status: this.data.status,
        type: this.data.type,
        areaCode: app.globalData.userInfo.areaCode
      },
      dataType: 'json',
      success: (res) => {
               dd.hideLoading();
        // this.setData({ districtsPre: res.data.result.districts, itemsPre: res.data.result.items });
        this.setData({ items: res.data.result.areaItem, tasks: res.data.result.tasks });
        const chartDataNew = this.data.tasks;
        console.log(this.data.items);
        if (!this.data.chart) {
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
          ddChart.interval().position('taskName*num').color('taskName', ['#1890FF', '#13C2C2']).shape('text').adjust({
            type: 'dodge',
            marginRatio: mg // 设置分组间柱子的间距
          })
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
  onItemClick(index) {
    const row = this.data.items[index.index]
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
          + "&tabIndex=" + this.data.tabIndex
          + "&status="+this.data.status
      });
    }
  },
})