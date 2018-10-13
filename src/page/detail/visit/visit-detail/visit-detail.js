let app = getApp();
Page({
  data: {
    id: '',
    host: '',
    visit: {},
  },
  onLoad(query) {
    this.setData({ id: query.id, host: app.globalData.host });
    console.info(`visit-detail Page onLoad with query: ${JSON.stringify(query)}`);
    this.getVisitRecord();
  },
  previewImage() {
    var that = this;
    dd.previewImage({
      current: 0,
      urls: [
        this.data.host + this.data.visit.imgPath
      ],
    });
  },
  onCardClick() {
    dd.openLocation({
      longitude: this.data.visit.longitude,
      latitude: this.data.visit.latitude,
      name: '烟农-' + this.data.visit.growerName,
      address: this.data.visit.location,
    });
  },
  getVisitRecord() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/VisitRecord/GetDingDingVisitRecordAsync',
      method: 'Get',
      data: {
        id: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        const result = res.data.result;
        if (result.employeeImg == '') {
          result.employeeImg = '../../../../images/logo.jpeg';
        }
        this.setData({ visit: result });
      },
      fail: function(res) {
        dd.hideLoading();
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
});
