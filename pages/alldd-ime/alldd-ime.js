// pages/alldd-ime/alldd-ime.js
var app = getApp()
var timeFormatUtils = require("../../js/timeFormatUtils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: false,
    selected0: false,
    selected1: false,
    selected2: false,
    selected3: false,
    selected4: false,
    isZhifu:true,
    page: 1,
    movieList: [],
    multiArray: [
      ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'],
      ['00', '20', '40']
    ],
    multiIndex: '',
    isYyus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      pid:options.pid
    })

    if (this.data.pid == ''){
      // var that = this;
      // this.getMore(that.data.page)
    
      this.setData({
        selected: true
      })
    } else if (this.data.pid == '1'){
      // var that = this;
      // this.getMore(that.data.page)
      this.setData({
        selected0: true,
      })
    } else if (this.data.pid == '2'){
      // var that = this;
      // this.getMore(that.data.page)
      this.setData({
        selected1: true,
      })
    } else if (this.data.pid == '3') {
      // var that = this;
      // this.getMore(that.data.page)
      this.setData({
        selected2: true,
      })
    } else if (this.data.pid == '4') {
      // var that = this;
      // this.getMore(that.data.page)
      this.setData({
        selected3: true,
      })
    } else if (this.data.pid == '5') {
      // var that = this;
      // this.getMore(that.data.page)
      this.setData({
        selected4: true,
      })
    }
  },
  goFufnyy:function(e){
    this.setData({
      isYyus:true,
      oderid:e.currentTarget.dataset.id
    })
  },
  bintgb:function(e){
    this.setData({
      isYyus: false
    })
  },
  pickerTap: function (e) {
    console.log(e)
    console.log(this.data.multiArray)
    var hours = [];
    var minute = [];
    for (var i = 0; i < this.data.multiArray[0].length; i++) {
      hours.push(this.data.multiArray[0][i]);
    }
    console.log(hours)
    // 分
    for (var i = 0; i < this.data.multiArray[1].length; i++) {
      minute.push(this.data.multiArray[1][i]);
    }
    console.log(minute)
    this.setData({
      multiIndex: e.detail.value
    })
    console.log(this.data.multiIndex)
    console.log(hours[this.data.multiIndex[0]])
    console.log(minute[this.data.multiIndex[1]])
    var endmuist = parseInt(minute[this.data.multiIndex[1]]) + 20

    if (endmuist == 60) {
      var housetrt = parseInt(hours[this.data.multiIndex[0]]) + 1
      this.setData({
        endmuist: '00',
        housetrt: housetrt
      })
    } else {
      this.setData({
        endmuist: endmuist,
        housetrt: hours[this.data.multiIndex[0]]
      })
    }
    this.setData({
      startDate: hours[this.data.multiIndex[0]] + ':' + minute[this.data.multiIndex[1]],
      end: this.data.housetrt + ':' + this.data.endmuist,
      isFlock: true
    })
    console.log(this.data.startDate)
  },
  pickerProChange: function (e) {
    console.log(e)
    this.setData({
      op: e.detail.value
    })
    var that = this;
    console.log(that.data.op)
  },
  quedingFn:function(e){

    var times = this.data.op + " " + this.data.startDate
    console.log(times)
    var dates = timeFormatUtils.getDateFormat(new Date().getTime(), "yyyy-MM-dd-hh-mm-ss");
    console.log(new Date(times.replace(/-/g, "/")).getTime())
    var timesops = new Date(times.replace(/-/g, "/")).getTime()
    var timestamp = Date.parse(new Date());
    if ( !this.data.op || !this.data.startDate) {
      wx.showToast({
        title: '请完善购买信息',
        icon: 'none'
      })   
    } else if (timesops < timestamp) {
      console.log(timesops)
      console.log(timestamp)
      wx.showToast({
        title: '请选择有效时间',
        icon: 'none'
      })
    } else{
      console.log(this.data.op)
      console.log(this.data.startDate + '-' + this.data.end) //时间
      let url = app.globalData.url + '/api/index/editOrderStatus';
      console.log(url)
      let data = {
        order_id: this.data.oderid,
        subscribe_day: this.data.op,
        subscribe_time: this.data.startDate + '-' + this.data.end
      };
      console.log(data)
      app.wxRequest('POST', url, data, (res) => {
        console.log(res)

        var that = this;
        if (res.code == 1) {
          this.setData({
            isYyus: false
          })
          this.setData({
            movieList: ''
          })
          this.setData({
            page: 1
          })
          this.getMore(that.data.page)
          wx.showToast({
            title:'预约成功',
           
          })

        } else {
         wx.showToast({
           title: res.msg,
           icon: 'none'
         })

        }

      }, (err) => {
        wx.showToast({
          title: '提交失败',
        })
        console.log(err.errMsg)
      })
    }
  
  },
  getMore: function (page) {
    let url = app.globalData.url + '/api/index/getOrder';
    console.log(url)
    let data = {
      page: page,
      order_status:this.data.pid,
      user_id: app.globalData.user_id
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
        // if (!res.data){
        //   that.setData({
        //     movieList: res.data.rows,
        //     page: 1
        //   })
          wx.showToast({
            title: '暂无数据了！',
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
  getMores: function (page) {
    let url = app.globalData.url + '/api/index/getOrder';
    console.log(url)
    let data = {
      page: page,
      order_status: this.data.pid,
      user_id: app.globalData.user_id
    };
    console.log(data)
    app.wxRequest('POST', url, data, (res) => {
      console.log(res)

      var that = this;
     
      // if (that.data.page > 1) {
      //   var movieLists = that.data.movieList;
      //   that.setData({
      //     movieList: movieLists.concat(res.data.rows),
      //     // page: page
      //   })
      // } else {
        if(res.code==1){
          that.setData({
            movieList: res.data.rows,
            // page: page
          })
        }else{
          wx.showToast({
            title: '暂无数据了',
            icon:'none'
          })
        }
       
      // }
      

    }, (err) => {
      wx.showToast({
        title: '提交失败',
      })
      console.log(err.errMsg)
    })
  },

  goFufn:function(e){
    wx.navigateTo({
      url: "../hexiao-shop/hexiao-shop?ridos=" + e.currentTarget.dataset.buy_status + '&order_id=' + e.currentTarget.dataset.id + '&order_no=' + e.currentTarget.dataset.order_no
    });
  },
  godelitsFn:function(e){
    console.log(e.currentTarget.dataset)
    console.log(this.data.pid)
    wx.navigateTo({
      url: "../allddelit-ime/allddelit-ime?order_status=" + e.currentTarget.dataset.order_status + '&id=' + e.currentTarget.dataset.id 
    });
  },
  selected: function (e) {

    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page:1
    })
    var that = this;
    this.getMore(that.data.page)
   
    wx.hideLoading()

    this.setData({
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: false,
      selected0: false,
      selected: true
    })
  },
  selected0: function (e) {
    this.setData({
      movieList:''
    })
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page: 1
    })
    var that = this;
    this.getMore(that.data.page)

    wx.hideLoading()

    this.setData({
      selected1: false,
      selected0: true,
      selected2: false,
      selected3: false,
      selected4: false,

      selected: false
    })
  },
  selected1: function (e) {
    this.setData({
      movieList: ''
    })
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page: 1
    })
    var that = this;
    this.getMore(that.data.page)

    wx.hideLoading()

    this.setData({
      selected0: false,
      selected1: true,
      selected2: false,
      selected3: false,
      selected4: false,

      selected: false
    })
  },
  selected2: function (e) {
    this.setData({
      movieList: ''
    })
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page: 1
    })
    var that = this;
    this.getMore(that.data.page)

    wx.hideLoading()

    this.setData({
      selected0: false,
      selected1: false,
      selected2: true,
      selected3: false,
      selected4: false,

      selected: false
    })
  },
  selected3: function (e) {
    this.setData({
      movieList: ''
    })
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page: 1
    })
    var that = this;
    this.getMore(that.data.page)

    wx.hideLoading()

    this.setData({
      selected0: false,
      selected1: false,
      selected2: false,
      selected3: true,
      selected4: false,
      selected: false
    })
  },
  selected4: function (e) {
    this.setData({
      movieList: ''
    })
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pid: e.currentTarget.dataset.id,
      page: 1
    })
    var that = this;
    this.getMore(that.data.page)

    wx.hideLoading()

    this.setData({
      selected0: false,
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: true,

      selected: false
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
    this.setData({
      page:1
    })
    console.log(this.data.pid+ '-------------')
    var that = this;
    this.getMores(that.data.page)
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
  onPullDownRefresh: function (options) {
  
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
    var that = this;
    this.getMore(that.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})