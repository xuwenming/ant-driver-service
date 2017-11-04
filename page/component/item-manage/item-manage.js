// page/component/item-manage/item-manage.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

var currPage = 1, rows = 10;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    items:null,
    hasMore:false,

    animationData: "",
    showModalStatus: false,
    confirmBtn: {
      disabled: true,
      loading: false
    },
    quantity:null,
    updateQuantityIndex:null,
    updateQuantityItemId:null,

    showSearchStatus : false,
    searchInpFocus:true,
    searchValue:'',
    searchTxt:'',
    searchDelete:false,
    searchList:[],

    noDataMsg:'没有相关商品哦~'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function(){
    currPage = 1;
    this.getItems(true);
  },

  switchTab: function (e) {
    var self = this;

    if (self.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      self.setData({
        currentTab: e.target.dataset.current,
        items:null
      });
      // wx.showLoading({
      //   title: '努力加载中...',
      //   mask: true
      // })
      currPage = 1;
      self.getItems(true);
    }
  },

  /**
   * TODO 暂时没做翻页
   * isRefresh:true=初始化或下拉刷新 false=上拉加载更多
   */
  getItems: function (isRefresh) {
    var self = this;
    var url;
    if (self.data.currentTab == 0) 
      url = config.getAllItemsUrl;
    else if (self.data.currentTab == 1)
      url = config.getOnlineItemsUrl;
    else if (self.data.currentTab == 2)
      url = config.getOfflineItemsUrl;
    else if (self.data.currentTab == 3)
      url = config.getAuditItemsUrl;

    wx.showNavigationBarLoading();
    request.httpGet({
      url: url,
      data: {page: currPage, rows: rows },
      success: function (data) {
        if (data.success) {
          if (data.obj.rows.length >= 10) {
            currPage ++;
            self.setData({
              hasMore: true
            });
          } else {
            self.setData({
              hasMore: false
            });
          }
          if (self.data.currentTab == 1 || self.data.currentTab == 2) {
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

  // 上架
  online : function(e){
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
                    var items = self.data.items;
                    if (self.data.currentTab == 0) {
                      var currItem = items[e.target.dataset.index];
                      if (currItem.status == 'SIS02') {
                        currItem.online = true;
                      } else {
                        currItem.status = 'SIS01';
                      }
                      
                      items.splice(e.target.dataset.index, 1, currItem);
                    } else {
                      items.splice(e.target.dataset.index, 1);
                    }
                    
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
                    var items = self.data.items;
                    if (self.data.currentTab == 0) {
                      var currItem = items[e.target.dataset.index];
                      currItem.online = false;
                      items.splice(e.target.dataset.index, 1, currItem);
                    } else {
                      items.splice(e.target.dataset.index, 1);
                    }

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
                    var items = self.data.items;
                    if (self.data.currentTab == 0) {
                      var currItem = items[e.target.dataset.index];
                      currItem.online = null;
                      items.splice(e.target.dataset.index, 1, currItem);
                    } else {
                      items.splice(e.target.dataset.index, 1);
                    }
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

  setQuantity:function(e){
    var quantity = e.detail.value;

    if (!Util.isEmpty(quantity)) {
      this.setData({
        'confirmBtn.disabled': false,
        quantity: quantity
      });
    } else {
      this.setData({
        'confirmBtn.disabled': true,
        quantity:''
      });
    }
  },
  
  batchUp:function(){
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=up',
    })
  },
  batchDown: function () {
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=down',
    })
  },
  batchDel: function () {
    wx.navigateTo({
      url: '/page/component/item-batch/item-batch?type=del',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.showSearchStatus) return;

    // wx.showLoading({
    //   title: '努力加载中...',
    //   mask: true
    // })

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
    if (this.data.showSearchStatus) return;

    if(this.data.hasMore) {
      // wx.showLoading({
      //   title: '努力加载中...',
      //   mask: true
      // })
      this.getItems();
    } else {
      // wx.showToast({
      //   title: '无更多商品~',
      //   icon:'loading',
      //   duration:500
      // })
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
      animationData: animation.export()
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
      'confirmBtn.disabled' : e.target.dataset.quantity > 0 ? false : true
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

  showSearch:function(){
    this.setData({
      showSearchStatus: true,
      items:null
    });

    var searchValue = this.data.searchValue, searchHistory = wx.getStorageSync('searchHistory') || [];
    if (Util.isEmpty(searchValue) && searchHistory.length != 0) {
      this.setData({
        searchTxt:'最近搜索',
        searchDelete:true,
        searchList: searchHistory
      });
    }
  }, 
  hideSearch: function () {
    this.setData({
      showSearchStatus: false,
      searchValue:'',
      searchTxt: '',
      searchDelete: false,
      searchList: []
    });

    // wx.showNavigationBarLoading();
    currPage = 1;
    this.getItems(true);
  },
  setSearchValue:function(e){
    var self = this, searchValue = e.detail.value, searchHistory = wx.getStorageSync('searchHistory') || [];
    self.setData({ searchValue: searchValue});
    if (Util.isEmpty(searchValue)) {
      if (searchHistory.length == 0) {
        self.setData({
          searchTxt: '',
          searchDelete: false,
          searchList: []
        });
      } else {
        self.setData({
          searchTxt: '最近搜索',
          searchDelete: true,
          searchList: searchHistory
        });
      }

      return;
    }

    request.httpGet({
      url: config.getAllItemsUrl,
      data: { page: 1, rows: 50, name: searchValue},
      success: function (data) {
        if (data.success) {
          var result = data.obj.rows;
          if (result.length == 0) {
            if (searchHistory.length == 0) {
              self.setData({
                searchTxt: '',
                searchDelete: false,
                searchList: []
              });
            } else {
              self.setData({
                searchTxt: '最近搜索',
                searchDelete: true,
                searchList: searchHistory
              });
            }
          } else {
            var items = [];
            for (var i in result) {
              items.push(result[i].name);
            }
            self.setData({
              searchTxt: '搜索发现',
              searchDelete: false,
              searchList: items
            });
          }
        }
      }
    })
  },
  search:function(e){
    var searchValue = e.target.dataset.itemName;
    if (!searchValue) searchValue = this.data.searchValue;
    if (Util.isEmpty(searchValue)) {
      this.setData({ searchInpFocus:true});
      return;
    }
    this.setSearchHistory(searchValue);

    searchValue = encodeURIComponent(searchValue).replace(/[!]/g, "%21").replace(/[']/g, "%27")
      .replace(/[(]/g, "%28").replace(/[)]/g, "%29").replace(/[~]/g, "%7E");
    wx.navigateTo({
      url: '/page/component/item-search/item-search?q=' + searchValue
    })
  },
  clearHistory:function(){
    wx.removeStorageSync('searchHistory');
    this.setData({
      searchTxt: '',
      searchDelete: false,
      searchList: []
    });
  },

  setSearchHistory:function(value){
    var searchHistory = wx.getStorageSync('searchHistory') || [];
    Util.arrayRemove(searchHistory, value);
    if (searchHistory.length == 10) searchHistory.pop();
    searchHistory.unshift(value);
    wx.setStorageSync('searchHistory', searchHistory);
  },
})