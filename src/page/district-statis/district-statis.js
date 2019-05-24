// import Dropdown from '../../components/dropdown';
import F2 from '@antv/my-f2';
let app = getApp()
Page({
  data: {
    items: [],
    tasks: [],
    chart: null,
    dropdownSelectData: {
      active: false,
      selectedNav: 0,
      dateString: '',
      areaCode: null,
      district: '',
      taskId: null,
      startTime: null,
      endTime: null,
      status: null,
      statusName: '',
      // pageIndex: 0,
      searchStr: '',
      tabIndex: 0,
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
  },
  onLoad(query) {
    this.cleanData();
    console.log('query:')
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
    this.data.areaCode = query.areaCode
    this.data.district = query.district;
    this.data.taskId = query.taskId;
    this.data.startTime = query.startTime;
    this.data.endTime = query.endTime;
    this.data.status = query.status;
    this.data.dateString = query.dateString;
    this.data.tabIndex = query.tabIndex;
    this.data.statusName = this.data.status == 1 ? '计划' : (this.data.status == 2 ? '完成' : (this.data.status == 3 ? '待完成' : (this.data.status == 0 ? '逾期' : '')));
    var dateStr = '';
    if (this.data.tabIndex == 0) {
      dateStr = this.data.dateString != null ? '[' + this.data.dateString + ']' : '';
    } else if (this.data.tabIndex == 1) {
      dateStr = '当前任务' + '-';
    } else {
      dateStr = '所有任务' + (this.data.startTime != null ? '[' + this.data.startTime + '至' + this.data.endTime + ']' : '') + '-';
    }
    this.data.searchStr = dateStr + (this.data.district != null ? this.data.district + '-' : '') + this.data.statusName + '汇总';
    // this.getSheduleDetail();
  },

  //获取任务明细(区县统计)
  getSheduleDetail() {
    console.log(this.data.status);
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetSheduleDetailGroupArea',
      method: 'Get',
      data: {
        areaCode: this.data.areaCode,
        taskId: this.data.taskId,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        status: this.data.status,
        dateString: this.data.dateString,
        tabIndex: this.data.tabIndex,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ items: res.data.result });
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取任务异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  cleanData() {
    this.setData({
      items: [],
      areaCode: null,
      district: '',
      taskId: null,
      startTime: null,
      endTime: null,
      status: null,
      statusName: '',
      // pageIndex: 0,
      searchStr: '',
      tabIndex: 0,
    });
  },
  onItemClick(data) {
    // var str = "&areaCode=" + this.data.items[data.index].areaCode;
    // str += this.data.status != undefined ? "&status=" + this.data.status : '';
    // str += this.data.district != undefined ? "&district=" + this.data.district : '';
    // str += this.data.taskId != undefined ? "&taskId=" + this.data.taskId : '';
    // str += this.data.startTime != undefined ? "&startTime=" + this.data.startTime : '';
    // str += this.data.endTime != undefined ? "&endTime=" + this.data.endTime : '';
    // str += this.data.dateString != undefined ? "&dateString=" + this.data.dateString : '';
    // str += this.data.tabIndex != undefined ? "&tabIndex=" + this.data.tabIndex : '';
    // dd.navigateTo({
    //   url: "../detail/detail?searchStr=" + this.data.searchStr.slice(0, this.data.searchStr.length - 2) + str,
    // });
        dd.navigateTo({
      url: "../district-statis/comm-statis/comm-statis?id=" + data.index + "&status="+this.data.status,
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
  onDraw(ddChart) {
    this.getDistrictChartData(ddChart);
  },
  getDistrictChartData(ddChart) {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetStatusChartDataAsync',
      method: 'Get',
      data: {
        areaCode: app.globalData.userInfo.areaCode,
        status: this.data.status
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        // this.setData({ districtsPre: res.data.result.districts, itemsPre: res.data.result.items });
        this.setData({ items: res.data.result.areaItemByStatus, tasks: res.data.result.tasksByStatus });
        const chartDataNew = this.data.tasks;
        // console.log(this.data.items);
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
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
})