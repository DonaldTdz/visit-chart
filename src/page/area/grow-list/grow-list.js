let app = getApp();

Page({
  data: {
    userInfo: {},
    items: [],
    id: null
  },

  onLoad(query) {
    if (query.id) {
      console.log(query.id);
      this.setData({ id: query.id });
      this.getEmployee();
      this.getGrowList();
    }
  },
  getEmployee() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetEmployessByIdAsync',
      method: 'Get',
      data: {
        id: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ userInfo: res.data.result });
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

  getGrowList() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/GetGrowListByIdAsync',
      method: 'Get',
      data: {
        id: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        this.setData({ items: res.data.result });
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
  onItemGrowerClick(grower) {
    //console.info(`grower: ${JSON.stringify(grower)}`);
    dd.navigateTo({
       url: "../grower/grower?id=" + this.data.items[grower.index].departmentId,
    });
  }
})