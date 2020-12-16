<template>
	<view class="system">
		<view v-if="list.length==0||list==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
		<view class="content padding-25" v-else v-for="(item,index) in list" :key="index">
			<view class="msg_item">
				<view class="time fn-sz-24 fn-cl-999">{{item.create_time}}</view>
				<view class="txt fn-sz-30 fn-cl-333">{{item.content}}</view>
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
				flag:true, //是否多次加载
				page:1,
				limit:10
			}
		},
		components:{
			noMore
		},
		onLoad(){
			this.getSystemMessage()
		},
		onReachBottom(){ //触底加载更多
			if(this.flag){
				this.getSystemMessage();
			}else{
				console.log(3333);
			}
		},
		methods: {
			getSystemMessage(){
				let self = this;
				self.$api.systemMessage({
					page:self.page,
					limit:self.limit
				}).then((res) => {
					console.log(res);
					if(res.code == 200){
						if(self.page>res.data.total/self.limit){
							console.log(666);
							self.flag = false
						}else{
							console.log(777);
							self.page++
						}
					};
					self.list = self.list.concat(res.data.data)
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	}
</script >

<style scoped lang="scss">
.system{
	width: 100%;
	height: 100%;
	background: #fff;
	font-family: PingFang SC;
	.content{
		width: 100%;
		.msg_item{
			box-sizing: border-box;
			padding: 51upx 26upx 66upx 27upx;
			background: #FFFFFF;
			box-shadow: 1upx 5upx 26upx 0upx #EDF2F1;
			border-radius: 10upx;
			margin-top: 27upx;
			.time{
				margin-bottom: 23upx;
			}
		}
	}
}

</style>
