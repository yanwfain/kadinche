// pages/cji-ime/cji-ime.js
var app = getApp()
var httpUtils = require('../../js/httpUtils.js');
var timeFormatUtils = require("../../js/timeFormatUtils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    movieList: [],
    isSiuser: false,
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isopsmodel: true,
    isopslshow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dates = timeFormatUtils.getDateFormat(new Date().getTime(), "yyyy-MM-dd hh:mm:ss");
    this.setData({
      dates: dates
    })
    var that = this;
    this.getMore(that.data.page)
    console.log(that.data.movieList)
    if (that.data.movieList ){
      that.setData({
        imgs: app.globalData.head_img,
        isopsmodel:false,
        isopslshow:true
      })
    }else{
      that.setData({
        isopsmodel: true,
        isopslshow: false
      })
    }
    setTimeout(function () {
      if (app.globalData.userInfo == null) {
        that.setData({
          hasUserInfo: false,
          isSiuser: true,
        })
      }
    }, 1000)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        isSiuser: false,
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          isSiuser: false,

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

    // let url = app.globalData.url + '/api/User/getUserInfo';
    // console.log(url)
    // let data = {
    //   user_id: app.globalData.user_id,
    //   page:this.data.page
    // };
    // console.log(data)
    // app.wxRequest('POST', url, data, (res) => {
    //   console.log(res)
    //   var that = this;
    //   this.setData({
    //     detail: res.data,

    //   })
    // }, (err) => {
    //   wx.showToast({
    //     title: '提交失败',
    //   })
    //   console.log(err.errMsg)
    // })
  },
  ggopfn: function (e) {
    this.setData({
      isSiuser: false,
    })
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
          isSiuser: false,
          headimg: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
      },
      fail: function () { }
    })

    getOpenid(that)
  },
  gomi:function(e){
    wx.redirectTo({
      url: "../sotrtFn-index/sotrtFn-index"
    });

    // wx.redirectTo({
    //   url: "../cji-ime/cji-ime"
    //   // pages/sotrtFn-index/sotrtFn - index
    // })
  },
  getMore: function (page) {
    let url = app.globalData.url + '/api/index/getMyRank';
    console.log(url)
    let data = {
      user_id: app.globalData.user_id,
      page: page,
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)

      var that = this;
      if (res.code == 1) {

        if (that.data.page > 1) {
          var movieLists = that.data.movieList;
          that.setData({
            movieList: movieLists.concat(res.data.rows),
            page: page + 1
          })
        } else {
          that.setData({
            movieList: res.data.rows,
            page: page + 1
          })
        }
      } else {

       
        wx.showToast({
          title: '没有更多数据了！',
          icon: 'none'
        })
      }

    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  delituser:function(e){
   
    wx.navigateTo({
      url: "../delituser-ime/delituser-ime?rank=" + e.currentTarget.dataset.rank + '&all_time=' + e.currentTarget.dataset.all_time + '&create_time=' + e.currentTarget.dataset.create_time + '&headimg=' + e.currentTarget.dataset.headimg + '&user_name=' + e.currentTarget.dataset.user_name + '&only=' + JSON.stringify(e.currentTarget.dataset.only)
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
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.getMore(that.data.page);
    wx.hideLoading()
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