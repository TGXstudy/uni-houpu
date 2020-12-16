<template>
	<view class="custom">
		<tab-box :tabs="tabs" :init-tab="theTab" :is-black="true" @change-tab="changeTab"></tab-box>
		<view class="content padding-25">
			<!-- <scroll-view scroll-y enable-back-to-top style='height:{{windowHeight}}px;' bindscrolltolower="loadMore"> -->
			<view v-if="msgList.length==0||msgList==''" style="text-align:center;color:#666;margin-top:20px;">暂无数据~</view>
			<view class="detail f-column" v-else v-for="(msg,index) in msgList" :key="index" @click="toPath(msg.id,1)">
				<view class="wrap_name f-align">
					<text class="name fn-sz-30 fn-bold fn-cl-333">{{msg.name}}</text>
					<view class="inner fn-sz-22">{{msg.age}}岁</view>
					<view class="number fn-sz-24 fn-cl-theme">编号{{msg.identifier}}</view>
				</view>
				<view class="tel fn-sz-24 fn-cl-666">手机号码：{{msg.mobile}}</view>
				<view class="tel fn-sz-24 fn-cl-666">身份证号：{{msg.id_code}}</view>
				<view class="id_card fn-sz-24 fn-cl-666">到期时间：{{msg.storage_time}}</view>
				<picker v-if="theTab==1" :class="msg.extract_status==0?'ljxf':'ljxf2'" @tap.stop="cz" :disabled="msg.extract_status==0?false:true" @change="bindPickerChange($event,array,msg.id,msg.extract_status)"
				 :value="index" :range="array" :range-key="'year'">立即续费</picker>
				<view class="status" v-if="msg.storage_status==0&&theTab==1">
					<image src="../../../static/images/normal.png" mode="" />
					<text class="fn-sz-24 fn-cl-fff">存储正常</text>
				</view>
				<view class="status" v-if="msg.storage_status==1&&theTab==1">
					<image src="../../../static/images/abnormal.png" mode="" />
					<text class="fn-sz-24 fn-cl-fff">存储异常</text>
				</view>
				<view class="status" v-if="msg.storage_status==2&&theTab==1">
					<image src="../../../static/images/normal.png" mode="" />
					<text class="fn-sz-24 fn-cl-fff">已提取</text>
				</view>
			</view>
			<!-- </scroll-view> -->
		</view>
		<no-more :visible="!flag"></no-more>
	</view>
</template>

<script>
	import tabBox from "@/components/index/TabBox.vue";
	import noMore from "@/components/common/NoMore.vue";
	import jpSelect from '@/components/jp-select/jp-select.vue';
	export default {
		components: {
			jpSelect
		},
		data() {
			return {
				index: 0,
				array: [],
				flag: true, //记录是否请求数据的状态
				limit: 10, //每页条数
				page: 1, //当前页
				tabs: [{
						id: 1,
						txt: "客户信息",
						value: "in",
					},
					{
						id: 2,
						txt: "缴费记录",
						value: "out",
					},
				],
				theTab: 1,
				id: '',
				msgList: [],
				custom: [],
				pickerData: {}, //选择时间
			};
		},
		onLoad() {
			this.getUserList();
			this.getyear();
		},
		//触底分页
		onReachBottom: function() {
			if (this.flag) {
				if (this.theTab == 1) {
					this.getUserList();
				} else {
					this.getData();
				}
			}
		},
		methods: {
			//调取微信支付接口
			onBridgeReady(data) {
				let self = this;
				WeixinJSBridge.invoke(
					"getBrandWCPayRequest", {
						appId: data.appid,
						timeStamp: data.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: data.nonce_str, // 支付签名随机串，不长于 32 位
						package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
						signType: data.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: data.sign, // 支付签名
					},
					function(res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							self.$mUtils.toast('支付成功！');
							setTimeout(() => {
								self.$mUtils.goPage('index');
							}, 400);
						} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
							self.$mUtils.toast('支付失败！');
						}
					}
				)
			},
			cz() {
				//console.log(222)
			},
			bindPickerChange: function(e, storage, id, extract_status) {
				if (extract_status == 1) {
					return
				} else if (extract_status == 0) {
					console.log(id, '11')
					// console.log(storage,'2222')
					this.index = e.target.value
					this.pickerData = storage[this.index] // 这里就是选中的对象
					console.log(storage[this.index])
					let newnear = (this.pickerData.year).slice(0, 1);
					console.log(newnear)
					this.$api.messagePost({
						id: id,
						type: '2',
						year: newnear,
						discount: this.pickerData.discount
					}).then(res => {
						if (res.code == 200) {
							this.onBridgeReady(res.data);
						} else {
							this.$mUtils.toast(res.msg);
						}
					})
				}

			},
			changeTab(tab) {
				this.theTab = tab.id;
			},
			//获取客户信息
			getUserList() {
				let self = this;
				self.$api.customerList({
					page: self.page,
					limit: self.limit
				}).then((res) => {
					console.log(res);
					if (self.page > (res.data.total / self.limit)) {
						self.flag = false;
					} else {
						self.page++;
					}
					let list = self.msgList.concat(res.data.data);
					
					// console.log(list);
					//为下一页的请求参数做准备
					self.msgList = list;
					self.id = list[0].user_id
				}).catch((err) => {
					console.log(err);
				});
			},

			//获取年限
			getyear() {
				this.$api.getYear().then(res => {
					this.array = res.data
					for (const value of this.array) {
						value.year = value.year + '年'
					}
					console.log(this.array)
				})
			},
			toPath(i, j) { //编辑信息
				if (this.theTab == 1) {
					this.$mUtils.goPage('write', {
						id: i,
						j: j
					})
				} else {
					this.$mUtils.goPage('record', {
						id: i
					})
				}
			},

		},
		components: {
			tabBox,
			noMore
		},
	};
</script>

<style lang="scss" scoped>
	.custom {
		width: 100%;
		height: 100%;
		font-family: PingFang SC;

		.content {
			margin-top: 41upx;

			.detail {
				box-sizing: border-box;
				padding: 33upx 23upx 56upx 27upx;
				background: #FFFFFF;
				box-shadow: 1upx 5upx 26upx 0upx #EDF2F1;
				border-radius: 10upx;
				margin-bottom: 30upx;
				position: relative;

				.wrap_name {
					margin-bottom: 42upx;

					.name {
						margin-right: 24upx;
					}

					.inner {
						background: rgba(69, 196, 162, 0.2);
						border-radius: 15upx;
						color: #45C4A2;
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

				.ljxf {
					width: 164upx;
					height: 61upx;
					background: #45C4A2;
					border-radius: 31upx;
					position: absolute;
					bottom: 80upx;
					right: 21upx;

					font-size: 24upx;
					font-family: PingFang SC;
					color: #FEFEFE;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.ljxf2{
					width: 164upx;
					height: 61upx;
					background: #ccc;
					border-radius: 31upx;
					position: absolute;
					bottom: 80upx;
					right: 21upx;
				
					font-size: 24upx;
					font-family: PingFang SC;
					color: #000;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.status {
					width: 121upx;
					height: 57upx;

					position: absolute;
					bottom: 0upx;
					right: 21upx;

					image {
						width: 121upx;
						height: 57upx;
					}

					text {
						position: absolute;
						bottom: 7upx;
						right: 13upx;
						margin-top: 6upx;
					}
				}
			}
		}
	}
</style>
