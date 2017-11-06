var app = getApp();
var config = require('../../config');
var Util = require('../../util/util').Util;
var request = require('../common/request');
var time = 59;

Page({
  data: {
    userName : '',
    vcode : '',
    vcodeBtn : {
      msg: '获取验证码',
      disabled : true
    },
    regBtn: {
      disabled: true,
      loading : false
    },
    pageLoad : false,
    userInfo : null
  },
  onLoad: function (options){
    var self = this;

    wx.showNavigationBarLoading();
    request.login(function(){
      wx.switchTab({
        url: '/page/component/new-order/new-order'
      });
    },function(){
      wx.setNavigationBarTitle({
        title: '注册'
      });
      self.setData({
        pageLoad: true
      });
      wx.hideNavigationBarLoading();
    });
    self.getUserInfo();
  },

  onShow : function(){
    
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  getUserInfo : function() {
    var self = this;
    app.getAuthorize({
      scope: 'scope.userInfo',
      content: '检测到您没打开用户信息权限，是否去设置打开？',
      required: true, // 必须授权
      callback: function () {
        wx.getUserInfo({
          success: function (res) {
            if(app.globalData.tokenId) {
              request.httpPost({
                url: config.updateAccountUrl,
                data: {
                  nickName: res.userInfo.nickName,
                  icon: res.userInfo.avatarUrl,
                  sex: res.userInfo.gender
                },
                success: function (data) {
                  if (data.success) {}
                }
              })
            } else {
              self.setData({
                userInfo: res.userInfo
              });
            }
          }
        })
      }
    })
  },

  setUserName : function(e) {
    var userName = e.detail.value;
    if (Util.checkPhone(userName)) {
      this.setData({
        'vcodeBtn.disabled': false,
        userName: userName
      });
      if (!Util.isEmpty(this.data.vcode)) {
        this.setData({
          'regBtn.disabled': false,
        });
      }
    } else {
      this.setData({
        'vcodeBtn.disabled': true,
        'regBtn.disabled': true,
        userName: ''
      });
    }
  },

  setVcode: function (e) {
    var vcode = e.detail.value;
    if (Util.checkPhone(this.data.userName)) {
      if (!Util.isEmpty(vcode)) {
        this.setData({
          'regBtn.disabled': false,
          vcode: vcode
        });
      } else {
        this.setData({
          'regBtn.disabled': true
        });
      }
    } else {
      this.setData({
        vcode: vcode
      });
    }
  },

  getVCode : function(e) {
    var self = this;
    self.setData({
      vcodeBtn : {
        msg: '重发' + time,
        disabled: true
      }
    });

    time--;
    var interval = setInterval(function () {
      self.setData({
        'vcodeBtn.msg' : '重发' + time
      });
      if (time == 0) {
        clearInterval(interval);
        self.setData({
          vcodeBtn: {
            msg: '获取验证码',
            disabled: false
          }
        });
        time = 59;
      } else {
        time--;
      }
    }, 1000);

    request.httpPost({
      url: config.getVcodeUrl,
      noLogin: true,
      data: {
        mobile: self.data.userName
      },
      success: function (data) {
        if (!data.success) {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
          clearInterval(interval);
          self.setData({
            vcodeBtn: {
              msg: '获取验证码',
              disabled: false
            }
          });
          time = 59;
        }
      }
    })
  },
  
  register : function(e){
    var self = this;
    this.setData({
      'regBtn.loading': true
    });
    var params = e.detail.value, userInfo = this.data.userInfo;
    params.refId = app.globalData.openid;
    params.refType = 'wx';
    if(userInfo) {
      params.nickName = userInfo.nickName;
      params.icon = userInfo.avatarUrl;
      params.sex = userInfo.gender;
    }
  
    request.httpPost({
      url: config.regUrl,
      data: params,
      noLogin: true,
      success: function (data) {
        if(data.success) {
          app.globalData.tokenId = data.obj;
          
          wx.redirectTo({
            url: '/page/component/shop-auth/shop-auth',
          });
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
          self.setData({
            'regBtn.loading': false
          });
        }
      }
    })
  }
})