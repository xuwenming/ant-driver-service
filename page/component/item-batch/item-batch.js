// page/component/item-batch/item-batch.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    optType:'',
    items:null,
    itemIds:'',
    hasMore: false,

    noDataMsg: '没有相关商品哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optType: options.type || 'up'
    });
    wx.setNavigationBarTitle({
      title: options.type == 'up' ? '批量上架' : (options.type == 'down' ? '批量下架' : '批量删除')
    });

    currPage = 1;
    this.getItems(true);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getItems: function (isRefresh) {
    var self = this, url;

    if (self.data.optType == 'up')
      url = config.getAllItemsUrl;
    else if (self.data.optType == 'down')
      url = config.getOnlineItemsUrl;
    else if (self.data.optType == 'del')
      url = config.getOfflineItemsUrl;

    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    wx.showNavigationBarLoading();

    request.httpGet({
      url: url,
      data: { page: currPage, rows: rows },
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

          if (self.data.optType != 'up') {
            for (var i in data.obj.rows) {
              if (data.obj.rows[i].price)
                data.obj.rows[i].price = Util.fenToYuan(data.obj.rows[i].price);
              if (data.obj.rows[i].freight)
                data.obj.rows[i].freight = Util.fenToYuan(data.obj.rows[i].freight);
            }
          }

          var items = self.data.items;
          if (isRefresh) items = data.obj.rows;
          else items = items.concat(data.obj.rows);
          self.setData({
            items: items
          });
        }
      }
    })
  },

  checkboxChange: function (e) {
    this.setData({
      itemIds: e.detail.value.join(',')
    });
  },

  // 批量上架
  batchOnline: function (e) {
    this.batchHandle();
  }, 

  // 批量下架
  batchOffline: function (e) {
    this.batchHandle();
  }, 

  // 批量删除
  batchDel: function (e) {
    this.batchHandle();
  }, 

  batchHandle: function(){
    var self = this, itemIds = self.data.itemIds, optName, url;
    if (!itemIds) {
      wx.showModal({
        content: '请至少选择一项商品',
        showCancel: false
      });
      return;
    }

    if (self.data.optType == 'up') {
      optName = '上架';
      url = config.updateBatchItemOnlineUrl;
    } else if (self.data.optType == 'down') {
      optName = '下架';
      url = config.updateBatchItemOfflineUrl;
    } else if (self.data.optType == 'del') {
      optName = '删除';
      url = config.deleteBatchItemUrl;
    }
    
    wx.showModal({
      title: '提示',
      content: '是否批量' + optName + '选中商品？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: url,
            data: { itemIds: itemIds },
            showLoading: true,
            success: function (data) {
              wx.showToast({
                title: optName + "成功",
                icon: 'success',
                mask: true,
                duration: 500,
                complete: function () {
                  var items = self.data.items, itemIdArr = itemIds.split(',');

                  for (var i = 0; i < itemIdArr.length; i++) {
                    for (var j = 0; j < items.length; j++) {
                      var itemId = self.data.optType == 'up' ? items[j].id : items[j].itemId;
                      if (itemId == itemIdArr[i]) {
                        items.splice(j, 1);
                        break;
                      }
                    }
                  }

                  self.setData({
                    items: items,
                    itemIds: ''
                  });
                }
              })
            }
          })
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    currPage = 1;
    this.getItems(true);
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 200);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getItems();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon:'loading',
      //   duration:500
      // })
    }
  }
})