// pages/battery/battery.js
var http = require('../../utils/httputils.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: 0, //默认显示位置
    isEmpty: true,
    nonetwork: false,
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e)
    const index = Number(e.detail.value)
    this.setData({
      index
    })
  },
  refresh: function (e) {
    var that = this
    that.onLoad()
  },
  jumpToRenewList: function (e) {
    var data = this.data.array[this.data.index].batteryId
    wx.navigateTo({
      url: '../order/renewList?data=' + data + '&type=battery',
      success: (res) => {
        console.log(res);
      }
    })
  },
  jumpToRenew: function (e) {
    var that = this
    var prams = {
      batteryId: this.data.array[this.data.index].batteryId,
    }
    http.postRequest("/battery/getBatteryById", prams,
      function (res) {
        console.log(res);
        if (res.errcode == 200) {
          var batteryInfo = JSON.stringify(res.data.battery);
          wx.navigateTo({
            url: '../lease/lease?data=' + batteryInfo,
            success: (res) => {
              console.log(res);
            }
          })
        } else {
          wx.hideLoading()  // 先调用hide
          wx.showToast({
            title: res.errmsg,
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      },
      function (err) {

      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // var prams = {
    //   openId: app.globalData.openId || wx.getStorageSync('openId'),
    // }
    // http.postRequest("/battery/getBatteryByOpenId", prams,
    //   function (res) {
    //     console.log(res);
    //     if (res.errcode == 200) {
    //       const array = res.data.list
    //       if (array.length > 0) {
    //         that.setData({
    //           array,
    //           isEmpty: false
    //         })
    //       }
    //     }
    //   },
    //   function (err) {

    //   })
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    var that = this;
    that.setData({
      nonetwork: app.globalData.nonetwork,
    })
    console.log(app.globalData.nonetwork)
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
    }
    http.postRequest("/battery/getBatteryByOpenId", prams,
      function (res) {
        console.log(res);
        if (res.errcode == 200) {
          const array = res.data.list
          that.setData({
            array
          })
          if (array.length > 0) {
            that.setData({
              isEmpty: false
            })
          } else {
            that.setData({
              isEmpty: true
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
  // onPullDownRefresh: function () {
  //   var that = this
  //   //在当前页面显示导航条加载动画
  //   wx.showNavigationBarLoading();
  //   var prams = {
  //     openId: app.globalData.openId || wx.getStorageSync('openId'),
  //   }
  //   http.postRequest("/battery/getBatteryByOpenId", prams,
  //     function (res) {
  //       console.log(res);
  //       wx.hideNavigationBarLoading();
  //       if (res.errcode == 200) {
  //         const array = res.data.list
  //         if (array.length > 0) {
  //           that.setData({
  //             array,
  //             isEmpty: false
  //           })
  //         }
  //       }
  //     },
  //     function (err) {

  //     })
  // },


})