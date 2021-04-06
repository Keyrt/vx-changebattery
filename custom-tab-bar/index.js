Component({
  data: {
    selected: 0,
    color: "#8a8a8a",
    selectedColor: "#ffcc00",
    list: [{
        "pagePath": "/pages/index/index",
        "iconPath": "/images/home_nor.png",
        "selectedIconPath": "/images/home_sel.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/battery/battery",
        "iconPath": "/images/battery_nor.png",
        "selectedIconPath": "/images/battery_sel.png",
        "text": "电池"
      },
      {
        "pagePath": "/pages/account/account",
        "iconPath": "/images/account_nor.png",
        "selectedIconPath": "/images/account_sel.png",
        "text": "个人中心"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const noPhone = [null, undefined, ''];
      if (noPhone.includes(wx.getStorageSync('phone'))) {
        wx.navigateTo({
          url: '../login/landing',
          success: (res) => {
            console.log(res);
          }
        })
      } else {
        console.log(e.currentTarget.dataset)
        const data = e.currentTarget.dataset
        const url = data.path
        this.setData({
          selected: data.index
        })
        wx.switchTab({
          url
        })
        console.log(this.data.selected)
      }
    }
  }
})

// Page({
//   mixins: [require('../../mixin/themeChanged')],
// });