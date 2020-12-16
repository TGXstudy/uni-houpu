<template>
	<view class="activity padding-25">
		<view class="item padding-27 flex" v-for="(v,index) in list" :key="index" @click="toPath('actDetail',v.id)">
			<view class="left">
				<view class="title fn-sz-32 fn-cl-333 fn-bold">{{v.name||'成都干细胞储存再生医学产业化在亟需中“耐心等待”'}}</view>
				<text class="content one-line-txt fn-sz-26 fn-cl-999">{{v.describe||'创面数十年难以愈合、长年被严重的...溃疡和感染所困扰、丧失基本的行动能力'}}</text>
				<view class="time flex">
					<text>阅读{{v.hits}}</text>
					<text>{{v.create_time}}</text>
				</view>
			</view>
			<view class="right">
				<image :src="v.img?v.img:'../../../static/images/act.png'" mode="" />
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
				flag:true, //分页标致
				page:1,
				limit:10
			}
		},
		components:{
			noMore
		},
		async onLoad(){
			let self = this;
			await self.getData();
		},
		onReachBottom(){ //触底加载更多
			if(this.flag){
				this.getSystemMessage();
			}else{
				console.log(3333);
			}
		},
		methods: {
			//获取活动数据
			async getData(){
				try {
					let res = await this.$api.activityList({page:this.page,limit:this.limit})
						console.log(res);
					if(res.code == 200){
						if(this.page>res.data.total/this.limit){
							this.flag = false
						}else{
							this.page++
						}
						if(res.data.data.length>0){
							this.list = this.list.concat(res.data.data)
						}
					}else{
						console.log(res.msg);
					}
				} catch (error) {
					console.log(error);
				}				

			},
			toPath(i,j) {
				//console.log(this.$mUtils.goPage);  
				// console.log(i);
				this.$mRouter.push({
					route: this.$mRoutesConfig[i],
					query:{id:j}
				});
				//   console.log(this.$mRoutesConfig);
			},
		}
	}
</script>

<style scoped lang="scss">
.activity{
	width: 100%;
	// height: 100%;
	background: #fff;
	font-family: PingFang SC;
	overflow: hidden;
	.item{
		margin-top: 10upx;
		width: 100%;
		padding: 0 27upx;
		padding-top: 35upx;
		box-sizing: border-box;		
		box-shadow: 1upx 5upx 26upx 0upx #EDF2F1;
		border-radius: 10upx;
		.left{
			margin-top: 6upx;
			margin-right: 23upx;
			flex-grow: 1;
			.title{
				margin-bottom: 26upx;
			}
			.content{
				margin-bottom: 67upx;
			}
			.time{
				// justify-content: space-around;
				margin-bottom: 36upx;
				text{
					font-size: 22upx;
					color: #aaa;
				}
				text:nth-child(1){
					flex-grow: 1;
				}
			}
		}
		.right{
			width: 180upx;
			height: 180upx;
			image{
				width: 180upx;
				height: 180upx;
			}
		}
	}
}

</style>
