// page/component/balance-log-detail/balance-log-detail.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refType:null,
    balanceDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      refType: options.refType
    })
    if (options.refType == 'BT150' || options.refType == 'BT151') {
      request.httpGet({
        url: config.getBalanceLogDetailUrl,
        data: { refId: options.refId, refType: options.refType },
        success: function (data) {
          console.log(data)
          if (data.success) {
            data.obj.amount = Util.fenToYuan(data.obj.amount);
            data.obj.addtime = Util.format(new Date(data.obj.addtime.replace(/-/g, "/")), 'MM-dd HH:mm');
            // data.obj.distance = Util.distanceConvert(data.obj.deliverOrderShop.distance);
            var completeImages = data.obj.completeImages;
            if (!Util.isEmpty(completeImages) && completeImages != 'null') {
              data.obj.completeImages = completeImages.split(";");
            } else {
              data.obj.completeImages = null;
            }
            self.setData({
              balanceDetail: data.obj
            });
          }
        }
      })
    } else {
      var refTypeName, status = null;
      if (options.refType == 'BT101') {
        refTypeName = '派单钱包提现至微信零钱';
        status = (options.handleStatus === undefined || options.handleStatus == 'HS02') ? '已存入微信零钱' : (options.handleStatus == 'HS01' ? '处理中' : '提现被驳回');
      }
      self.setData({
        balanceDetail: {
          id: options.id,
          refTypeName: refTypeName,
          amount: options.amount.substr(1),
          status: status,
          addtime: Util.format(new Date(options.addtime.replace(/-/g, "/")), 'MM-dd HH:mm')
        }
      });
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
  },
  showImage: function (e) {
    var completeImages = this.data.balanceDetail.completeImages;
    wx.previewImage({
      current: completeImages[e.target.dataset.index],
      urls: completeImages
    })
  },
})