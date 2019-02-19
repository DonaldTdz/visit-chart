let app = getApp();
Page({
  data: {
    id: '',//烟农Id
    vgDetail: {},
    host: '',
  },
  onLoad(query) {
    this.setData({ id: query.id, host: app.globalData.host });
    //this.getVisitGrowerDetail();
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
        this.setData({ vgDetail: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取烟农详情异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  goAreaDetail(data) {
    dd.navigateTo({
      url: "../area-detail/area-detail?id=" + this.data.vgDetail.visitRecords[data.index].id,
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '烟农详情',
      desc: '烟农详情页',
      path: 'pages/area/grower/grower',
    };
  },
});
