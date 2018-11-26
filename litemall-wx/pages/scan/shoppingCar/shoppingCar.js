// pages/scan/shoppingCar/shoppingCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['不要发票', '纸质发票'],
    index: 0,
    cartGoods:[
      { goodsId: '1000', goodsName: '绿箭无糖薄荷糖柠檬味 两件八折', price: '22.90', number: 3, picUrl:'/static/images/wxpay.png' },
      { goodsId: '1001', goodsName: '视界.无界：写给UI设计师的设计书 (全彩)', price: '52.40', number: 1, picUrl: '/static/images/ico-addr.png' },
      { goodsId: '1002', goodsName: '告别失控 软件开发团队管理必读', price: '49.40', number: 5, picUrl: '/static/images/friend.png' },
    ],
    cartTotal:{
      goodsAmount: 0.00,
      goodsCount: 0
    },
    startX: 0,
    delBtnWidth: 100 //删除按钮宽度
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
    console.log('ready-----go')
    this.getGoodsAmount();
    this.getGoodsCount();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('refresh-----go')
    this.getGoodsAmount();
    this.getGoodsCount();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
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

  },
  //购物车初始化
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }
    });
  },
  //数量加减
  addNumber: function (e) {
    let itemIndex = e.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.getGoodsAmount();
    this.getGoodsCount();
  },
  cutNumber: function (e) {
    let itemIndex = e.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.getGoodsAmount();
    this.getGoodsCount();
  },

  //手指刚放到屏幕触发
  touchS: function (e) {
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:" + e);
    let that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      let moveX = e.touches[0].clientX;
      console.log('距离是：' + moveX)
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      let disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      let delBtnWidth = that.data.delBtnWidth;
      let topStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        topStyle = "transform:translateX(0rpx);transition: all .2s";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        topStyle = "transform:translateX(-" + disX + "rpx)";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          topStyle = "transform:translateX(-" + delBtnWidth + "rpx)";
        }
      }
      //获取手指触摸的是哪一个item
      let index = e.currentTarget.dataset.itemIndex;
      console.log('currentTarget是：'+index)
      console.log('target是：' + e.target.dataset.itemIndex)
      let list = that.data.cartGoods;
      //将拼接好的样式设置到当前item中
      list[index].topStyle = topStyle;
      //更新列表的状态
      this.setData({
        cartGoods: list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE" + e);
    let that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      let endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      let disX = that.data.startX - endX;
      let delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      let topStyle = disX > delBtnWidth / 2 ? "transform:translateX(-" + delBtnWidth + "rpx);transition: all .2s" : "transform:translateX(0rpx);transition: all .5s";
      //获取手指触摸的是哪一项
      let index = e.currentTarget.dataset.itemIndex;
      let list = that.data.cartGoods;
      list[index].topStyle = topStyle;
      //更新列表的状态
      that.setData({
        cartGoods: list
      });
    }
  },

  //删除
  delItem: function (e) {
    this.data.cartGoods.splice(e.currentTarget.dataset.itemIndex, 1)
    this.setData({
      cartGoods: this.data.cartGoods
    })
    this.getGoodsAmount();
    this.getGoodsCount();
  },

  //前端计算商品总额
  getGoodsAmount: function () {
    let goodsAmount = 0.00;
    this.data.cartGoods.forEach(function (v) {
      goodsAmount += v.number * v.price;
    });
    this.setData({
      'cartTotal.goodsAmount': goodsAmount.toFixed(2)
    })
  },

  //前端计算商品总数量
  getGoodsCount: function () {
    let goodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      goodsCount += v.number;
    });
    this.setData({
      'cartTotal.goodsCount': goodsCount
    })
  },
  //结算支付
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, {
      cartId: 1,
      addressId: 2,
      couponId: 3,
      message: 4,
      grouponRulesId: 5,
      grouponLinkId: 6
    }, 'POST').then(res => {
      if (res.errno === 0) {
        // const orderId = res.data.orderId;
        const orderId = 1111;
        util.request(api.OrderPrepay, {
          orderId: orderId
        }, 'POST').then(function (res) {
          if (res.errno === 0) {
            const payParam = res.data;
            console.log("支付过程开始");
            wx.requestPayment({
              'timeStamp': payParam.timeStamp,
              'nonceStr': payParam.nonceStr,
              'package': payParam.packageValue,
              'signType': payParam.signType,
              'paySign': payParam.paySign,
              'success': function (res) {
                console.log("支付过程成功");
                wx.redirectTo({
                  url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                });
              },
              'fail': function (res) {
                console.log("支付过程失败");
                wx.redirectTo({
                  url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                });
              },
              'complete': function (res) {
                console.log("支付过程结束")
              }
            });
          } else {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=0&orderId=' + orderId
            });
          }
        });

      } else {
        wx.redirectTo({
          url: '/pages/payResult/payResult?status=0&orderId=' + orderId
        });
      }
    });
  },
  //发票选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //调用扫码
  scanCode: function () {
    let that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
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
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '扫码失败',
          showCancel: false
        });
      },
      complete: function (res) {

      }
    })
  }
})