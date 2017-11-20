// page/component/new-order/new-order.js
var app = getApp();
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;
var timer = require('../../../util/wxTimer');


var currPage = 1, rows = 10, newOrderIntervar;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:true,
    hasMore: false,
    wxTimerList: {},
    hasOrder:false,

    noDataMsg: 'Sorry！没有新的订单哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.playBackgroundAudio({
    //   dataUrl: 'http://img.qrun360.com/test.wav'
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    newOrderIntervar = setInterval(function () {
     self.getNewOrders(true);
    }, 10000);
    wx.showNavigationBarLoading();
    self.getNewOrders(true);
  },
  onHide:function(){
    if (newOrderIntervar) clearInterval(newOrderIntervar);
  },
  onUnload:function(){
    if (newOrderIntervar) clearInterval(newOrderIntervar);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getNewOrders: function (isRefresh){
    var self = this;
    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    request.httpGet({
      url: config.getNewOrdersUrl,
      success: function (data) {
        if (data.success) {
          if (data.obj.rows.length > 0) {
            self.setData({
              hasOrder:true
            });
            //  self.voiceReminder();
          }

          for (var i=0; i<data.obj.rows.length; i++) {
            data.obj.rows[i].amount = Util.fenToYuan(data.obj.rows[i].amount);
            data.obj.rows[i].addtime = Util.format(new Date(data.obj.rows[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
            data.obj.rows[i].deliverOrderShop.distance = Util.distanceConvert(data.obj.rows[i].deliverOrderShop.distance);
          }
          var orders = self.data.orders;
          if (isRefresh) orders = data.obj.rows;
          else orders = orders.concat(data.obj.rows);
          self.setData({
            orders: orders,
          });
        }
      }
    })
  },

  processOrder:function(e){
    // 发送request处理订单
    var self = this;
    wx.showModal({
      title:'提示',
      content: '接单之后不可取消，是否继续？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.acceptOrderUrl,
            data: { id: e.target.dataset.orderId },
            success: function (data) {
              if (data.success) {
                var orders = self.data.orders;
                orders.splice(e.target.dataset.index, 1);
                self.setData({
                  orders: orders
                });

                wx.showModal({
                  content: '成功接单，是否前往查看发货！',
                  success: function (res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '/page/component/order-list/order-list'
                      });
                    }
                  }
                });
              }
            }
          })
        }
      }
    });
    
  },

  refuseOrder : function(e){
    var self = this;
    wx.showModal({
      title: '提示',
      content: '您确定要拒绝订单吗？',
      success : function(res) {
          if (res.confirm) {
            request.httpPost({
              url: config.refuseOrderUrl,
              data: { id: e.target.dataset.orderId },
              success: function (data) {
                if (data.success) {
                  var orders = self.data.orders;
                  orders.splice(e.target.dataset.index, 1);
                  self.setData({
                    orders: orders
                  });
                 }
              }
           })
        }
      }
   })
            
  },

  voiceReminder: function(){
    request.httpGet({
      url: config.updateCountNewAllocationOrder,
      success: function (data) {
       console.log("播放声音")
       console.log(data)
        if (data.success && data.obj > 0) {

          request.httpGet({
            url: config.getBaseDataByKeyUrl,
            data: { key:'DSV300'},
            success: function (data) {
              if (data.success) {
                console.log("播放")
                wx.playBackgroundAudio({
                  dataUrl:data.obj.icon
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    wx.showNavigationBarLoading();
    this.getNewOrders(true);
    setTimeout(function(){
      wx.stopPullDownRefresh()  
    }, 200);
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      //this.getNewOrders();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  },

  openMap: function(e){
    var self = this, 
        latitude = e.currentTarget.dataset.latitude, 
        longitude = e.currentTarget.dataset.longitude;
    if (!latitude || !longitude) {
      wx.showModal({
        content: '未知位置，无法规划路线！',
        showCancel: false
      });
      return;
    }
    wx.getLocation({
      success: function (res) {
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          address: e.currentTarget.dataset.address
        })
      },
      fail: function(){
        app.getAuthorize({
          scope: 'scope.userLocation',
          content: '检测到您没打开定位权限，是否去设置打开？',
          required: true // 必须授权
        })
      }
    })
  }
})