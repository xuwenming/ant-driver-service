// page/component/order-list/order-list.js
var app = getApp();
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10, getDistanceInterval;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab : 0,
    orders: null,
    hasMore: false,

    noDataMsg:'没有相关订单哦~',
    lat: null,
    long: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.getOrders(true);
    getDistanceInterval = setInterval(function () {
      self.getDistance(true);
     }, 5000);
  },
  getDistance: function(){
    var self = this;
    var orders = self.data.orders;
    wx.getLocation({
      type: 'gcj02 ',
      success: function (res) {
        var baidu_point = Util.marsTobaidu(res.longitude, res.latitude);
        for (var i in orders) {
          var distance = Util.getDistance(baidu_point.lng, baidu_point.lat, orders[i].shop.longitude, orders[i].shop.latitude);
          orders[i].shopDistance = Util.distanceConvert(distance);
        }
        self.setData({
          orders: orders
        });
      },
    })
  },
  switchTab:function(e){
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current,
        orders: null
      })
      currPage = 1;
      self.getOrders(true);
    }
  },

  // 发货
  orderDeliver: function (e) {
    console.log(e)
    // 发送request处理订单
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否确定订单号【' + e.target.dataset.orderid + '】已发货？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.deliverOrderUrl,
            data: { id: e.target.dataset.orderid},
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "发货成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    var orders = self.data.orders;
                    orders.splice(e.target.dataset.index, 1);
                    self.setData({
                      orders: orders
                    });
                  }
                })
              }
            }
          })
        }
      }
    });

  },
  // 送达完成
  orderComplete: function (e) {
    // 发送request处理订单
    var self = this;
    wx.navigateTo({
      url: '/page/component/order-complete/order-complete?orderId=' + e.target.dataset.orderid + '&deliverordershopid=' + e.target.dataset.deliverordershopid
    })

  },
  viewDetail: function (e) {
    if (this.data.currentTab == 2)
      wx.navigateTo({
        url: '/page/component/order-detail/order-detail?orderId=' + e.currentTarget.dataset.orderId
      })
  },
  // // 送达完成
  // orderComplete: function (e) {
  //   // 发送request处理订单
  //   var self = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否确定订单号【' + e.target.dataset.deliverordershopid + '】已送达完成？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         request.httpPost({
  //           url: config.completeOrderUrl,
  //           data: { id: e.target.dataset.orderid },
  //           showLoading: true,
  //           success: function (data) {
  //             if (data.success) {
  //               wx.showToast({
  //                 title: "送达完成",
  //                 icon: 'success',
  //                 mask: true,
  //                 duration: 500,
  //                 complete: function () {
  //                   var orders = self.data.orders;
  //                   orders.splice(e.target.dataset.index, 1);
  //                   self.setData({
  //                     orders: orders
  //                   });
  //                 }
  //               })
  //             }
  //           }
  //         })
  //       }
  //     }
  //   });

  // },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getOrders: function (isRefresh) {
    var self = this, currentTab = this.data.currentTab, status;
    var url = config.getOrdersUrl;
    if (currentTab == 0) status = 'DDSS05';
    else if (currentTab == 1) status = 'DDSS10';
    else if (currentTab == 2) status = 'DDSS20,DDSS30';

    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    wx.showNavigationBarLoading();

    request.httpGet({
      url: url,
      data: { status: status, page: currPage, rows: rows },
      success: function (data) {
        console.log(data);
        if (data.success) {
          if (data.obj.rows.length >= rows) {
            currPage++;
            self.setData({
              hasMore: true
            });
          } else {
            self.setData({
              hasMore: false
            });
          }
          for (var i in data.obj.rows) {
            data.obj.rows[i].amount = Util.fenToYuan(data.obj.rows[i].amount);
            data.obj.rows[i].addtime = Util.format(new Date(data.obj.rows[i].addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
            data.obj.rows[i].deliverOrderShop.distance = Util.distanceConvert(data.obj.rows[i].deliverOrderShop.distance);
            }
          var orders = self.data.orders;
          if (isRefresh) orders = data.obj.rows;
          else orders = orders.concat(data.obj.rows);
          self.setData({
            orders: orders
          });
          self.getDistance();
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getOrders(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getOrders();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  openMap: function (e) {
    var self = this,
      latitude = e.currentTarget.dataset.latitude,
      longitude = e.currentTarget.dataset.longitude;
      //百度经纬度转火星经纬度
    var mars_point = Util.baiduTomars(longitude,latitude);
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
          latitude: mars_point.lat,
          longitude: mars_point.lng,
          address: e.currentTarget.dataset.address
        })
      },
      fail: function () {
        app.getAuthorize({
          scope: 'scope.userLocation',
          content: '检测到您没打开定位权限，是否去设置打开？',
          required: true // 必须授权
        })
      }
    })
  }
  
})