// page/component/refuse-order/refuse-order.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var orderId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    submit_disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    orderId = options.orderId;
  },

  setRemark: function(e){
    if (Util.isEmpty(e.detail.value)) {
      this.setData({ submit_disabled:true});
    } else {
      this.setData({ submit_disabled: false });
    }
  },

  refuseOrder: function(e){
    var self = this, params = e.detail.value;
    params.id = orderId;

    request.httpPost({
      url: config.refuseOrderUrl,
      data: params,
      success: function (data) {
        if (data.success) {
          wx.showModal({
            content: '拒绝成功，可前往已处理订单查看！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                self.cancel();
              } 
            }
          })
        }
      },
      error:function(){
        self.cancel();
      }
    })
  },

  cancel:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})