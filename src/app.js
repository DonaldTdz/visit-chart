App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    //host: 'http://gy.intcov.com/',
    //host: 'http://hechuangdd.vaiwan.com/',
    host: 'http://www.scgyyc.com/',
    corpId:'',
    appId: 8
  }
});