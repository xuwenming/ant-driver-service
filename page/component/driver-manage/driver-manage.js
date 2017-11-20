// page/component/shop-manage/shop-manage.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountInfo : {
      userName: '',
      nickName: '',
      avatarUrl: '/image/default_icon.png',
      validOrders:0,
      turnover:0
    },
    online:{
      type:'',
      online:0,
      name:''
    },
    pageLoad:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow:function(){
    this.setAccountInfo();
  },

  changeOnline:function(e){
    var self = this, online = self.data.online.online == 1 ? 0 : 1;
    request.httpPost({
      url: config.updateOnlineUrl,
      data: { online: online},
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: online == 1 ? '上线成功' : '已下线',
            icon: 'success',
            mask: true,
            duration: 1000,
            complete: function () {
              self.setData({
                online: {
                  type: online == 1 ? 'yellow' : 'default',
                  online: online,
                  name: online == 1 ? '接单中' : '已下线'
                }
              });
            }
          })
        }
      }
    })
  },

  onPullDownRefresh: function () {
    this.setAccountInfo();
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 200);
    
  },

  setAccountInfo : function() {
    var self = this;
    request.httpPost({
      url: config.getAccountInfoUrl,
      success: function (data) {
        if (data.success) {
          var online = data.obj.account.online;
          self.setData({
            accountInfo: {
              userName: data.obj.account.userName,
              nickName: data.obj.account.nickName,
              avatarUrl: data.obj.account.icon || '/image/default_icon.png',
              validOrders: data.obj.todayQuantity,
              turnover: Util.fenToYuan(data.obj.todayAmount)
            },
            online:{
              type: online == 1 ? 'yellow' : 'default',
              online: online,
              name: online == 1 ? '接单中' : '已下线'
            },
            pageLoad:true
          });
        }
      }
    })
  },
  
  toUser : function(){
    var url = '/page/component/user/user?userName=' + this.data.accountInfo.userName 
      + '&nickName=' + this.data.accountInfo.nickName
      + '&avatarUrl=' + this.data.accountInfo.avatarUrl;
    wx.navigateTo({
      url: url
    })
  },
  todayOrders: function () {
    wx.navigateTo({
      url: '/page/component/today-order-list/today-order-list'
    })
  },
  showAvatar: function () {
    var self = this;
    wx.previewImage({
      urls: [self.data.accountInfo.avatarUrl]
    })
  }
})