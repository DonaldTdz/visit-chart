let app = getApp();
Page({
  data: {
    id: '',
    vgDetail: {},
    isGetPosition: false,
    longitude: 0,
    latitude: 0,
    host: ''
  },
  onLoad(query) {
    this.setData({ id: query.id, host: app.globalData.host });
    // 页面加载
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onShow() {
    // 页面显示
    this.getVisitGrowerDetail();
  },
  getVisitGrowerDetail() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingVisitGrowerDetailAsync',
      method: 'Get',
      data: {
        scheduleDetailId: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ vgDetail: res.data.result });
        if (res.data.result.growerInfo.longitude && res.data.result.growerInfo.latitude) {
          this.setData({ isGetPosition: true, longitude: res.data.result.growerInfo.longitude, latitude: res.data.result.growerInfo.latitude });
        }
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取烟农详情异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  goAreaDetail(data) {
    dd.navigateTo({
      url: "../../area/grower-area/grower-area?id=" + this.data.vgDetail.visitRecords[data.index].id,
    });
  },
  goDetail(data) {
    dd.navigateTo({
      url: "./visit-detail/visit-detail?id=" + this.data.vgDetail.visitRecords[data.index].id,
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拜访详情',
      desc: '拜访详情页',
      path: 'pages/task/visit/visit',
    };
  },
});