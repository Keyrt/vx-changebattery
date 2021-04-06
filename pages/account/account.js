// pages/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: wx.getStorageSync('phone')
  },
  jumpToOrderList: function (e) {
    wx.navigateTo({
      url: '../order/orderList',
      success: (res) => {
        console.log(res);
      }
    })
  },
  jumpToAboutUs: function (e) {
    wx.navigateTo({
      url: '../aboutUs/aboutUs',
      success: (res) => {
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({

      phone: wx.getStorageSync('phone')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    var that = this;
    that.setData({
      phone: wx.getStorageSync('phone')
    })
  }

})