// pages/order/orderDetil.js
var http = require('../../utils/httputils.js');
let time = require('../../utils/util.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    endtime: ''

  },
  jumpToRenewList: function (e) {
    console.log(this.data.item.orderNo)
    wx.navigateTo({
      url: '../order/renewList?data=' + this.data.item.orderNo + '&type=detil',
      success: (res) => {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = options.data;
    this.setData({
      param: data
    })
    console.log(this.data.param);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
  },
  //网络请求，获取数据
  getData() {
    var that = this
    var prams = {
      orderNo: that.data.param
    }
    http.postRequest("/order/detail", prams,
      function (res) {
        var date = new Date(res.data.order.endTime.replace(/-/, "/"))
        console.log(date);
        // if (res.data.list.length > 0) {
        // console.log(that.getData())
        console.log(time.formatDate(date, 'Y/M/D'))
        that.setData({
          item: res.data.order,
          endtime: time.formatDate(date, 'Y/M/D')
        })
        // }


      },
      function (err) {

      })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }


})