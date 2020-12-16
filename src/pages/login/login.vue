<template>
	<!-- 登录 -->
	<view class="container">
		<view class="name fn-sz-30">厚浦科技申请</view>
		<view class="fn-sz-30">获取你的昵称、头像、地区及性别</view>
		<button class="login-btn fn-sz-30 fn-cl-fff" open-type="getUserInfo" @click="doLogin">登录</button>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				code:''
			}
		},
		onLoad() {
			console.log(this.$store.getters.getToken)
			this.code = this.getQueryString("code")
			console.log(9999);
			console.log(this.code);
			console.log(window.location.href);
			if(!this.code){
				window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx27eeee98bfdf9b27&redirect_uri=https://houpu.batmp.com/web/&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
				return
			}else{
				this.handleLogin({code:this.code})
			}
		},
		//微信授权登录 wxlogin
		methods: {
			doLogin() {
				// this.$mRouter.push({
				// 	route: this.$mRoutesConfig.custom,
				// })
				// return
				this.handleLogin({data:this.code})
			},
			getQueryString (name) { //获取url参数
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return unescape(r[2]);
				}
				return null;
			},
			//授权登录接口
			handleLogin(data){
				this.$api.login(data).then(res=>{
					console.log("授权登录接口",res)
					if(res.code == 200){
						console.log(res);
						let token = res.data
						 this.$store.commit("SET_TOKEN",token)
						 this.$store.commit("SET_HASLOGIN")
						//console.log(this.$store.getters.getToken)
						uni.setStorageSync('hasLogin', true)	
						uni.setStorageSync('auth', token)
						//this.checkTel();
						//获取用户信息 childCode 
						this.getUserInfo()
						
					}else{
						this.$mUtils.toast(res.msg)
					}
				})
			},
			//是否绑定了手机号 
			checkTel(){
				this.$api.checkTel().then(res=>{
					console.log("是否绑定了手机号",res)
					if(res.code == 200){
						this.$mRouter.back()
					}else if(res.code == 210){
						this.$mRouter.redirectTo({
							route:this.$mRoutesConfig.bindTel
						})
					}else{
						this.$mUtils.toast(res.msg)
					}
				})
			},
			//获取用户信息 childCode  
			getUserInfo(){
				console.log(this.$store);
				this.$api.userInfo().then(res=>{
					console.log(res);
					if(res.code == 200){
						// this.$store.commit("SET_CHILDCODE",res.data.child_code);
						// this.$store.commit("SET_USERINFO",res.data);
						if(!res.data.mobile){
							this.$mRouter.redirectTo({
								route:this.$mRoutesConfig.bindTel
							})
						}else{
							this.$mRouter.redirectTo({
								route:this.$mRoutesConfig.index
							})							
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.name{
			margin-bottom: 20upx;
		}
		.login-btn {
			margin-top: 40upx;
			//#ifdef MP-WEIXIN
			background-color: #45C4A2;
			//#endif
			//#ifdef H5
			background-color: #45C4A2;
			//#endif
			width: 560upx;
			height: 80upx;
			line-height: 80upx;
			border-radius: 40upx;

		}
	}
</style>
