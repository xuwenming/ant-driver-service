// page/component/order-detail/order-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.getOrderDetailUrl,
      data: { id: options.orderId },
      success: function (data) {
        console.log(data)
        if (data.success) {
          data.obj.amount = Util.fenToYuan(data.obj.amount);
          data.obj.addtime = Util.format(new Date(data.obj.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
          data.obj.distance = Util.distanceConvert(data.obj.distance);
          var completeImages = data.obj.completeImages;
          if (!Util.isEmpty(completeImages) && completeImages != 'null') {
            data.obj.completeImages = completeImages.split(";");
          } else {
            data.obj.completeImages = null;
          }
          self.setData({
            order: data.obj
          });
        }
      }
    })
  },

  showImage: function (e) {
    var completeImages = this.data.order.completeImages;
    wx.previewImage({
      current: completeImages[e.target.dataset.index],
      urls: completeImages
    })
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
    var mars_point = Util.baiduTomars(longitude, latitude);
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