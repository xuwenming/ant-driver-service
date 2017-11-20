// page/component/balance-cash/balance-cash.js
var config = require('../../../config');
var request = require('../../common/request');
var Util = require('../../../util/util').Util;
var time = 59;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    driver: {
      amountByY: 0,
      amountByF: 0
    },
    amount: null,
    vcode: '',
    animationData: "",
    showModalStatus: false,
    vcodeBtn: {
      msg: '获取验证码',
      disabled: false
    },
    cashBtn: {
      disabled: true
    },
    confirmBtn: {
      disabled: true,
      loading: false
    }
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

  setAmount: function (e) {
    var amount = Util.clearNoNum(e.detail.value), amountByF = this.data.driver.amountByF;

    if (!Util.isEmpty(amount) && amount >= 1 && amount * 1000 / 10 <= amountByF) {
      this.setData({
        'cashBtn.disabled': false,
        amount: amount
      });
    } else {
      this.setData({
        'cashBtn.disabled': true
      });
    }
  },

  setVcode: function (e) {
    var vcode = e.detail.value;

    if (!Util.isEmpty(vcode)) {
      this.setData({
        'confirmBtn.disabled': false,
        vcode: vcode
      });
    } else {
      this.setData({
        'confirmBtn.disabled': true,
        vcode: vcode
      });
    }

  },

  cashAll: function () {
    var amountByY = this.data.driver.amountByY.replace(/[,]/g, '');
    if (amountByY > 0)
      this.setData({
        'cashBtn.disabled': false,
        amount: amountByY
      });
  },

  getVCode: function (e) {
    var self = this;
    self.setData({
      vcodeBtn: {
        msg: '重发' + time,
        disabled: true
      }
    });

    time--;
    var interval = setInterval(function () {
      self.setData({
        'vcodeBtn.msg': '重发' + time
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
      url: config.getBalanceRollVcodeUrl,
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

  // 获取钱包余额
  getBalance: function () {
    var self = this;

    request.httpGet({
      url: config.getBalanceUrl,
      success: function (data) {
        if (data.success) {
          self.setData({
            driver: {
              amountByY: Util.fenToYuan(data.obj.driverBalance.amount),
              amountByF: data.obj.driverBalance.amount
            }
          });
        }
      }
    })
  },

  cash: function () {
    var self = this;
    self.setData({
      'confirmBtn.loading': true
    });

    request.httpPost({
      url: config.balanceCashUrl,
      data: { vcode: self.data.vcode, amount: self.data.amount * 1000 / 10 },
      showLoading: true,
      success: function (data) {
        if (data.success) {
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            mask: true,
            complete: function () {
              self.hideModal();
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000);
            }
          })
        } else {
          wx.showModal({
            content: data.msg,
            showCancel: false
          });
          self.setData({
            'confirmBtn.loading': false
          });
        }
      }
    })
  },

  cancel: function () {
    console.log(this.data.vcode);
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

  showModal: function () {
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
      showModalStatus: true,
      'confirmBtn.disabled': true,
      vcode: ''
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    if (!Util.isEmpty(this.data.vcode)) {
      return;
    }
    this.cancel();
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