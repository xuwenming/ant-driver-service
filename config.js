/**
 * 小程序配置文件
 * pro appid=wx0b54b1b16b700f4b
 * qa  appid=wx6196df0ee20f5fa3
 */

var server_host = "http://192.168.1.141:8082"; // dev
// var server_host = "http://101.132.177.151:8080"; // qa
// var server_host = "https://www.qrun360.com"; // pro

var config = {

    // 下面的地址配合云端 Server 工作
    server_host,

    // 登录地址，用于建立会话
    loginUrl: `${server_host}/api/deliver/account/login`,

    // 获取验证码
    getVcodeUrl: `${server_host}/api/deliver/account/getVCode`,

    // 注册地址
    regUrl: `${server_host}/api/deliver/account/register`,

    // 获取门店信息列表
    // getShopsUrl: `${server_host}/testData/shops.txt`,
    getShopsUrl: `${server_host}/api/deliver/shop/dataGrid`,

    // 绑定门店申请
    addShopApplyUrl: `${server_host}/api/deliver/account/addShopApply`,

    // 获取门店信息
    getShopApplyUrl: `${server_host}/api/deliver/account/getShopApply`,

    // 获取用户信息
    getAccountInfoUrl: `${server_host}/api/deliver/account/get`,

    // 更新用户信息
    updateAccountUrl: `${server_host}/api/deliver/account/update`,

    // 更新营业状态
    updateOnlineUrl: `${server_host}/api/deliver/account/updateOnline`,

    // 订单列表查询
    getOrdersUrl: `${server_host}/api/deliver/deliverOrder/dataGrid`,
    // 订单列表查询(取消)
    getRefusedOrdersUrl: `${server_host}/api/deliver/deliverOrder/viewRefusedDataGrid`,
    // getOrdersUrl: `${server_host}/testData/orders.txt`,

    // 拒绝订单
    refuseOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderRefuse`,

    // 开始接单
    acceptOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderAccept`,

    // 订单发货
    deliverOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderSendOut`,

    // 订单送达完成
    completeOrderUrl: `${server_host}/api/deliver/deliverOrder/editOrderComplete`,

    uploadImageUrl: `${server_host}/api/deliver/deliverOrder/uploadImage`,

    // 获取有效新订单数量
    getNewOrderCountUrl: `${server_host}/api/deliver/deliverOrder/countNewAllocationOrder`,

    // 商品管理列表-全部
    getAllItemsUrl: `${server_host}/api/deliver/item/getAllItemList`,

    // 商品管理列表-上架
    getOnlineItemsUrl: `${server_host}/api/deliver/item/getShopItemOnline`,

    // 商品管理列表-下架
    getOfflineItemsUrl: `${server_host}/api/deliver/item/getShopItemOffline`,

    // 商品管理列表-审核中
    getAuditItemsUrl: `${server_host}/api/deliver/item/getShopItemWaitAudit`,

    // 商品上架
    updateItemOnlineUrl: `${server_host}/api/deliver/item/updateItemOnline`,

    // 商品批量上架
    updateBatchItemOnlineUrl: `${server_host}/api/deliver/item/updateBatchItemOnline`,

    // 商品下架
    updateItemOfflineUrl: `${server_host}/api/deliver/item/updateItemOffline`,

    // 商品批量下架
    updateBatchItemOfflineUrl: `${server_host}/api/deliver/item/updateBatchShopItemOffline`,

    // 商品删除
    deleteItemUrl: `${server_host}/api/deliver/item/deleteShopItem`,

    // 商品批量删除
    deleteBatchItemUrl: `${server_host}/api/deliver/item/deleteBatchShopItem`,

    // 修改商品库存
    updateItemQuantityUrl: `${server_host}/api/deliver/item/updateShopItemQuantity`,

    // 获取钱包余额
    getBalanceUrl: `${server_host}/api/deliver/deliverBalance/viewBalance`,

    // 转入/转出短信验证码
    getBalanceRollVcodeUrl: `${server_host}/api/deliver/deliverBalance/getVCode`,

    // 账户明细列表
    getBalanceLogsUrl: `${server_host}/api/deliver/deliverBalance/viewDeliverBanlanceLogDataGrid`,

    // 账户明细详情
    getBalanceLogDetailUrl: `${server_host}/api/deliver/deliverBalance/viewDeliverBanlanceLogDetial`,

    // 转出到采购钱包
    deliverToBalanceUrl: `${server_host}/api/deliver/deliverBalance/transformAmountDeliverToBalance`,

    // 转入到派单钱包
    balanceToDeliverUrl: `${server_host}/api/deliver/deliverBalance/transformAmountBalanceToDeliver`,

    // 申请余额提现
    balanceCashUrl: `${server_host}/api/deliver/deliverBalance/withdraw`,

    // 提现记录列表
    getBalanceCashLogsUrl: `${server_host}/api/deliver/deliverBalance/withdrawDataGrid`,

    // 获取数据字典
    getBaseDataByKeyUrl: `${server_host}/api/deliver/basedata/get`
};

module.exports = config
