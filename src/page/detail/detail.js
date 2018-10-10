import Dropdown from '../../components/dropdown';
let app = getApp()

Page({
  ...Dropdown,
  data: {
    array: ['中国', '美国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国',
      },
      {
        id: 1,
        name: '中国',
      },
      {
        id: 2,
        name: '巴西',
      },
      {
        id: 3,
        name: '日本',
      },
    ],
    index: 0,
    arrIndex: 0,
    dropdownSelectData: {
      active: false,
      selectedNav: 0,
      dateString:'',
      areaCode: null,
      taskType: null,
      taskId: null,
      startTime: null,
      endTime: null,
      status: null,
      tstatus: null,
      pageIndex:0,
      input: { areaCode: null, taskType: null, taskId: null, taskName: '', startTime: null, endTime: '', status: null, employeeName: '', growerName: '' },
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
    areaes: [
      { id: 1, name: '昭化区' },
      { id: 2, name: '剑阁县' },
      { id: 3, name: '旺苍县' }
    ],
    status: [
      { id: 0, name: '已逾期' },
      { id: 2, name: '进行中' },
      { id: 3, name: '已完成' },
    ],
    areaIndex: 0,
    staIndex: 0,
    items: [],
  },
  //获取默认时间（当月的第一天和最后一天）
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    var startDate = year + seperator1 + month + seperator1 + '01';
    this.setData({
      startDate: startDate,
      endDate: currentdate
    });
    let alistData = this.data.dropdownSelectData.listData;
    alistData[0].nav = startDate;
    alistData[1].nav = currentdate;
    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        listData: alistData
      }
    });
  },

  onLoad(query) {
    this.cleanData();
    console.log('query:')
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
    this.data.areaCode = query.areaCode;
    this.data.taskId = query.taskId;
    this.data.startTime = query.startTime;
    this.data.endTime = query.endTime;
    this.data.status = query.status;
    this.data.tstatus = query.tstatus;
    this.data.dateString = query.dateString;
    this.getSheduleDetail();
  },

  //获取任务明细
  getSheduleDetail() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Chart/GetSheduleDetail',
      method: 'Get',
      data: {
        areaCode: this.data.areaCode,
        taskId: this.data.taskId,
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        status: this.data.status,
        tstatus: this.data.tstatus,
        dateString: this.data.dateString,
      },
      dataType: 'json',
      success: (res) => {
        // this.setData({ items: res.data.result.items });
        const datas = res.data.result;
        if (datas.length < 15) {
          this.setData({ pageIndex: -1 });
        } else {
          var pindex = this.data.pageIndex + 15;
          this.setData({ pageIndex: pindex });
        }
        var tempItems = this.data.items;
        if (datas.length > 0) {
          for (var i in datas) {
            tempItems.push(datas[i]);
          }
          this.setData({ items: tempItems });
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取任务列表异常' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  onButtonNavItemTap(e, index) {
    const { selectedNav, active } = this.data.dropdownSelectData;
    let nextactive = !active;
    if (selectedNav !== index) {
      nextactive = true;
    }

    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        active: nextactive,
        selectedNav: index,
      }
    });
    const alistData = this.data.dropdownSelectData.listData;
    //弹出日历
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: index == 0 ? this.data.startDate : this.data.endDate,
      startDate: index == 0 ? '' : this.data.startDate,
      endDate: index == 0 ? this.data.endDate : '',
      success: (res) => {
        alistData[index].nav = res.date;
        if (index == 0) {
          this.data.startDate = res.date;
        } else {
          this.data.endDate = res.date;
        }
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false,
            listData: alistData
          }
        });
        // this.getDistrictChartData(this.data.chart);
      },
      fail: (res) => {
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false
          }
        })
      },
    });
  },
  //区域改变事件
  bindAreaChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      areaIndex: e.detail.value,
    });
    this.input.areaCode = areas[areaIndex].value;
  },
  //任务状态改变事件
  bindStatusChange(e) {
    this.setData({
      staIndex: e.detail.value,
    });
    this.input.status = status[staIndex].value;
  },
  cleanData() {
    this.setData({
      items: [],
      pageIndex: 0
    });
  },
  goVisit(data){
    dd.redirectTo({
      // url: "../detail/visit/visit?id=" + this.data.items[data.index].id,
      // url: "../detail/visit/visit?id=" + this.data.items[data.index].id,
      url: "./visit/visit?id=" + this.data.items[data.index].id,
     });
   }
})
