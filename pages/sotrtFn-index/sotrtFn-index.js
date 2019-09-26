// pages/sotrtFn-index/sotrtFn-index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    movieList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // getAllRank
    var that = this;
    this.getMore(that.data.page)
    this.setData({
      user_id: app.globalData.user_id
    })
    
  },
  getMore:function(page){
    let url = app.globalData.url + '/api/index/getAllRank';
    console.log(url)
    let data = {
      page:page,
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)

      var that = this;
      if(res.code == 1){
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
      }else{
        wx.showToast({
          title:'没有更多数据了！',
          icon:'none'
        })
      }
      
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  gomi:function(e){
    // wx.navigateTo({
    //   url: "../cji-ime/cji-ime"
    // });
    wx.redirectTo({
      url: "../cji-ime/cji-ime"
      // pages/sotrtFn-index/sotrtFn - index
    })
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