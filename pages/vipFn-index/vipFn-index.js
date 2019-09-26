// pages/vipFn-index/vipFn-index.js
var app = getApp()
var httpUtils = require('../../js/httpUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFalse:true,
    detail2: [{

        id: 1,
        money: 100,
        smoney: 50

      },
      {
        id: 2,
        money: 200,
        smoney: 60
      },
      {
        id: 3,
        money: 300,
        smoney: 80
      },
      {
        id: 4,
        money: 500,
        smoney: 100
      },
      {
        id: 5,
        money: 800,
        smoney: 200
      },
      {
        id: 6,
        money: 1000,
        smoney: 300
      },

    ],
    isSiuser: false,
    isShow: false,
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    setTimeout(function() {
      if (app.globalData.userInfo == null) {
        that.setData({
          hasUserInfo: false,
        })
      }
    }, 1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,

      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,

        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.MyUserInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,

          })
        }
      })
    }
    getOpenid(that)
    let url = app.globalData.url + '/api/index/getSetmeal';
    console.log(url)
    let data = {

    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      this.setData({
        detail: res.data.rows,
      })
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  ggopfn: function(e) {
    this.setData({
      isSiuser: false,
    })
  },
  selectSpe(e) {
    let id = e.currentTarget.dataset.id;
    let outprice = e.currentTarget.dataset.outprice;
    console.log(id, this.data.detail)
    // console.log(outprice)
    let selectedArry = this.data.detail.filter((i) => {
      return i.id == id
    });
    console.log(selectedArry)
    this.setData({
      isShow: true,
      money: selectedArry[0].buy_price,
      smoney: selectedArry[0].give_price,
      selected: selectedArry[0].id,
      selectedArry: selectedArry,


    })
  },
  getUserInfo(e) {

    console.log("ok")
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          wxuser: res.userInfo,
          hasUserInfo: true,
          canIUse: true,
          isSiuser: false,
          headimg: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
      },
      fail: function() {}
    })

    getOpenid(that)
  },
  btnCfn: function(e) {
    var that = this
    if (!app.globalData.userInfo) {
      // wx.showModal({
      //   title: '提示',
      //   content: '请先授权登陆！',
      //   success: function (res) {
      //     if (res.confirm) {

      //     } else {
      //       console.log(res);
      //     }
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   }
      // })
      that.setData({
        isSiuser: true
      })
    } else {
      if (!this.data.selectedArry) {
        wx.showToast({
          title: '请选择充值金额',
          icon: 'none'
        })
      } else {
        this.setData({
          isFalse:false
        })
        let url = app.globalData.url + '/api/index/buySetmeal';
        let url1 = app.globalData.url + '/api/Wechat/setmealPay';
        let url2 = app.globalData.url + '/api/index/editSetmeal';
        console.log(url)
        let data = {
          setmeal_id: that.data.selected,
          user_id: app.globalData.user_id
        };
        console.log(data)
        app.wxRequest('POST', url, data, (res) => {
          console.log(res)
          this.setData({
            buy_id: res.data.buy_id
          })
          let data1 = {
            buy_id: res.data.buy_id,
          };
          console.log(data1)
          app.wxRequest('POST', url1, data1, (res) => {
            console.log(res)
            wx.requestPayment({

              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.package,
              'signType': 'MD5',
              'paySign': res.data.paySign,
              'success': function(res) {
                console.log(res);
                wx.showToast({
                  title: "支付成功",
                })
                that.setData({
                  isFalse: true
                })
                var data2 = {
                  is_ok: 2,
                  buy_id: that.data.buy_id
                }
                app.wxRequest('POST', url2, data2, (res) => {
                  console.log(res)
                  var that = this;

                }, (err) => {
                  wx.showToast({
                    title: '提交失败',
                  })
                  console.log(err.errMsg)
                })
              },
              'fail': function(res) {
                that.setData({
                  isFalse: true
                })
                wx.showToast({
                  title: "支付失败",
                })
             
                var data2 = {
                  is_ok: 1,
                  buy_id: that.data.buy_id
                }
                app.wxRequest('POST', url2, data2, (res) => {
                  console.log(res)
                  var that = this;

                }, (err) => {
                  wx.showToast({
                    title: '提交失败',
                  })
                  console.log(err.errMsg)
                })
              }
            })
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
          })
        }, (err) => {
          wx.showToast({
            title: '提交失败',
          })
          console.log(err.errMsg)
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 500
    })
    var that = this
    getOpenid(that)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.hideLoading()
    this.onLoad()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

function getOpenid(that) {
  var url = app.globalData.url + '/api/index/getOpenid';
  var url1 = app.globalData.url + '/api/user/getUserInfo';
  var url2 = app.globalData.url + '/api/user/addUser';
  // var url = 
  console.log(that)
  var params = {};
  params.appId = 'wxf90793b6b6ec6236';
  console.log(params.appId);
  var wxlogin = httpUtils.httpPromise(wx.login);
  wxlogin().then(function(res) {
    console.log(res)
    params.code = res.code;
    app.wxRequest('POST', url, params, (res) => {
      console.log(res)
      // var that = this;
      app.globalData.openId = res.data.openid
      params.openid = res.data.openid;
      app.wxRequest('POST', url1, params, (res) => {
        console.log(res)
        if (res.code == '1') {
          app.globalData.user_id = res.data.id
          app.globalData.user_name = res.data.name
          app.globalData.head_img = res.data.head_img
          that.setData({
            headimg: res.data.head_img,
            nickName: res.data.name,
            birthday: res.data.birthday,
            phone: res.data.phone,
            real_name: res.data.real_name
          })
        }
        if (res.code == '0') {
          console.log(app.globalData.userInfo)
          // var params1 = {

          // };
          app.globalData.head_img = app.globalData.userInfo.avatarUrl
          params.openid = app.globalData.openId;
          params.headimg = app.globalData.userInfo.avatarUrl;
          params.user_name = app.globalData.userInfo.nickName;
          params.sex = app.globalData.userInfo.gender;
          console.log(params.headimg)
          console.log(params.user_name)
          app.wxRequest('POST', url2, params, (res) => {
            console.log(res)
            app.wxRequest('POST', url1, params, (res) => {
              console.log(res)
              app.globalData.user_id = res.data.id
              app.globalData.user_name = res.data.name
              app.globalData.head_img = res.data.head_img
            }, (err) => {
              wx.showToast({
                title: '提交失败',
              })
              console.log(err.errMsg)
            })
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
          })
        }
      }, (err) => {
        wx.showToast({
          title: '提交失败',
        })
        console.log(err.errMsg)
      })
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
    var params1 = {
      openid: app.globalData.openId
    }


  })

}