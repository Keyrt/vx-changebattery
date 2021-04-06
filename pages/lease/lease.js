// pages/lease/lease.js
var http = require('../../utils/httputils.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iemi: "",
    param: {}, // 页面传递参数
    current: 1, // 当前选中的套餐类型
    pay: 0, // 支付金额
    operate: [],
    checked: true
  },


  changetype: function (index) {
    console.log(index)
    var indexs = index.currentTarget.dataset.item
    this.setData({
      current: indexs + 1,
      pay: Math.round((this.data.param.cashPledge + this.data.operate[indexs].money) * 100) / 100
    });
  },
  submitOrder: function () {
    console.log(this.data.checked)
    if (this.data.checked) {
      var prams = {
        openId: app.globalData.openId || wx.getStorageSync('openId'),
        cashPledge: this.data.param.cashPledge,
        packageFee: this.data.operate[this.data.current - 1].money,
        strategyId: this.data.param.strategyId,
        batteryId: this.data.param.batteryId,
        time: this.data.operate[this.data.current - 1].month
      }
      http.postRequest("/service/pay/unifiedorder", prams,
        function (res) {
          console.log(res);
          if (res.errcode == 200) {
            var _r = res.data;
            wx.requestPayment({ //调起支付               
              'timeStamp': _r.timeStamp, // 必填 时间戳从1970年1月1日00:00:00至今的秒数,即当前的              
              'nonceStr': _r.nonceStr, // 必填 随机字符串，长度为32个字符以下。
              'package': _r.package, // 必填  统一下单接口返回的 prepay_id 参数值
              'signType': 'MD5', // 必填 签名算法，暂支持 MD5
              'paySign': _r.paysign, // 必填 签名
              'success': function (res) { // 接口调用成功的回调函数
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 3000,
                  mask: true
                })
                wx.requestSubscribeMessage({
                  tmplIds: ['zMhrVWWmYBIZ6ox-ILW7ud1qJ17mNngj88hT_3yHIhs', 'U_xjrcuaDRVH0iLEXjGXMNXtn_dOam8SwQ8WhdwGWMs', '50THai20oAlgulrPE1qf-EACaWnGgiMFuf9ggjY71aQ'],
                  success(res) {

                    var prams = {
                      openId: app.globalData.openId || wx.getStorageSync('openId'),
                      orderNo: _r.orderNo
                    }
                    http.postRequest("/service/wechat/send", prams,
                      function (res) {

                      },
                      function (err) {

                      })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../battery/battery',
                        success: (res) => {
                          console.log(res);
                        }
                      })
                    }, 2000)

                  },
                  fail(res) {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../battery/battery',
                        success: (res) => {
                          console.log(res);
                        }
                      })
                    }, 2000)

                  }
                })
                console.log(res);
              },
              'fail': function (res) { // 接口调用失败的回调函数
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 3000,
                  mask: true
                })
                console.log('fail:' + JSON.stringify(res));
              }
            })
          }

        },
        function (err) {

        })
    } else {
      wx.showToast({
        title: '请同意协议',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    }
  },

  checkboxChange: function (e) {
    this.setData({
      checked: !this.data.checked
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var data = JSON.parse(options.data)
    this.setData({
      param: data,
      operate: data.planeList,
      pay: Math.round((data.cashPledge + data.planeList[0].money) * 100) / 100
    })
    console.log(that.data.operate);
    // that.setData({
    //   iemi: options.data
    // })
    // var prams = {
    //   imei: that.data.iemi,
    // }
    // http.postRequest("/battery/getBatteryByImei", prams,
    //   function (res) {
    //     if (res.errcode == 200) {
    //       that.setData({
    //         param: res.data.battery
    //       })
    //     } else {
    //       wx.navigateBack({
    //         success: function () {
    //           // beforePage.onLoad(); // 执行前一个页面的onLoad方法
    //         }
    //       });
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

  },




})