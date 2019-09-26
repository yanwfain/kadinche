// pages/hexiao-shop/hexiao-shop.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUp: false,
    isTop: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('over_num', '0')

    this.setData({
      setync: wx.getStorageSync('over_num'),
      id: options.order_id,
      order_no: options.order_no
    })
    console.log(this.data.setync)
    this.getonlpts()
    console.log(options)
    if (options.ridos == 1 || options.ridos == 2) {
      this.setData({
        isUp: false,
        isTop: true,
      })
    } else {
      this.setData({
        isUp: true,
        isTop: false,
      })
    }
    this.getonlpt()
  },
  previewImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: 'https://new.baike360.cn/index.php/api/index/getQrcode?order_id=' + this.data.id, //当前图片地址
      urls: ['https://new.baike360.cn/index.php/api/index/getQrcode?order_id=' + this.data.id], //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getonlpt: function(e) {
    let url = app.globalData.url + '/api/index/getOrderInfo';
    console.log(url)
    let data = {
      order_id: this.data.id

    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      this.setData({
        order_status: res.data.order_status,
        deid: res.data.id,
      })
      if (res.data.order_status == 1) {

      } else {
        this.setData({
          isUp: false,
          isTop: true
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },
  getonlpts: function(e) {
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
          // if (that.data.setync == res.data.over_num) {
          //   console.log(that.data.setync)
          //   console.log(res.data.over_num)
         
          // }
          if (res.data.over_num == res.data.product_num) {
            wx.navigateTo({
              url: "../allddelit-ime/allddelit-ime?order_status=" + that.data._status + '&id=' + that.data._id
            });
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
  delitsFn: function(e) {

    wx.navigateTo({
      url: "../allddelit-ime/allddelit-ime?order_status=" + e.currentTarget.dataset.order_status + '&id=' + e.currentTarget.dataset.deid
    });
  },
  opsque: function(e) {
    this.getonlpt()
    let url = app.globalData.url + '/api/index/getOrderInfo';
    console.log(url)
    let data = {
      order_id: this.data.id
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      if (res.data.order_status == 1) {
        wx.showToast({
          title: '未完成付款',
          icon: 'none',

        })
      } else {
        this.setData({
          isUp: false,
          isTop: true
        })
      }
    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
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
    this.getonlpt()
    var that = this
    that.setData({
      lotime: setInterval(function() {
        that.getonlpts()
      }, 5000)
    })

  },
  // wx.switchTab({
  //   url: '../Index-ime/Index-ime'
  // })
  ruetuFn: function(e) {
    wx.switchTab({
      url: '../index/index'
    })
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
    clearInterval(this.data.lotime)
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