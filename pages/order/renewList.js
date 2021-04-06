// pages/order/renewList.js
var http = require('../../utils/httputils.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    param: '', // 页面传递参数
    renewList: [],
    num: 1,
    isEmpty: true,
    nonetwork: false,
    batteryId: 0,
    orderNo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let data = options.data;
    this.setData({
      param: data
    })
    console.log(this.data.param)
    if (options.type == "battery") {
      this.data.batteryId = data
    } else {
      this.data.orderNo = data
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //网络请求，获取数据
  getData(prams, ismore) {
    var that = this
    http.postRequest("/order/renewOrder", prams,
      function (res) {
        //隐藏loading 提示框
        wx.hideLoading();
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
        if (res.data.list.length > 0) {
          console.log(ismore)
          if (ismore) {
            console.log("ismore---------------------")
            var renewList = that.data.renewList.concat(res.data.list)
            that.setData({
              renewList
            })
            console.log(that.data.renewList)
          } else {
            console.log("---------------------")
            that.setData({
              renewList: res.data.list,
              isEmpty: false
            })
          }
        } else {
          if (ismore) {
            wx.showToast({
              title: '到底啦～',
              icon: 'none',
              duration: 3000,
              mask: true
            })
          } else {
            wx.showToast({
              title: '当前没有续费订单',
              icon: 'none',
              duration: 3000,
              mask: true
            })
          }
        }

      },
      function (err) {

      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      limit: 10,
      start: 1,
      orderNo: that.data.orderNo,
      batteryId: that.data.batteryId
    }
    that.getData(prams, false);
    that.setData({
      nonetwork: app.globalData.nonetwork,
    })
    console.log(app.globalData.nonetwork)
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      limit: 10,
      start: 1,
      orderNo: this.data.orderNo,
      batteryId: this.data.batteryId
    }
    this.getData(prams, false);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
    this.setData({
      num: this.data.num + 1
    })
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      limit: 10,
      orderNo: this.data.orderNo,
      batteryId: this.data.batteryId,
      start: this.data.num
    }
    this.getData(prams, true);
  },

  
})