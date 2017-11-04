
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceLogs: null,
    cond: {
      showDate: '本月',
      date: Util.format(new Date(), 'yyyy-MM'),
      start: '2017-01',
      end: Util.format(new Date(), 'yyyy-MM')
    },
    hasMore: false,

    noDataMsg: '您这个月没有相关的提现记录哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currPage = 1;
    this.getBalanceLogs(true);
  },

  getBalanceLogs: function (isRefresh) {
    var self = this;
    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    wx.showNavigationBarLoading();

    request.httpGet({
      url: config.getBalanceCashLogsUrl,
      data: { date: self.data.cond.date, page: currPage, rows: rows },
      success: function (data) {
        if (data.success) {
          if (data.obj.rows.length >= 10) {
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
            var balanceLog = data.obj.rows[i];
            var amount = balanceLog.amount;
            if (balanceLog.amount < 0) {
              amount = -amount;
            }
            data.obj.rows[i].amount = "-" + Util.fenToYuan(amount);
          }
          var balanceLogs = self.data.balanceLogs;
          if (isRefresh) balanceLogs = data.obj.rows;
          else balanceLogs = balanceLogs.concat(data.obj.rows);
          self.setData({
            balanceLogs: balanceLogs
          });
        }
      }
    })
  },

  bindDateChange: function (e) {
    var showDate;
    if (e.detail.value == Util.format(new Date(), 'yyyy-MM')) {
      showDate = '本月'
    } else {
      showDate = Util.format(new Date(e.detail.value), 'yyyy年M月')
    }

    this.setData({
      'cond.showDate': showDate,
      'cond.date': e.detail.value,
      balanceLogs: null
    });

    currPage = 1;
    this.getBalanceLogs(true);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getBalanceLogs(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getBalanceLogs();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon: 'loading',
      //   duration: 500
      // })
    }
  }

})