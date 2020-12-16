<template>
	<view class="friends ">
		<view class="friendsList padding-25">
			<view v-if="list.length==0||list==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
			<view class="detail" v-else v-for="(item,index) in list" :key="index">
				<view class="up flex j-between">
					<text class="name fn-sz-30 fn-bold fn-cl-333">{{item.user_nickname}}</text>
					<text class="price fn-sz-30 fn-bold fn-cl-333">￥{{item.money}}</text>
				</view>
				<view class="down flex j-between">
					<text class="time fn-sz-22 fn-cl-999">消费日期：{{item.pay_time}}</text>
					<text class="cost fn-sz-22 fn-cl-999">奖励金额</text>
				</view>
			</view>
		</view>
		<no-more :visible="!flag"></no-more>
	</view>
</template>

<script>
	import noMore from "@/components/common/NoMore.vue";	
	export default {
		data() {
			return {
				list:[],
				flag:true,            //记录是否请求数据的状态
				limit:10,//每页条数
				page:1,//当前页
			}
		},
		components:{
			noMore
		},
		onLoad(){
			this.getData();
		},
		methods: {
			getData(){
				let self = this;
				self.$api.recommendFriends({
					limit:self.limit,
					page:self.page
				}).then(res=>{
					console.log("测试",res)
					if(res.code == 200){
						if(self.page>(res.data.total/self.limit)){
							self.flag = false
						}else{
							self.page++
						}
						if(res.data.data.length>0){
							self.list = self.list.concat(res.data.data);
						}						
					}else{
						self.$mUtils.toast(res.msg)
					}
				})
			},
		},
		//触底分页
		onReachBottom: function() {
			if(this.flag){
				this.getData();
			}
		},
	}
</script>

<style scoped lang="scss">
.friends{
  width: 100%;
  height: 100%;
  font-family: PingFang SC;	
  .friendsList{
	  width: 100%;
	  overflow: hidden;
	  .detail{
		  box-sizing: border-box;
		  padding: 44upx 23upx 47upx 29upx;
		  background: #FFFFFF;
		  box-shadow: 1upx 5upx 26upx 0upx #EDF2F1;
		  border-radius: 10upx;
		  margin-top: 26upx;
		  .up{

			  margin-bottom: 13upx;
		  }
	  }
  }
}

</style>
