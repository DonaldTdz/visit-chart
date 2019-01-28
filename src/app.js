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
    //host: 'http://gyapi.intcov.com/',
    // host: 'http://hechuangdd.vaiwan.com/',
    host: 'http://127.0.0.1:21021/',
    corpId:'',
    appId: 8
  }
});