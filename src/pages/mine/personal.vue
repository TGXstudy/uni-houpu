<template>
	<view class="personal">
		<view class="my padding-25">
			<view class="photo flex">
				<text class="fn-cl-333 fn-sz-30">头像</text>
				<view class="icon">
					<image class="img" :src="user.avatar?user.avatar:'../../static/images/photo.png'" mode="" />
				</view>
				<!-- <image class="arrow" src="../../static/images/arrow.png" mode="" /> -->
			</view>
			<view class="photo flex">
				<text class="fn-cl-333 fn-sz-30">昵称</text>
				<view class="name fn-cl-ccc fn-sz-30">{{user.user_nickname}}</view>
				<!-- <image class="arrow" src="../../static/images/arrow.png" mode="" /> -->
			</view>
			<view class="photo flex">
				<text class="fn-cl-333 fn-sz-30">推荐人</text>
				<input class="name fn-cl-333 fn-sz-30"  type="text" v-model="value" placeholder="请输入推荐人" placeholder-style="color: #ccc;font-size: 30upx;" :disabled="disabled" />
				<!-- <view class="name fn-cl-ccc fn-sz-30">{{user.recommender||''}}</view> -->
			</view>
		</view>
		<view class="footer" @tap="keep">
			<image src="../../static/images/btn_long.png" mode="" />
			<view class="txt fn-cl-fff fn-sz-30" >保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user:'',
				value:'',
				disabled: false, //是否禁用
				flag:true
			}
		},
		onShow(){
			this.getUserMsg()
		},
		methods: {
			getUserMsg(){
				this.$api.userInfo().then((res) => {
					console.log(res);
					if(res.code == 200){
						this.user = res.data
						if(res.data.recommender){
							this.value = res.data.recommender;
							this.disabled = true
							this.flag = false
						}
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			
			keep(){
				if(this.value == ''){
					this.$mUtils.toast('请输入推荐码')
					return
				}else if(!this.flag){
					this.$mUtils.toast('推荐人不能更改')
					return
				}
				this.$api.editInviteCode({invite:this.value}).then((res) => {
					console.log(res);
					if(res.code == 200){
						this.$mUtils.toast(res.msg)
						setTimeout(() => {
							this.$mUtils.goPage('mine')
						}, 400);
					}else{
						this.$mUtils.toast(res.msg)
						this.value = ''
					}
				}).catch((err) => {
					console.log(err);
				});
			},
		}
	}
</script>

<style scoped lang="scss">
.personal{
  width: 100%;
  height: 100%;
  background: #F6F6F6;
  font-family: PingFang SC;
  .my{
	  width: 100%;
	  background: #fff;
	  .photo{
		  padding: 48upx 0 41upx 0;
		  align-items: center;
		  text{
			  flex-grow: 1;
		  }
		  .icon{
			  width: 120upx;
			  height: 120upx;
			  margin-right: 19upx;
			  .img{
				  width: 120upx;
				  height: 120upx;
				  border-radius: 50%;
			  }
		  }
		  .name{
			  margin-right: 19upx;
			  text-align: right;
		  }
		  .arrow{
			  width: 16upx;
			  height: 24upx;
		  }

	  }
	  	.photo:nth-child(2) .arrow{
			  margin-top: 10upx;
		  }
  }
  .my .photo:nth-child(n+2){
	  border-top: 2upx solid #e5e5e5;
  }
  .footer{
	  width: 94%;
	  margin-left: 3%;
	  margin-top: 72upx;
	  position: relative;
	  image{
		  width: 695upx;
		  height: 88upx;
	  }
	  .txt{
		  position: absolute;
		  bottom: 30upx;
		  left: 44%;
	  }
  }
}
</style>
