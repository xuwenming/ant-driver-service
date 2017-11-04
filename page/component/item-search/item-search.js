// page/component/item-search/item-search.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10, q;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    hasMore: false,

    animationData: "",
    showModalStatus: false,
    confirmBtn: {
      disabled: true,
      loading: false
    },
    quantity: null,
    updateQuantityIndex: null,
    updateQuantityItemId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currPage = 1;
    try {
      q = decodeURIComponent(options.q);
    } catch(e) {
      q = options.q;
    }
    this.getItems(true);
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getItems: function (isRefresh) {
    var self = this;

    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })
    wx.showNavigationBarLoading();
    request.httpGet({
      url: config.getAllItemsUrl,
      data: { page: currPage, rows: rows, name:q },
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

  // 上架
  online: function (e) {
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否上架商品【' + e.target.dataset.itemName + '】？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.updateItemOnlineUrl,
            data: { itemId: e.target.dataset.itemId },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "上架成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    var items = self.data.items, currItem = items[e.target.dataset.index];
                    if (currItem.status == 'SIS02') {
                      currItem.online = true;
                    } else {
                      currItem.status = 'SIS01';
                    }
                    items.splice(e.target.dataset.index, 1, currItem);
                    self.setData({
                      items: items
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
  // 下架
  offline: function (e) {
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否下架商品【' + e.target.dataset.itemName + '】？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.updateItemOfflineUrl,
            data: { itemId: e.target.dataset.itemId },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "下架成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    var items = self.data.items, currItem = items[e.target.dataset.index];
                    currItem.online = false;
                    items.splice(e.target.dataset.index, 1, currItem);
                    self.setData({
                      items: items
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
  // 修改库存
  updateQuantity: function (e) {
    var self = this;

    request.httpPost({
      url: config.updateItemQuantityUrl,
      data: { itemId: self.data.updateQuantityItemId, quantity: self.data.quantity },
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: "库存修改成功",
            icon: 'success',
            mask: true,
            duration: 500,
            complete: function () {
              var items = self.data.items;
              var currItem = items[self.data.updateQuantityIndex];
              currItem.quantity = self.data.quantity
              items.splice(self.data.updateQuantityIndex, 1, currItem);
              self.setData({
                items: items
              });
              self.cancel();
            }
          })
        }
      }
    })
  },
  // 删除
  del: function (e) {
    var self = this;

    wx.showModal({
      title: '提示',
      content: '是否删除商品【' + e.target.dataset.itemName + '】？',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.deleteItemUrl,
            data: { itemId: e.target.dataset.itemId },
            showLoading: true,
            success: function (data) {
              if (data.success) {
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  mask: true,
                  duration: 500,
                  complete: function () {
                    var items = self.data.items, currItem = items[e.target.dataset.index];
                    currItem.online = null;
                    items.splice(e.target.dataset.index, 1, currItem);
                    self.setData({
                      items: items
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

  setQuantity: function (e) {
    var quantity = e.detail.value;

    if (!Util.isEmpty(quantity)) {
      this.setData({
        'confirmBtn.disabled': false,
        quantity: quantity
      });
    } else {
      this.setData({
        'confirmBtn.disabled': true,
        quantity: ''
      });
    }
  },

  cancel: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  showModal: function (e) {
    this.setData({
      quantity: e.target.dataset.quantity || null,
      updateQuantityIndex: e.target.dataset.index,
      updateQuantityItemId: e.target.dataset.itemId,
      'confirmBtn.disabled': e.target.dataset.quantity > 0 ? false : true
    });
    // 显示遮罩层
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    if (!Util.isEmpty(this.data.quantity)) {
      return;
    }
    this.cancel();
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
    }
  }
})