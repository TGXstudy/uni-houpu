/* 
 * 路由表对象：
 * 该文件挂载在Vue原型中 $mRoutesConfig
 * 作用：调用$mRouter对象的方法 传入以下对应的路由对象，详细见common目录下的router.js
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 * 
 * 配置参数项说明： 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */
export default {
	index:{
		name:'首页',
		path:'/pages/index/index',
		requiresAuth:false
	},
	register:{
		name:'登记信息',
		path:'/pages/index/register/register',
		requiresAuth:true
	},
	write:{
		name:'添加信息',
		path:'/pages/index/register/write',
		requiresAuth:false
	},
	order:{
		name:'预约',
		path:'/pages/index/order/order',
		requiresAuth:true
	},
	nav:{
		name:'体检中心',
		path:'/pages/index/order/nav',
		requiresAuth:false
	},
	apply:{
		name:'申请提取',
		path:'/pages/index/apply/apply',
		requiresAuth:true
	},
	activity:{
		name:'活动',
		path:'/pages/index/activity/activity',
		requiresAuth:true
	},
	actDetail:{
		name:'活动详情',
		path:'/pages/index/activity/actDetail',
		requiresAuth:true
	},
	mine:{
		name:'我的',
		path:'/pages/mine/mine',

		requiresAuth:true
	},
	custom:{
		name:'客户信息',
		path:'/pages/mine/custom/custom',
		requiresAuth:false
	},
	record:{
		name:'缴费记录',
		path:'/pages/mine/custom/record',
		requiresAuth:false
	},
	friends:{
		name:'推荐好友',
		path:'/pages/mine/friends/friends',
		requiresAuth:false
	},
	system:{
		name:'系统消息',
		path:'/pages/mine/system',
		requiresAuth:false
	},
	waitpay:{
		name:'存储续费',
		path:'/pages/mine/waitpay',
		requiresAuth:false
	},
	personal:{
		name:'存储续费',
		path:'/pages/mine/personal',
		requiresAuth:false
	},
	login:{
		name:'登录',
		path:'/pages/login/login',
		requiresAuth:false
	},
	bindTel:{
		name:'绑定手机号',
		path:'/pages/login/bindTel',
		requiresAuth:false
	},
	agreement:{
		name:'协议',
		path:'/pages/index/agreement',
		requiresAuth:false
	}
}