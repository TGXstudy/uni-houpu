import http from "@/http/index.js"

const api={}
//用户模块
/**
 * @description 小程序登录 前端先获取code后调用此接口直接登录
 * @param {Object} params 请求参数
 */
api.login=(params)=>http.post('/api/base/member/login',params,false),
/**
 * @description 发送验证码
 */
api.sendCode=(params)=>http.post('/api/base/member/sendCode',params,false),
/**
 * @description 绑定手机号，邀请码
 */
api.bindPhone=(params)=>http.post('/api/base/member/register',params,false),
/**
 * @description 获取用户信息
 */
api.userInfo=(params)=>http.post('/api/base/member/userInfo',params,false),
/**
 * @description 推荐好友
 */
api.recommendFriends=(params)=>http.post('/api/base/member/recommendFriends',params,false),
/**
 * @description 客户信息
 */
api.customerList=(params)=>http.post('/api/base/member/customerList',params,false),
/**
 * @description 保存推荐人
 */
api.editInviteCode=(params)=>http.post('/api/base/member/editInviteCode',params,false),
//首页模块
/**
 * @description 活动列表
 */
api.activityList=(params)=>http.post('/api/base/activity/activityList',params,false),
/**
 * @description 活动详情
 */
api.activityDetail=(params)=>http.post('/api/base/activity/activityDetail',params,false),
/**
 * @description 登记信息添加
 */
api.addMessage=(params)=>http.post('/api/base/message/addMessage',params,false),
/**
 * @description 登记信息列表
 */
api.messageList=(params)=>http.post('/api/base/message/messageList',params,false),
/**
 * @description 登记信息详情
 */
api.messageDetail=(params)=>http.post('/api/base/message/messageDetail',params,false),
/**
 * @description 提交订单
 */
api.messagePost=(params)=>http.post('/api/base/message/messagePost',params,false),
/**
 * @description 个人缴费记录
 */
api.messageLog=(params)=>http.post('/api/base/message/messageLog',params,false),
/**
 * @description 代缴费信息列表
 */
api.messageWait=(params)=>http.post('/api/base/message/messageWait',params,false),
/**
 * @description sdk配置参数
 */
api.getSignPackage=(params)=>http.post('/api/base/message/getSignPackage',params,false),

/**
 * @description 首页轮播
 */
api.bannerList=(params)=>http.post('/api/base/banner/bannerList',params,false),
/**
 * @description 体检中心列表
 */
api.hospitalList=(params)=>http.post('/api/base/hospital/hospitalList',params,false),
/**
 * @description 采血预约信息列表
 */
api.subscribe=(params)=>http.post('/api/base/message/subscribe',params,false),
/**
 * @description 采血预约
 */
api.bloodSubscribe=(params)=>http.post('/api/base/blood/bloodSubscribe',params,false),
/**
 * @description 采血地点列表
 */
api.bloodAddress=(params)=>http.post('/api/base/blood/address',params,false),
/**
 * @description 储存快过期提示
 */
api.messageTips=(params)=>http.post('/api/base/message/messageTips',params,false),
/**
 * @description 储存协议内容接口
 */
api.agreement=(params)=>http.post('/api/base/message/agreement',params,false),
/**
 * @description 申请提取信息列表
 */
api.extract=(params)=>http.post('/api/base/message/extract',params,false),
/**
 * @description 申请提取
 */
api.messageExtract=(params)=>http.post('/api/base/message/messageExtract',params,false),
/**
 * @description 系统信息列表
 */
api.systemMessage=(params)=>http.post('/api/base/message/systemMessage',params,false),
//个人中心
/**
 * @description 图片上传
 */
api.upload=(params)=>http.post('/api/base/upload/base',params,false),
//获取年限
/**
 * @description 获取年限
 */
api.getYear=(params)=>http.post('/api/base/message/getYear',params,false)
export default api;