const CONFIG = {
	//开发环境配置
	development: {
		copyrightTxt: "", // 版本信息
		// process.env.VUE_APP_PLATFORM == "h5" ? "/shop" : 'https://shopbase.wsyjcs.cn/api/shop'
		baseUrl: process.env.VUE_APP_PLATFORM == "h5" ? "https://houpu.batmp.com" : 'https://houpu.batmp.com',
		imgUrl: "https://houpu.batmp.com/web",
		tokenKey: "WECHAT_TRADE", // 登录标识
		appId: "wx27eeee98bfdf9b27",
		testOpenId: "oEjRxwy7jL9PgG0kWeb4VcDTZEas", // 小程序测试openId
		forcedLogin: false, // touristMode游客模式下APP是否强制用户登录 场景：当用户进入登录页面后无法后退。
		touristMode: true, // APP是否开启游客模式， 游客模式true开启：APP打开后可以进入首页和无权限的页面，游客模式false关闭：APP打开后首先需要登录才能进入， 此时forcedLogin配置项失效。
	},

	//测试环境配置
	alpha: {
		copyrightTxt: "", // 版本信息
		baseUrl: "http://houpu.batmp.com",
		imgUrl: "http://houpu.batmp.com",
		tokenKey: "WECHAT_TRADE", // 登录标识
		testOpenId: "oEjRxwy7jL9PgG0kWeb4VcDTZEas", // 小程序测试openId
		appId: "wx27eeee98bfdf9b27",
		forcedLogin: false, // touristMode游客模式下APP是否强制用户登录 场景：当用户进入登录页面后无法后退。
		touristMode: true, // APP是否开启游客模式， 游客模式true开启：APP打开后可以进入首页和无权限的页面，游客模式false关闭：APP打开后首先需要登录才能进入， 此时forcedLogin配置项失效。
	},

	//生产环境配置
	production: {
		copyrightTxt: "", // 版本信息
		baseUrl: "https://houpu.batmp.com",
		imgUrl: "https://houpu.batmp.com/web",
		tokenKey: "WECHAT_TRADE", // 登录标识
		testOpenId: "oEjRxwy7jL9PgG0kWeb4VcDTZEas", // 小程序测试openId
		appId: "wx27eeee98bfdf9b27",
		forcedLogin: false, // touristMode游客模式下APP是否强制用户登录 场景：当用户进入登录页面后无法后退。
		touristMode: true, // APP是否开启游客模式， 游客模式true开启：APP打开后可以进入首页和无权限的页面，游客模式false关闭：APP打开后首先需要登录才能进入， 此时forcedLogin配置项失效。
	}

}
export default CONFIG[process.env.NODE_ENV];
