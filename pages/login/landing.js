// pages/login/landing.js
var http = require('../../utils/httputils.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getPhoneNumber(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.iv != undefined) {
      var prams = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        jsCode: wx.getStorageSync('code'),
        openId: app.globalData.openId || wx.getStorageSync('openId'),
      }
      http.postRequest("/service/wechat/decryptPhoneNumber", prams,
        function (res) {
          console.log(res);
          // 获取到用户的 openid
          wx.setStorage({
            key: "phone",
            data: res.data.phoneNumber
          })
          // wx.setStorageSync('openid', res.data.data.openId)
          console.log("phone:" + res.data.phoneNumber);
          wx.switchTab({
            url: '../index/index',
            success: (res) => {
              console.log(res);
            }
          })
          // }
        },
        function (err) {

        })
    }else{
      wx.navigateBack({
        success: function () {
          // beforePage.onLoad(); // 执行前一个页面的onLoad方法
        }
      });
      // wx.switchTab({
      //   url: '../index/index',
      //   success: (res) => {
      //     console.log(res);
      //   }
      // })
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
    wx.hideHomeButton();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})