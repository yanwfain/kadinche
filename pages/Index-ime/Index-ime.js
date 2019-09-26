// pages/Index-ime/Index-ime.js
var app = getApp()
var httpUtils = require('../../js/httpUtils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    delitops:[
      {
        imgurl:'../../images/03.png',
        txtx:'待付款',
        id:1
      },
      {
        imgurl: '../../images/05.png',
        txtx: '待核销',
        id: 2
      },
      {
        imgurl: '../../images/07.png',
        txtx: '已核销',
        id: 3
      },
      {
        imgurl: '../../images/12.png',
        txtx: '已过期',
        id: 4
      },
      {
        imgurl: '../../images/12.png',
        txtx: '已使用',
        id: 5
      },
    ],
    centlistop:[
      {
        txt:'我的钱包',
        id:1
      },
      {
        txt: '我的成绩',
        id: 2
      },
      {
        txt: '成绩排名',
        id: 3
      }
    ],
    pid:'',
    isUser:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  
    setTimeout(function () {
      if (app.globalData.userInfo == null) {
        that.setData({
          hasUserInfo: false,
          isUser:false
        })
      }
    }, 1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        isUser:true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          isUser: true
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
            isUser: true
          })
        }
      })
    }
    getOpenid(that)
  
    console.log(app.globalData.userInfo)
    console.log(app.globalData.user_name)
    console.log(app.globalData.head_img)
   
  },
  getUserInfo(e) {

    console.log("ok")
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        that.setData({
          wxuser: res.userInfo,
          hasUserInfo: true,
          canIUse: true,
          isUser: true,
          headimg: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
      },
      fail: function () { }
    })
   
    getOpenid(that)
  },

  gochlidops:function(e){
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id ==1){
      wx.navigateTo({
        url: "../money-ime/money-ime"
      });
    } else if (e.currentTarget.dataset.id == 2){
      wx.navigateTo({
        url: "../cji-ime/cji-ime"
      });
    } else if (e.currentTarget.dataset.id == 3){
      wx.navigateTo({
        url: "../sotrtFn-index/sotrtFn-index"
      });
    }
   
  },
  userFn:function(e){
    if (!this.data.birthday){
      this.setData({
        birthday:''
      })
    }
    if (!this.data.phone) {
      this.setData({
        phone: ''
      })
    }
    if (!this.data.real_name) {
      this.setData({
        real_name: ''
      })
    }
    wx.navigateTo({
      url: "../user-ime/user-ime?headimg=" + this.data.headimg + '&nickName=' + this.data.nickName + '&birthday=' + this.data.birthday + '&phone=' + this.data.phone + '&real_name=' + this.data.real_name
    });
    // headimg: res.data.head_img,
    //   nickName: res.data.name,
    //     birthday: res.data.birthday,
    //       phone: res.data.phone,
    //         real_name: res.data.real_name
  },
  goNice:function(e){
    console.log(e.currentTarget.dataset.id)
    this.setData({
      pid: e.currentTarget.dataset.id
    })
    wx.navigateTo({
      url: "../alldd-ime/alldd-ime?pid=" + this.data.pid
    });
  },
  alldd:function(e){
    wx.navigateTo({
      url: "../alldd-ime/alldd-ime?pid=" + ''
    });
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
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 500
    })
    var that = this
    that.onLoad()
    getOpenid(that)
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  wxlogin().then(function (res) {
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