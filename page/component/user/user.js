// page/component/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    nickName: '',
    avatarUrl: '/image/default_icon.png',
    shopName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: options.userName,
      nickName: options.nickName,
      avatarUrl: options.avatarUrl || '/image/default_icon.png',
    });
  },

  showAvatar:function(){
    var self = this;
    wx.previewImage({
      urls: [self.data.avatarUrl] 
    })
  }
})