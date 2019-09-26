// pages/edit-me/edit-me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_picture_list: '',
    img_list: '',
    img_num: '0',//默认9
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    this.setData({
      headimg: options.headimg,
      nickName: options.nickName,
    
    })
    if (options.real_name=='null'){
      this.setData({
        
      })
    }else{
      this.setData({
        userName: options.real_name
      })
    }
    if (options.birthday == 'null') {
      this.setData({
       
      })
    } else {
      this.setData({
        mony: options.birthday
      })
    }
    if (options.phone == 'null') {
      this.setData({
      
      })
    } else {
      this.setData({
        phone: options.phone
      })
    }
  },
  pickerProChange: function (e) {
    console.log(e)
    this.setData({
      mony: e.detail.value
    })
    var that = this;
    console.log(that.data.mony)
  },
  uploadimg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFiles = res.tempFiles

        that.setData({
          upload_picture_list: tempFilePaths,
        });
        wx.uploadFile({
          url: app.globalData.url + '/api/common/upload',      //此处换上你的接口地址
          filePath: tempFilePaths[0],
          // data: tempFilePaths[0],
          // file: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ..'    //若有token，此处换上你的token，没有的话省略
          },
          formData: {
            'user': 'test'  //其他额外的formdata，可不写
          },
          success: function (res) {

            console.log(res)
            var datas = JSON.parse(res.data);
            // img_list.push(data.msg);
            that.setData({
              img_list: datas.data.url,
            });
            console.log(that.data.img_list)
          },

          fail: function (res) {
            console.log('fail');

          },
        })


      }
    })

  },
  nameFn:function(e){

    this.setData({
      nickName: e.detail.value
    })
    console.log(this.data.nickName)
  },
  userNameFn:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  phoneFn:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // monyFn:function(e){
  //   this.setData({
  //     mony: e.detail.value
  //   })
  // },
  sunbtn:function(e){
    let url = app.globalData.url + '/api/User/editUser';
    console.log(url)
    let data = {
      user_id: app.globalData.user_id,
      user_name: this.data.nickName,
      real_name: this.data.userName,
      user_birth: this.data.mony,
      phone: this.data.phone,
      headimg: this.data.img_list,
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)
      var that = this;
      if(res.code==1){
        // this.setData({
        //   detail: res.data
        // })
        var pages = getCurrentPages();
        var beforePage = pages[pages.length - 2];
        beforePage.onLoad();
        wx.navigateBack({
          delta: 1,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})