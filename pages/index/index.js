//index.js
//获取应用实例
var http = require('../../utils/httputils.js');
var app = getApp()
const noPhone = [null, undefined, ''];
Page({
  data: {
    latitude: 23.698505,
    longitude: 113.855414,
    scale: 15, //缩放级别
    markers: [],
    isFirst: true,
    tel: '',
    chooseSize: false,
    station: {},
  },
  bindregionchange: function (e) {
    if (e.type == "begin") {
      console.log("begin");
    } else if (e.type == "end") {
      console.log("end");
    }
  },

  // 动画函数
  chooseSezi: function (e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 300,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(1000).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动 滑动时间
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        clearcart: false
      })
    }, 50)
  },
  // 隐藏
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(700).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 300)
  },

  locationTap: function (e) {
    this.movetoPosition();
  },
  useTap: function (e) {
    if (noPhone.includes(wx.getStorageSync('phone'))) {
      wx.navigateTo({
        url: '../login/landing',
        success: (res) => {
          console.log(res);
        }
      })
    } else {
      wx.scanCode({
        success: (res) => {
          var prams = {
            imei: res.result,
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
              }
              // else if(res.errcode == 1004){
              //   wx.showToast({
              //     title: '请正确填写iemi码',
              //     icon: 'none',
              //     duration: 3000,
              //     mask: true
              //   })
              // } 
              else {
                // wx.hideLoading()  // 先调用hide
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
            function (err) {
              setTimeout(function () {
                wx.showToast({
                  title: res.errmsg,
                  icon: 'none',
                  duration: 3000,
                  mask: true
                })
              }, 1000)
            })
        }
      })

    }
  },
  customerTap: function (e) {
    if (this.data.tel != "") {
      wx.makePhoneCall({
        phoneNumber: this.data.tel,
        success: function () {
          console.log('拨打成功')
        },
        fail: function () {
          console.log('拨打失败')
        }
      })
    }

  },
  inputTap: function (e) {
    if (noPhone.includes(wx.getStorageSync('phone'))) {
      wx.navigateTo({
        url: '../login/landing',
        success: (res) => {
          console.log(res);
        }
      })
    } else {
      wx.navigateTo({
        url: '../iemi/iemi',
        success: (res) => {
          console.log(res);
        }
      })
    }
  },


  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')

    var that = this
    wx.checkSession({
      success() {
        console.log("===================");
        console.log("用户的phone: " + wx.getStorageSync('phone'));

        if (noPhone.includes(wx.getStorageSync('phone'))) {
          var prams = {
            openId: app.globalData.openId || wx.getStorageSync('openId'),
          }
          console.log("================>" + that.data.isFirst)
          http.postRequest("/user/getUserByOpenId", prams,
            function (res) {
              console.log(res);
              if (res.errcode == 1001) {
                if (that.data.isFirst) {
                  wx.navigateTo({
                    url: '../login/landing',
                    success: (res) => {
                      console.log(res);
                    }
                  })
                }
                that.setData({
                  isFirst: false
                })

              } else {
                wx.setStorageSync("phone", res.data.user.phone)
                // wx.setStorage({
                //   key: "phone",
                //   data: res.data.user.phone
                // })
              }
            },
            function (err) {

            })
        }
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //重新登录
        console.log("---------------------");
        wx.login({
          success: res => {
            // 获取到用户的 code 之后：res.code
            console.log("用户的code:" + res);
            wx.setStorageSync("code", res.code)
            // wx.setStorage({
            //   key: "code",
            //   data: res.code
            // })
            // 可以传给后台，再经过解析获取用户的 openid
            // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
            var data = {
              code: res.code
            }
            http.postRequest("/service/wechat/login/code2session", data, function (res) {
              wx.setStorageSync("openId", res.data.openId)
              // wx.setStorage({
              //   key: "openId",
              //   data: res.data.openId
              // })

              app.globalData.openId = res.data.openId;
              console.log("#################")
              console.log(app.globalData.openId);
              console.log(res.data);
              // wx.setStorageSync('openid', res.data.data.openId)
              console.log("用户的openid:" + res.data.openId);
              var prams = {
                openId: res.data.openId,
              }
              http.postRequest("/user/getUserByOpenId", prams,
                function (res) {
                  console.log(res);
                  if (res.errcode == 1001) {
                    wx.navigateTo({
                      url: '../login/landing',
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  } else {
                    wx.setStorageSync("phone", res.data.user.phone)
                    // wx.setStorage({
                    //   key: "phone",
                    //   data: res.data.user.phone
                    // })
                  }
                },
                function (err) {

                })
            })

          }
        });

      }
    })

    this.getLocation()

    wx.getSystemInfo({
      success: (res) => {
        this.setData({

        })
      }
    })
    this.getTel()
  },


  markertap: function (e) {
    let that = this
    console.log(e.detail.markerId);
    that.getLocation()
    var prams = {
      deptId: e.detail.markerId,
      latitude: that.latitude,
      longitude: that.longitude
    }
    http.postRequest("/dept/detail", prams,
      function (res) {
        let stations = res.data
        stations.distance = that.getDistance(that.latitude, that.longitude, stations.dept.latitude, stations.dept.longitude, )
        // station.distance = (station.distance / 1000).toFixed(2)
        that.setData({
          station: res.data
        })
        if (that.data.chooseSize == false) {
          that.chooseSezi()
        } else {
          that.hideModal()
        }
        console.log(res.data);
      },
      function (err) {});

  },

  // 获取定位当前位置的经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      // isHighAccuracy:true,
      success: function (res) {
        console.log("获取当前定位经纬度")
        console.log(res)
        that.latitude = res.latitude
        that.longitude = res.longitude
        that.addMarker()
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  Rad: function (d) { //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance: function (lat1, lng1, lat2, lng2) {
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2) //保留两位小数
    console.log('经纬度计算的距离:' + s)
    return s
  },

  toNavigation: function (e) {
    wx.openLocation({
      latitude: Number(this.data.station.dept.latitude),
      longitude: Number(this.data.station.dept.longitude),
      name:this.data.station.dept.address,
    })
    console.log("====================")
    console.log(Number(this.data.station.dept.latitude))
  },
  addMarker() {
    var that = this
    // that.getLocation()
    var prams = {
      openId: app.globalData.openId || wx.getStorageSync('openId'),
      latitude: that.latitude,
      longitude: that.longitude
    }
    http.postRequest("/battery/index", prams,
      function (res) {
        console.log(res);
        if (res.errcode == 200) {
          let batteryist = res.data.batteryist
          let deptlist = res.data.deptlist

          batteryist.map(item => {
            item['iconPath'] = "../../images/battery_dot.png"
            item['width'] = 40
            item['height'] = 56
          })
          deptlist.map(item => {
            item['iconPath'] = item.status == "0" ? "../../images/station/stationL.png" : "../../images/station/stationG.png"
            item['width'] = 31.5
            item['height'] = 31.5
            item['id'] = item['deptId']
          })
          const markers = batteryist.concat(deptlist);
          that.setData({
            markers,
          })
          console.log(markers)
        }
      },
      function (err) {

      })


  },
  getTel() {
    var that = this
    var prams = {}
    http.postRequest("/common/getTel", prams,
      function (res) {
        console.log(res);
        if (res.errcode == 200) {
          that.data.tel = res.data.tel
          console.log(that.data.tel)
        }
      },
      function (err) {

      })
  },
  onShow: function () {
    console.log("onShow");
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.mapCtx = wx.createMapContext("batteryMap");
    this.movetoPosition();
    // console.log(this.data.latitude)
    this.getLocation()
    // this.addMarker()
  }
})