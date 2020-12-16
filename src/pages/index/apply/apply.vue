<template>
	<view class="apply padding-25">
		<view class="wrapbox" v-if="list.length>0">		
			<view class="detail f-column" v-for="(item,index) in list" :key="index" @click="select(index)">
				<view class="wrap_name f-align">
					<text class="name fn-sz-30 fn-bold fn-cl-333">{{item.name}}</text>
					<view class="inner fn-sz-22">{{item.age}}岁</view>
					<view class="number fn-sz-24 fn-cl-theme">编号{{item.identifier}}</view>
				</view>
				<view class="id_card fn-sz-24 fn-cl-666">身份证号：{{item.id_code}}</view>
				<view class="endtime fn-sz-24 fn-cl-666">储存时间{{item.storage_time}}</view>
				<view class="icon p-absolute" >
					<image :src="item.selected? '../../../static/images/select.png': '../../../static/images/no_select.png'"/>
				</view>
			</view>	
			<view class="middle">
				<view class="wrap">
					<text class="tel">联系电话</text>
					<input type="number" maxlength=11 v-model="tel" placeholder="请输入电话" placeholder-style="color: #ccc;font-size: 30upx;">
				</view>
				<picker mode="date" :value="date" @change="bindDateChange">
					<view class="wrap" >
						<!-- <text class="tel">预约提取日期</text>
						<input type="number" maxlength=11 placeholder="日期选择" placeholder-style="color: #ccc;font-size: 30upx;">
						<image class="arrow" src="../../../static/images/arrow.png"></image> -->					
						<text class="tel">预约提取日期</text>
						<view class="uni-input" :class="date=='日期选择'?'base':''">{{date}}</view>
						<image class="arrow" src="../../../static/images/arrow.png"></image>
					</view>
				</picker>
				<view class="_wrap">
					<view class="methods">预约提取方式</view>
					<view class="chose">
						<view class="item" :class="current == index?'active':''" v-for="(item,index) in menus" :key="index" @tap="current=index">
							{{item.txt}}
							<image v-if="current == index" src="../../../static/images/chose.png" mode="" />
						</view>
					</view>
				</view>
			</view>
			<view class="footer">
				<theme-button :btn-txt="'提交'" @tap-btn="submit"></theme-button>
			</view>
		</view>
		<view v-if="list.length==0||list==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
	</view>
</template>

<script>
	import themeButton from "@/components/common/ThemeButton.vue";
	export default {
		data() {			
			return {
				list:[],
				storage_status:0,
				menus:[
					{id:1,txt:'快递寄送'},
					{id:2,txt:'自提自取'},
					{id:3,txt:'复苏应用'}
				],
				current:0, //默认选中
				date: '日期选择',
				tel:'',
				page:1,
				limit:10,
				flag:true, //记录是否请求数据的状态
				status:'loadmore'

			}
		},
		onShow(){
			this.getList()
		},
		methods: {
			getList(){ //获取列表数据
				let self = this;
				self.$api.extract({page:self.page,limit:10}).then((res) => {
					console.log(666);
					console.log(res);
					if(self.page>(res.data.total/self.limit)){
						self.flag = false;
					}else{
						self.page++
					}
					let arr = res.data.data;
					if(arr.length>0){
						arr.forEach(item => {
							item.selected = false
						});
						self.list = self.list.concat(arr)
						console.log(self.list);
					}
				}).catch((err) => {
					console.log(err);
				});

			},
			bindDateChange: function(e) {
				console.log(e);
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			select(i){
				if(this.list[i].selected){
					this.list[i].selected = false
				}else{
					this.list[i].selected = true
				}
			},
			getExtract(params){ //申请提取
				this.$api.messageExtract(params).then((res) => {
					console.log(res);
					if(res.code == 200){
						this.$mUtils.toast(res.msg)
						setTimeout(() => {
							this.$mUtils.goPage('index')
						}, 400);
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			submit(){ //提交
				let self = this;
				let message_id =[];
				self.list.forEach(item => {
					if(item.selected){
						message_id.push(item.id)
					}
				});
				if(message_id.length == 0){
					self.$mUtils.toast('请选择提取人员')
					return
				}else if(self.tel==''){
					self.$mUtils.toast('请输入联系电话')
					return
				}else if(!self.$regs.isPhone.test(self.tel)){
					self.$mUtils.toast('请输入正确的手机号')
					return
				}else if(self.date == '日期选择'){
					self.$mUtils.toast('请选择提取日期')
					return
				}
				console.log(6666);
				let idlist = message_id.toString();
				// let d =  new Date(self.date)
				// let t = d.getTime(d) //预约的时间戳
				let params = {
					message_id:idlist,
					mobile:self.tel,
					extract_time:self.date,
					type:(self.current+1).toString()
				}
				console.log(params);
				self.getExtract(params)
			}
		},
		onReachBottom: function() {
			if(this.flag){				
				this.getList()
			}
		},
		components:{
			themeButton
		}
	}
</script>

<style scoped lang="scss">
	.apply{
		background: #fff;
		font-family: PingFang SC;
		width: 100%;
		padding-bottom: 120upx;
		// padding-bottom: 28upx;
		overflow: hidden;
		.detail {
			box-sizing: border-box;
			padding: 33upx 23upx 56upx 110upx;
			background: #ffffff;
			box-shadow: 1upx 5upx 26upx 0upx #edf2f1;
			border-radius: 10upx;
			margin-top: 20upx;
			margin-bottom: 10upx;
			position: relative;
			.wrap_name {
				margin-bottom: 42upx;
				.name {
				margin-right: 24upx;
				}
				.inner {
				background: rgba(69, 196, 162, 0.2);
				border-radius: 15upx;
				color: #45c4a2;
				height: 30upx;
				width: 67upx;
				text-align: center;
				}
				.number {
				flex-grow: 1;
				text-align: right;
				}
			}
			.tel {
				margin-bottom: 24upx;
			}
			.id_card {
				margin-bottom: 20upx;
			}
			.icon {
				width: 30upx;
				height: 30upx;
				left: 30upx;
				top: 110upx;
				image {
				width: 30upx;
				height: 30upx;
				}
			}
		}
		.middle{
			background: #fff;
			.wrap{
				width: 100%;
				padding: 41upx 0;
				display: flex;
				// justify-content: space-between;
				align-items: center;
				border-bottom:1px solid #eee ;
				.tel{
					font-size: 30upx;
					color: #333;
					flex-grow: 1;
				}
				input{
					text-align: right;
					margin-right: 16upx;
				}
				.arrow{
					width: 16upx;
					height: 24upx;
				}
				.uni-input{
					margin-right: 20upx;
				}
				.base{
					font-size: 30upx;
					color: #ccc;
				}
			}
			._wrap{
				padding-top: 52upx;
				.methods{
					font-size: 30upx;
					color: #333;
					margin-bottom: 44upx;					
				}

			}
			.chose{
				display: flex;
				.item{
					width: 173upx;
					height: 80upx;
					line-height: 80upx;
					background: #F1FCF9;
					border-radius: 8upx;
					text-align: center;
					font-size: 30upx;
					color: #45C4A2;
					position: relative;
					margin-right: 20upx;
					border: 1px solid #52CCA5;
					image{
						width: 33upx;
						height: 23upx;
						position: absolute;
						top: 0;
						right: 0;
					}
				}
				.active{
					background: #52CCA5;
					color: #fff;
				}
			}
		}
		.footer{
			width: 94%;
			position: fixed;
			bottom: 10upx;
			left: 3%;
		}
	}

</style>
