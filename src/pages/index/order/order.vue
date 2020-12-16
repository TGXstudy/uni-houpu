<template>
	<view class="order">
		<view class="wrapper padding-25" v-if="list.length>0">
			<view class="detail f-column " v-for="(item,index) in list" :key="index" @click="select(index)">
				<view class="wrap_name f-align">
					<text class="name fn-sz-30 fn-bold fn-cl-333">{{item.name}}</text>
					<view class="inner fn-sz-22">{{item.age}}岁</view>
				</view>
				<view class="tel fn-sz-24 fn-cl-666">手机号码：{{item.mobile}}</view>
				<view class="id_card fn-sz-24 fn-cl-666">身份证号：{{item.id_code}}</view>
				<image class="chose" :src="item.selected?'../../../static/images/select.png':'../../../static/images/no_select.png'"  />
			</view>
			<!-- <NoMore :text="text" :visible="'true'"></NoMore> -->
		</view>	
		<view class="middle padding-25" v-if="list.length>0">
			<view class="wrap">
				<text class="tel">联系电话</text>
				<input type="number" v-model="tel" maxlength=11 placeholder="请输入电话" placeholder-style="color: #ccc;font-size: 30upx;">
			</view>
			<picker mode="date" :value="date" @change="bindDateChange">
				<view class="wrap" >					
					<text class="tel">预约提取日期</text>
					<view class="uni-input" :class="date=='日期选择'?'base':''">{{date}}</view>
					<image class="arrow" src="../../../static/images/arrow.png"></image>
				</view>
			</picker>
			<view class="wrap" @click="showPopup">
				<text class="tel">采血地点</text>
				<view class="address">{{name || '地址选择'}}</view>
				<!-- <input type="number" maxlength=11 placeholder="地址选择" placeholder-style="color: #ccc;font-size: 30upx;"> -->
				<image class="arrow" src="../../../static/images/arrow.png"></image>
			</view>
		</view>
		
		<view class="wrap padding-29" v-if="list.length>0">
			<view class="inner">
				<view class="txt fn-cl-333 fn-sz-36 fn-bold">15天内血常规检查报告</view>
				<view class="uplode flex">					
					<view class="img"  v-for="(item,index) in upload_img" :key="index" v-if="upload_img.length>0">
						<image :src="item.preview_url" mode="" />
						<image class="del" src="../../../static/images/del.png" mode="" @click="del(index)" />
					</view>
					<view class="img" @tap="takePhoto(1)">
						<image src="../../../static/images/upload.png" mode="" />
					</view>
					<!-- <view class="img">
						<image src="../../../static/images/upload.png" mode="" />
					</view> -->
				</view>
			</view>
		</view>
		<view class="wrap padding-29" v-if="list.length>0">
			<view class="inner">
				<view class="txt fn-cl-333 fn-sz-36 fn-bold">5天内传染四项检查报告</view>
				<view class="uplode flex">
					<view class="img"  v-for="(item,idx) in imgList" :key="idx" v-if="imgList.length>0">
						<image :src="item.preview_url" mode="" />
						<image class="del" src="../../../static/images/del.png" mode="" @click="del(idx)" />
					</view>
					<view class="img"  @tap="takePhoto(2)">
						<image src="../../../static/images/upload.png" mode="" />
					</view>					
				</view>
			</view>
		</view>
		<view class="footer" v-if="list.length>0">
			<image src="../../../static/images/btn_long.png" mode="" />
			<view class="txt fn-cl-fff fn-sz-30" @click="submit">提交</view>
		</view>
		<view v-if="list.length==0||list==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
		<popup ref="optPopup" :type="'bottom'" class="opt-popup">
			<view class="content" v-if="addressList.length>0">
				<view class="status">
					<view class="cancle" @click="cancle">取消</view>
					<view class="sure fn-cl-theme" @click="sure">确定</view>
				</view>
				<view class="inner" :class="index==current?'active':''" v-for="(item,index) in addressList" :key="index" @click="addSelect(item,index)">
					{{item.name}}
				</view>
			</view>
			<view v-if="addressList.length==0||addressList==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
		</popup>
	</view>
</template>

<script>
	//const Base64 = require('js-base64').Base64
	import {Base64} from 'js-base64'
	import NoMore from "@/components/common/NoMore.vue";
	import popup from "@/components/common/popup.vue";
	export default {
		data() {
			return {
				list: [], //采血预约列表
				page:1,
				limit:10,
				flag:true, //分页  是否进行下次请求
				tel:'',
				date: '日期选择',
				maxImageAmount: 3,
				upload_img:[], //血常规图片数组 
				base64_url:[], //血常规图片数组 
				imgList:[],		//传染四项图片数组
				addressList:[], //采血地点列表
				current:999, //当前选中的地址
				addDetail:{}, //选中地址信息
				name:''
			}
		},
		onShow(){
			uni.showLoading({
				title: '加载中'
			});
			this.getList();
			this.getAddress();
		},
		onReachBottom(){ //触底加载更多
			if(this.flag){
				this.getList();
			}else{
				console.log(3333);
			}
		},
		components:{
			NoMore,popup
		},
		methods: {
			getList(){ //获取预约列表信息
				let self = this;
				self.$api.subscribe({page:self.page,limit:self.limit}).then((res) => {
					if(res.code == 200){
						if(self.page>(res.data.total/self.limit)){
							self.flag = false
						}else{
							self.page++
						}
					}
					let list = res.data.data;
					if(list.length>0){
						list.forEach(item => {
							item.selected = false
						});
					}
					self.list = list
					console.log(self.list);
					uni.hideLoading();
				}).catch((err) => {
					console.log(err);
				});
			},
			getAddress(){ //获取采血地点列表
				this.$api.bloodAddress().then((res) => {
					console.log(res);
					if(res.code == 200){
						if(res.data){
							this.addressList = this.addressList.concat(res.data)
						}						
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			select(i){
				if(this.list[i].selected){
					this.list[i].selected = false
				}else{
					this.list[i].selected = true
				}
			},
			click(){
				this.$mUtils.goPage('index');
			},
			showPopup(){
				console.log(666);
				this.$refs.optPopup.open();
			},
			addSelect(i,j){
				this.current = j;
				this.addDetail = i
				this.name = i.name
			},
			cancle(){ //关闭弹层 删除选中的数据
				this.$refs.optPopup.close();
				this.name = '';
				this.addDetail = {};
			},
			sure(){ //
				this.$refs.optPopup.close();
			},
			urlTobase64(url,j){
				let base64_url = []
				uni.request({
				url: url,
				method:'GET',
				responseType: 'arraybuffer',
				success: ress => {
					let base64 = wx.arrayBufferToBase64(ress.data); //把arraybuffer转成base64 
					base64 = 'data:image/png;base64,' + base64 //不加上这串字符，在页面无法显示的哦
					// console.log(base64)
					// console.log(11111111111)
					base64_url.push(base64);
					let params = {base64:base64_url}
					this.$api.upload(params).then((res) => {
						console.log(res);
						if(res.code == 200){
							if(j == 1){
								this.upload_img = this.upload_img.concat(res.data)
							}
							if(j==2){
								this.imgList = this.imgList.concat(res.data)
								console.log(6666);
							}
							
						}else{
							this.$mUtils.toast(res.msg);
						}
						console.log(6666);
						console.log(this.upload_img);

					}).catch((err) => {
						console.log(err);
					});
					
				}
				})
			},
			takePhoto(j){
				uni.chooseImage({
					// count: 1,
					success: (res) => {	
						console.log(33333);
						console.log(res);
						console.log(res.tempFilePaths[0]);
						let imglist = res.tempFilePaths;
						imglist.forEach(item => {
							this.urlTobase64(item,j);
						});
																	
					},
				})				
			},
			del(i){ //图片删除
				console.log(i);
				console.log(6666);
				this.upload_img.splice(i,1)
			},
			bindDateChange: function(e) { //日期选择
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
			getSubscribe(params){ //预约接口
				this.$api.bloodSubscribe(params).then((res) => {
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
			submit(){ //
				let self = this
				let message_id = [];
				self.list.forEach(item => {
					if(item.selected){
						message_id.push(item.id)
					}
				});
				if(message_id.length == 0){
					self.$mUtils.toast('请选择预约人员')
					return
				}else if(self.tel==''){
					self.$mUtils.toast('请输入联系电话')
					return
				}else if(!self.$regs.isPhone.test(self.tel)){
					self.$mUtils.toast('请输入正确的手机号')
					return
				}else if(self.date == '日期选择'){
					self.$mUtils.toast('请输入预约时间')
					return
				}else if(self.name == ''){
					self.$mUtils.toast('请选择采血地点')
				}else if(self.upload_img.length==0&&self.imgList.length==0){
					self.$mUtils.toast('请传入体检图片')
					return
				}
				// let d =  new Date(self.date)
				// let t = d.getTime(d) //预约的时间戳
				// console.log(t);
				let idlist = message_id.toString();
				let address_id = self.addDetail.id;
				let img = self.upload_img.concat(self.imgList); //图片数据
				let imgArr = [];
				img.forEach(item => {
					imgArr.push(item.preview_url)
				});
				console.log(imgArr);
				let params = {
					message_id:idlist,
					mobile:self.tel,
					extract_time:self.date,
					address_id:address_id,
					img:imgArr.toString(),
				}
				console.log(params);
				self.getSubscribe(params)

			}
		}
	}
</script>

<style scoped lang="scss">
.order{
	width: 100%;
	 height: auto;
	background: #fff;
	font-family: PingFang SC;
	padding-bottom: 110upx;
	.wrapper{
		// background: #fff;
		margin-top: 16upx;
		.detail{
			// width: 100%;
			padding: 33upx 0 56upx 27upx;			
			box-shadow: 1px 5px 26px 0px #EDF2F1;
			border-radius: 10px;
			position: relative;
			background: #fff;
			.wrap_name{
				margin-bottom: 42upx;
				.name{margin-right: 24upx;}
				.inner{
					background: rgba(69,196,162,0.2);
					border-radius:15upx;
					color: #45C4A2;
					height: 30upx;
					width: 67upx;
					text-align: center;
				}
			}
			.tel{
				margin-bottom: 24upx;
			}
			.chose{
				width: 30upx;
				height: 30upx;
				position: absolute;
				right: 50upx;
				top: 120upx;
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
			.address{
				font-size: 30upx;
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
		.wrap:nth-child(3){
			border: none;
		}
	}
	.divide{
		width: 100%;
		height: 20upx;
		background: #f6f6f6;
	}
	.wrap{
		width: 100%;
		background: #fff;
		.inner{
			padding-top: 39upx;
			// padding-bottom: 37upx;
			margin-bottom: 20upx;
			.txt{
			margin-bottom: 48upx;
			}
			.uplode{
				display: flex;
				flex-wrap: wrap;
				.img{
					width: 200upx;
					height: 201upx;
					margin-right: 26upx;
					position: relative;
					margin-bottom: 10upx;
					image{
						width: 200upx;
						height: 201upx;
					}
					.del{
						width: 30upx;
						height: 30upx;
						position: absolute;
						top: 0;
						right: 0;
					}
				}
				.img:last-child{
					margin-right: 0;
				}
			}
		}	
	}
	.wrap:nth-child(1) .inner{
		border-top: 1upx solid #E5E5E5;
	}
	.footer{
	  width: 100%;
	  padding: 10upx 3%;
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  background: #fff;
	  image{
		  width: 695upx;
		  height: 88upx;
	  }
	  .txt{
		  position: absolute;
		  bottom: 40upx;
		  left: 44%;
	  }
  }
  .opt-popup{
	  .content{
		  padding: 30upx 10upx;
		  .status{
			  display: flex;
			  justify-content: space-between;
			  box-sizing: border-box;
			  padding: 0 40upx;
			  margin-bottom: 20upx;
		  }
		  .inner{
			  text-align: center;
			  margin-bottom: 20upx;
		  }
		  .active{
			  background: #999;
			  color: #fff;
		  }
	  }
  }
}
</style>
