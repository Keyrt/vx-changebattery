// pages/iemi/iemi.js
var http = require('../../utils/httputils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iemiCode: ''
  },
  bindKeyInput: function (e) {
    this.setData({
      iemiCode: e.detail.value
    })
  },
  jumpTolease: function (e) {
    var that = this
    var data = that.data.iemiCode;
    if (data.length != 0) {
      // wx.navigateTo({
      //   url: '../lease/lease?data=' + data,
      //   success: (res) => {
      //     console.log(res);
      //   }
      // })
      var prams = {
        imei: data,
      }
      http.postRequest("/battery/getBatteryByImei", prams,
        function (res) {
          if (res.errcode == 200) {
            var batteryInfo = JSON.stringify(res.data.battery);
            wx.navigateTo({
              url: '../lease/lease?data=' + batteryInfo,
              success: (res) => {
                console.log(res);
              }
            })
          } else {
            // wx.hideLoading()  // 先调用hide
            // wx.showToast({
            //   title: res.errmsg,
            //   icon: 'none',
            //   duration: 3000,
            //   mask: true
            // })
            setTimeout(function () {
              wx.showToast({
                title: res.errmsg,
                icon: 'none',
                duration: 3000,
                mask: true
              })
            }, 20)
          }
        },
        function (err) {

        })
    } else {
      // wx.hideLoading()  // 先调用hide
      // wx.showToast({
      //   title: '请输入IMEI码',
      //   icon: 'none',
      //   duration: 3000,
      //   mask: true
      // })
      setTimeout(function () {
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          duration: 3000,
          mask: true
        })
      }, 1000)
    }
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

  },

})