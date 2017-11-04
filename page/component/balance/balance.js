// page/component/balance/balance.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceAmount : 0
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
    this.getBalance();
  },

  // 获取钱包余额
  getBalance :function() {
    var self = this;

    request.httpGet({
      url: config.getBalanceUrl,
      success: function (data) {
        if (data.success) {
          self.setData({
            balanceAmount: Util.fenToYuan(data.obj.deliverBalance.amount)
          });
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getBalance();
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  }
})