// pages/order/orderList.js
var http = require('../../utils/httputils.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //stuats：订单状态 0:使用中 1:已逾期 2:待确认 3:已结算 4:已取消
    orderList: [],
    num: 1,
    isEmpty: true,
    nonetwork: false,
  },
  jumpToDetil: function (item) {
    console.log(item)
    var info = item.currentTarget.dataset.item;

    // if (info.paid == '0' && info.orderStatus != '2') {
      wx.navigateTo({
        url: '../order/orderDetil?data=' + item.currentTarget.dataset.item.orderNo,
        success: (res) => {
          console.log(res);
        }
      })
    // } else {
    //   wx.showToast({
    //     title: '支付待完成',
    //     icon: 'none',
    //     duration: 3000,
    //     mask: true
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    var that = this;
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      limit: 10,
      start: 1
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

  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      limit: 10,
      start: 1
    }
    this.getData(prams, false);
  },

  //网络请求，获取数据
  getData(prams, ismore) {
    var that = this
    // var prams = {
    //   openId: app.globalData.openId || wx.getStorageSync('openId'),
    //   limit: 10,
    //   start: that.data.num
    // }
    http.postRequest("/order/page", prams,
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
            var orderList = that.data.orderList.concat(res.data.list)
            that.setData({
              orderList
            })
            console.log(that.data.orderList)
          } else {
            console.log("---------------------")
            that.setData({
              orderList: res.data.list,
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
              title: '当前没有订单',
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.onRefresh();
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
      start: this.data.num
    }
    this.getData(prams, true);
  },


})