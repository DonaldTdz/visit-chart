App({
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
    // this.globalData.sysInfo = dd.getSystemInfoSync();
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    // sysInfo:{},
    // host: 'http://gy.intcov.com/',
    host: 'http://hechuangdd.vaiwan.com/',
    //host: 'http://www.scgyyc.com/',
    // host: 'http://127.0.0.1:21021/',
    // host: 'http://yangfan.vaiwan.com/',
    corpId: '',
    appId: 8
  }
});