import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const hasLogin = uni.getStorageSync("hasLogin") || false;
const auth = uni.getStorageSync("auth") || ""
const store = new Vuex.Store({
	state: {
		hasLogin:hasLogin,
		auth:auth,
		showPopup:false,
		isIpx: false,
	},
	getters: {
		getAuth(state){
			return state.hasLogin;
		},
	},
	mutations: {
		SET_AUTH(state,auth){
			state.auth = auth;
			uni.setStorageSync("auth", auth)
		}, 
		SET_HASLOGIN(state){
			state.hasLogin = true
		},
		SET_TOKEN(state,token){
			state.auth = token
		},
		CHANGE(state){
			state.showPopup = true
		},
		IS_IPX(state){
			state.isIpx = true
		}

	},
	actions: {
		/* setAuth({
			commit
		},auth) {
			commit("SET_AUTH", auth);
		}, */
		
	}
})

export default store
