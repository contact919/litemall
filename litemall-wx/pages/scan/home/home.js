// pages/scan/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scanContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 调用扫码
   */
  scanCode: function () {
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function(res) {
        console.log(res)
        // 发送请求
        // util.request(api.xxx, res, post).then(res => {
        //   if (res.errno === 0) {
        //     that.setData({
        //       ......
        //     });
        //   }
        //   if(xxx) {
        //     wx.showModal({
        //       title: '提示',
        //       content: '未找到相关商品，请重试或联系工作人员',
        //       showCancel: false
        //     });
        //   }
        // }).catch(err => {
        //       wx.showModal({
        //         title: '提示',
        //         content: '网络错误',
        //         showCancel: false
        //       });
        // });
      },
      fail: function(res) {
        wx.navigateTo({
          url: '/pages/scan/shoppingCar/shoppingCar'
        })
        wx.showModal({
          title: '提示',
          content: '扫码失败',
          showCancel: false
        });
      },
      complete: function(res) {

      }
    })
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
    console.log('下拉刷新')
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