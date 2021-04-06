// pages/authorize/authorize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getPhoneNumber: function (e) {
    console.log(e.detail);
    if (e.detail.iv) {
      //用户按了允许授权按钮
      var that = this;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.iv);
      // wx.request({
      //   // 自行补上自己的 APPID 和 SECRET
      //   url: 'https://swap.mynatapp.cc//service/wechat/login/code2session',
      //   data: {
      //     code: res.code
      //   },
      //   success: res => {
      //     // 获取到用户的 openid
      //     wx.setStorage({
      //       key: "openId",
      //       data: res.data.data.openId
      //     })
      //     // wx.setStorageSync('openid', res.data.data.openId)
      //     console.log("用户的openid:" + res.data.data.openId);
      //   }
      // });

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '接受授权，给您更好的服务',
        showCancel: false,
        confirmText: '返回',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

})