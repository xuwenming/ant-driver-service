/**
 * 小程序配置文件
 * pro appid=wx7cfa5d0f69d854ee
 * qa  appid=wx0d96de3cd604f954
 */

//  var server_host = "http://192.168.1.140:8082"; // dev
var server_host = "http://101.132.177.151:8080"; //qa
// var server_host = "https://www.qrun360.com"; // pro

var config = {

    // 下面的地址配合云端 Server 工作
    server_host,

    // 登录地址，用于建立会话
    loginUrl: `${server_host}/api/driver/account/login`,

    // 获取验证码
    getVcodeUrl: `${server_host}/api/driver/account/getVCode`,

    // 注册地址
    regUrl: `${server_host}/api/driver/account/register`,

  
  

    // 获取用户信息
    getAccountInfoUrl: `${server_host}/api/driver/account/get`,

    // 更新用户信息
    updateAccountUrl: `${server_host}/api/driver/account/update`,

    // 更新接单状态
    updateOnlineUrl: `${server_host}/api/driver/account/updateOnline`,
    //获取新订单
    getNewOrdersUrl: `${server_host}/api/driver/orderShop/viewAuditOrder`,
    // 订单列表查询
    getOrdersUrl: `${server_host}/api/driver/orderShop/dataGrid`,
    //获取今日有效订单
    getTodayOrdersUrl:`${server_host}/api/driver/orderShop/getTodayOrders`,
    //获取今日营业额
    getTodayOrdersIncome: `${server_host}/api/driver/orderShop/getTodayProfitOrders`,
    // 订单列表查询(取消)
    getRefusedOrdersUrl: `${server_host}/api/driver/deliverOrder/viewRefusedDataGrid`,
    // getOrdersUrl: `${server_host}/testData/orders.txt`,

    // 拒绝订单
    refuseOrderUrl: `${server_host}/api/driver/orderShop/editOrderRefuse`,

    // 开始接单
    acceptOrderUrl: `${server_host}/api/driver/orderShop/editOrderAccept`,

    // 订单发货
    deliverOrderUrl: `${server_host}/api/driver/orderShop/editOrderSendOut`,

    // 订单送达完成
    completeOrderUrl: `${server_host}/api/driver/orderShop/editOrderComplete`,

    // 退货拒收
    editRejectUrl: `${server_host}/api/driver/orderShop/editReject`,

    uploadImageUrl: `${server_host}/api/driver/orderShop/uploadImage`,

    // 获取有效新订单数量
    updateCountNewAllocationOrder: `${server_host}/api/driver/orderShop/updateCountNewAllocationOrder`,

    // 获取钱包余额
    getBalanceUrl: `${server_host}/api/driver/driverBalance/viewBalance`,

    // 提现短信验证码
    getBalanceRollVcodeUrl: `${server_host}/api/driver/driverBalance/getVCode`,

    // 账户明细列表
    getBalanceLogsUrl: `${server_host}/api/driver/driverBalance/viewDriverBanlanceLogDataGrid`,

    // 账户明细详情
    getBalanceLogDetailUrl: `${server_host}/api/driver/driverBalance/viewDriverBanlanceLogDetial`,
    
    // 按月统计收入支出
    totalBalanceByMonthlUrl: `${server_host}/api/driver/driverBalance/getTotalBalanceByMonth`,

    // 申请余额提现
    balanceCashUrl: `${server_host}/api/driver/driverBalance/updateWithdraw`,

    // 提现记录列表
    getBalanceCashLogsUrl: `${server_host}/api/driver/driverBalance/viewWithdrawDataGrid`,

    // 获取数据字典
    getBaseDataByKeyUrl: `${server_host}/api/deliver/basedata/get`,
    
    //更新骑手位置信息
    updateLocation:`${server_host}/api/driver/account/updateLocation`,
    //订单明细
    getOrderDetailUrl: `${server_host}/api/driver/orderShop/getDetail`
    

};

module.exports = config
