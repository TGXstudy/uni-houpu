<template>
	<view class="record padding-25">
		<view class="wrapbox" v-if="list.length>0">
			<view class="content" v-for="(item,index) in list" :key="index">
				<view class="money">
					<text>{{item.type}}</text>
					<text>￥{{item.money}}</text>
				</view>
				<view class="date">
					缴费日期：{{item.create_time}}
				</view>
			</view>
		</view>
		<view v-if="list.length==0||list==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
		<no-more :visible="!flag"></no-more>
	</view>
</template>

<script>
	import noMore from "@/components/common/NoMore.vue";
	export default {
		data() {
			return {
				list:[], //获取的数据列表
				id:'',
				flag:true, //是否加载更多数据
				page:1,
				limit:10
			}
		},
		components:{
			noMore
		},
		onLoad(options){
			console.log(options);
			this.id = options.id;
			this.getMessageLog()
		},
		onReachBottom(){ //触底加载更多
			if(this.flag){
				this.getMessageLog(params)
			}
		},
		methods: {
			getMessageLog(){
				this.$api.messageLog({
					page:this.page,
					limit:this.limit,
					id:this.id
				}).then((res) => {
					console.log(res);
					if(res.code == 200){
						if(this.page>(res.data.total/this.limit)){
							this.flag = false
						}else{
							this.page++
						}
						if(res.data.data.length>0){
							this.list = this.list.concat(res.data.data)
						}						
					}
					
				}).catch((err) => {
					console.log(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">
.record {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: PingFang SC;
  padding-top: 10upx;
  .content{
	  box-sizing: border-box;
	  padding: 60upx 25upx 60upx 25upx;	  
	  box-shadow: 1upx 5upx 26upx 0upx #EDF2F1;
	  border-radius: 10upx;
	  margin-bottom: 26upx;
	  .money{
		  display: flex;
		  justify-content: space-between;
		  margin-bottom: 13upx;
		  text{
			  font-size: 30upx;
			  color: #333;
		  }
	  }
	  .date{
		  font-size: 22upx;
		  color: #999;
	  }
  }
}

</style>
