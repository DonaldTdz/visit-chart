let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    width: 200,
    height: 200,
    chart: null,
    showChart: false,
    items: [{ name: '完成', num: 0, percent: 0, a: '1', className: 'complete' },
    { name: '待完成', num: 0, percent: 0, a: '1', className: 'process' },
    { name: '逾期', num: 0, percent: 0., a: '1', className: 'overdue' }],
    arr: {
      onItemTap: 'onGridItemTap',
      list: [
        {
          icon: '/images/dodge.png',
          title: '区县统计',
          page: '../district/district',
        }, {
          icon: '/images/bar.png',
          title: '任务统计',
          page: '../task/task',
        }, {
          icon: '/images/column.png',
          title: '按月统计',
          page: '../month/month',
        }
      ],
    }
  },
  loginSystem() {
    if (app.globalData.userInfo.id == '') {
      dd.showLoading();
      //免登陆
      dd.getAuthCode({
      success: (res) => {
      //  console.log('My authCode', res.authCode);
      dd.httpRequest({
        url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
        method: 'Get',
        data: {
          code: res.authCode,
          appId: app.globalData.appId
        },
        dataType: 'json',
        success: (res) => {
          dd.hideLoading();
          //console.log('res', res);
          app.globalData.userInfo = res.data.result;
          if (app.globalData.userInfo.avatar == '') {
            app.globalData.userInfo.avatar = '../../images/logo.jpeg';
          }
          this.setData({ userInfo: app.globalData.userInfo });
          this.getScheduleSummary();
        },
        fail: function(res) {
          dd.hideLoading();
          dd.alert({ content: '获取用户信息异常', buttonText: '确定' });
        },
        complete: function(res) {
          dd.hideLoading();
          //dd.alert({ content: 'complete' });
        }
      });
      },
      fail: function(err) {
        dd.alert({ content: '授权出错', buttonText: '确定'});
        dd.hideLoading();
      }
    });
    } else {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getScheduleSummary();
    }
  },
  onLoad() {
    //this.setData({items:[]});
    this.loginSystem();
  },
  getScheduleSummary() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetScheduleSummaryAsync',
      method: 'Get',
      data: {
        userId: this.data.userInfo.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        //console.log('res', res.data.result);
        this.setData({ items: res.data.result });
        for (var i in this.data.items){
          if (this.data.items[i].num > 0){
            this.setData({ showChart: true});
            break;
          }
        }
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定'});
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  onDraw(ddChart) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    ddChart.clear()
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetScheduleSummaryAsync',
      method: 'Get',
      data: {
        userId: this.data.userInfo.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ items: res.data.result });
        var map = {};
        const chartDataNew = this.data.items;
        chartDataNew.map(function(obj) {
          map[obj.name] = obj.percent + '%';
        });
        ddChart.source(chartDataNew, {
          percent: {
            formatter: function formatter(val) {
              return val + '%';
            }
          }
        })
        ddChart.legend({
          position: 'bottom',
          marker: 'square',
          align: 'center',
          itemFormatter: function itemFormatter(val) {
            return val + '    ' + map[val];
          }
        })
        ddChart.tooltip(false)
        ddChart.coord('polar', {
          transposed: true,
          radius: 0.85,
          innerRadius: 0.618
        })
        ddChart.axis(false);
        ddChart.interval().position('a*percent').color('name', ['#13C2C2', '#9AC2AB','#FE5D4D']).adjust('stack').style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });
        //ddChart.guide().html({
        //  position: ['50%', '45%'],
        //  html: '<div style="width: 250px;height: 40px;text-align: center;">' + '<div style="font-size: 16px">计划总数</div>' + '<div style="font-size: 24px">120</div>' + '</div>'
        //});
        let total = 0;
        for (var i in chartDataNew) {
          total += chartDataNew[i].num;
        }
        ddChart.guide().text({
          position: ['50%', '50%'],
          content: total,
          style: {
            fontSize: 18
          }
        });
        ddChart.render();
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
  onGridItemTap(e) {
    const curIndex = e.currentTarget.dataset.index;
    const pageNav = this.data.arr.list[curIndex];
    dd.navigateTo({
      url: pageNav.page,
    });
  },
  onItemTClick(data){
    dd.navigateTo({
      url: "../district-statis/district-statis?status=" + this.data.items[data.index].status+"&tabIndex=1",
    });
  }
})