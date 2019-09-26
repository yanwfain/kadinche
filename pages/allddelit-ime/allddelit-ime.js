// pages/allddelit-ime/allddelit-ime.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    sifix:false,
    isnums_s:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // that.setData({
     
    // })
    console.log(options)
    this.setData({
      setync: wx.getStorageSync('over_num'),
      order_status: options.order_status,
      id:options.id
    })
    this.getonlpts()
    if (this.data.order_status == '1'){
      this.setData({
        isShow:false,
        sifix:true
      })
    }else{
      this.setData({
        isShow: true,
        sifix:false
      })
    }
    let url = app.globalData.url + '/api/index/getOrderInfo';
    console.log(url)
    let data = {
      order_id:options.id
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      this.setData({
        detail: res.data,
      })
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  getonplt:function(e){

  },
  getonlpts: function (e) {
    let url = app.globalData.url + '/api/index/getOrderInfo';
    console.log(url)
    let data = {
      order_id: this.data.id

    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      that.setData({
        over_num: res.data.over_num,
        product_num: res.data.product_num,
        _status: res.data.order_status,
        _id: res.data.id
      })
      if (res.data.order_status == 3) {
        console.log(that.data.setync + "这是原来的")
        if (that.data.setync != res.data.over_num) {

          wx.setStorageSync('over_num', res.data.over_num)
          that.setData({
            setync: wx.getStorageSync('over_num')
          })
          console.log(that.data.setync + "这是现在的")
          wx.showToast({
            title: '核销成功！',
          })
          console.log(res.data.over_num)
          console.log(res.data.product_num)
          if (res.data.over_num == res.data.product_num) {
            console.log(111111)
            this.setData({
              isnums_s:false
            })
            clearInterval(this.data.lotime)
          }
        }
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: 'https://new.baike360.cn/index.php/api/index/getQrcode?order_id=' + this.data.id,     //当前图片地址
      urls: ['https://new.baike360.cn/index.php/api/index/getQrcode?order_id=' + this.data.id],//所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  goFufn: function (e) {
    wx.navigateTo({
      url: "../hexiao-shop/hexiao-shop?ridos=" + e.currentTarget.dataset.buy_status + '&order_id=' + e.currentTarget.dataset.id + '&order_no=' + e.currentTarget.dataset.order_no
    });
  },
  deleFn:function(e){
    console.log(this.data.id)
     var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          let url = app.globalData.url + '/api/index/editOrder';
          console.log(url)
          let data = {
            order_id: that.data.id,
            is_ok: 1,
          };
          console.log(data)
          app.wxRequest('POST', url, data, (res) => {
            console.log(res)
          }, (err) => {
            wx.showToast({
              title: '提交失败',
            })
            console.log(err.errMsg)
          })
          var pages = getCurrentPages();
          var beforePage = pages[pages.length - 2];
          // beforePage.onLoad();
          wx.navigateBack({
            delta: 1,
          })
        } else {
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
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
    var that = this
    that.setData({
      lotime: setInterval(function () {
        that.getonlpts()
      }, 5000)
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
    clearInterval(this.data.lotime)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    this.getMore(that.data.page);
    wx.hideLoading()
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