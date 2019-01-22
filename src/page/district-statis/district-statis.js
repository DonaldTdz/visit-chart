import Dropdown from '../../components/dropdown';
let app = getApp()
Page({
  data: {
    items: [],
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
    this.data.district = query.district ;
    this.data.taskId = query.taskId ;
    this.data.startTime = query.startTime ;
    this.data.endTime = query.endTime ;
    this.data.status = query.status ;
    this.data.dateString = query.dateString ;
    this.data.tabIndex = query.tabIndex;
    this.data.statusName = this.data.status == 1 ? '计划' : (this.data.status == 2 ? '完成' : (this.data.status == 3 ? '待完成' : (this.data.status == 0 ? '逾期' : '')));
    var dateStr = '';
    if (this.data.tabIndex == 0) {
      dateStr = this.data.dateString != null ? '['+this.data.dateString + ']' : '';
    } else if (this.data.tabIndex == 1) {
      dateStr = '当前任务' + '-';
    } else {
      dateStr = '所有任务' + (this.data.startTime != null ? '[' + this.data.startTime + '至' + this.data.endTime + ']' : '') + '-';
    }
    this.data.searchStr = dateStr + (this.data.district != null ? this.data.district + '-' : '') + this.data.statusName + '汇总';
    this.getSheduleDetail();
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
      fail: function (res) {
        dd.hideLoading();
        dd.alert({ content: '获取任务异常', buttonText: '确定' });
      },
      complete: function (res) {
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
    var str ="&areaCode=" + this.data.items[data.index].areaCode;
    str += this.data.status != undefined ? "&status=" + this.data.status : '';
    str += this.data.district != undefined ? "&district=" + this.data.district : '';
    str += this.data.taskId != undefined ? "&taskId=" + this.data.taskId : '';
    str += this.data.startTime != undefined ? "&startTime=" + this.data.startTime : '';
    str += this.data.endTime != undefined ? "&endTime=" + this.data.endTime : '';
    str += this.data.dateString != undefined ? "&dateString=" + this.data.dateString : '';
    str += this.data.tabIndex != undefined ? "&tabIndex=" + this.data.tabIndex : '';
    dd.navigateTo({
      url: "../detail/detail?searchStr="+this.data.searchStr.slice(0,this.data.searchStr.length-2) + str ,
    });
  }
})