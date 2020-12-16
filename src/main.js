import Vue from 'vue'
import App from './App'
import Config from 'config/index.config.js'
import Router from "common/js/router.js"
import $mReg from 'common/js/reg.js'
import RouteConfig from "config/routes.config.js"
import Utils from "common/js/utils.js"
import compute from "common/js/compute.js"
import Store from 'store/index.js'
import API from "api/index.js"; 
import * as filters from "filters/index.js"
import uView from "uview-ui";
Vue.config.productionTip = false
Vue.use(uView);

Vue.prototype.$mRouter=Router;
Vue.prototype.$mRoutesConfig=RouteConfig;
Vue.prototype.$mUtils=Utils;
Vue.prototype.$regs = $mReg
Vue.prototype.$store=Store;
Vue.prototype.$api=API;



Object.keys(filters).forEach(key=>{
	Vue.filter(key,filters[key])
})

App.mpType = 'app'
// console.log("ConfigConfigConfig",Config,process.env.NODE_ENV,process.env)
Router.beforeEach((navType, to) => {
	
	console.log(Store);
	// console.log("路由守卫",navType, to,)
	if (to.route === undefined) throw ("路由钩子函数中没有找到to.route对象，路由信息:" + JSON.stringify(to));

	// 过滤需要权限的页面
	if (to.route.requiresAuth) {
		console.log("过滤需要权限的页面");
		// console.log(Store.getters.getAuth);
		if (Store.getters.getAuth) {
			
			console.log("已经登录");
			// 已经登录
			uni[navType]({
				url: Utils.objParseUrlAndParam(to.route.path, to.query)
			})
		} else {
			// 登录成功后的重定向地址和参数objParseParam
		console.log(to.query)
			let query = {
				redirectUrl: to.route.path,
				query:JSON.stringify(to.query)
			}
			
			console.log("没有登录,登录成功后的重定向地址和参数",RouteConfig.login.path,query);
			uni.navigateTo({
				url: Utils.objParseUrlAndParam(RouteConfig.login.path, query)
			})
			
		}
	} else {
		uni[navType]({
			url: Utils.objParseUrlAndParam(to.route.path, to.query)
		})
	}
})

const app = new Vue({
    ...App
})
import goPage from "@/common/js/goPage.js"

Vue.use(goPage, app)

app.$mount()
