// page/component/shop-auth/shop-auth.js
var config = require('../../../config');
var request = require('../../common/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver : {
      userName : '',
      nickName : '',
      statusIcon : ''
    },
    status : null,
    pageLoad: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.getDriverAccount();
  },

  getDriverAccount: function (){
    var self = this;
    request.httpPost({
      url: config.getAccountInfoUrl,
      success: function (data) {
        if (data.success && data.obj) {
          if (data.obj.account.handleStatus == 'DAHS02') {
            wx.switchTab({
              url: '/page/component/new-order/new-order'
            });
          } else {
            self.setData({
              status: data.obj.status,
              driver: {
                userName: data.obj.account.userName,
                nickName: data.obj.account.nickName,
                statusIcon: data.obj.handleStatus == 'DAHS01' ? '/image/auth_ing.png' : (data.obj.handleStatus == 'DAHS02' ? '/image/auth_success.png' : '/image/auth_failed.png')
              },
              pageLoad: true
            });
          }
        }
      }
    })
  },
  makePhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: '4000021365',
    })
  },
  onPullDownRefresh: function () {
    if(this.data.status) {
      this.getShopApply();
    }
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 500);
  },

  chooseShop : function(e){
    var self = this;
    wx.showModal({
      title:'提示',
      content: '是否绑定门店【' + e.target.dataset.shopName+'】，绑定之后不可更改！',
      success: function (res) {
        if (res.confirm) {
          request.httpPost({
            url: config.addShopApplyUrl,
            data: { shopId: e.target.dataset.shopId},
            success: function (data) {
              if (data.success) {
                wx.showModal({
                  title: '提示',
                  content: '门店申请已提交，请耐心等待或致电客服！',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      self.setData({
                        status:'DAS01',
                        mbShop:{
                          name: e.target.dataset.shopName,
                          address: e.target.dataset.address,
                          contactPeople: e.target.dataset.contactPeople,
                          statusIcon: '/image/auth_ing.png'
                        }
                      });
                    }
                  }
                });
              }
            }
          })
        }
      }
    });
  }
})