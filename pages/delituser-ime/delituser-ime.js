// pages/delituser-ime/delituser-ime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    only:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      all_time: options.all_time,
      create_time: options.create_time,
      headimg: options.headimg,
      
      all_time: options.all_time,
      rank: options.rank,
      user_name: options.user_name,
    })
    if (options.only){
      this.setData({
        only: JSON.parse(options.only),
      })
      console.log(this.data.only)
// JSON.stringify(
    }else{
      
    }
    // if (JSON.stringify(this.data.only)){

    //   }
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