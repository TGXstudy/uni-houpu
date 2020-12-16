<template>
	<view class="content">
		<view class="write">
			<view class="wrap padding-25">
				<view class="item f-align">
					<label for="name">姓名</label>
					<input type="text" id="name" v-model="form.name" placeholder="请输入姓名" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
				</view>
				<view class="item f-align">
					<label for="tel">手机号</label>
					<input type="number" v-model="form.tel" maxlength=11 id="tel" placeholder="请输入手机号" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
				</view>
				<view class="item f-align">
					<label for="age">年龄</label>
					<input type="number" v-model="form.age" id="age" placeholder="请输入年龄" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
				</view>	
				<view class="item f-align">
					<label for="height">身高</label>
					<input type="number" id="height" v-model="form.height" placeholder="请输入身高" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
					<text class="fn-sz-30 fn-cl-333">cm</text>
				</view>
				<view class="item f-align">
					<label for="weight">体重</label>
					<input type="number" id="weight" v-model="form.weight" placeholder="请输入体重" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
					<text class="fn-sz-30 fn-cl-333">kg</text>
				</view>
				<view class="item f-align">
					<label for="idcard">身份证号</label>
					<input type="idcard" v-model="form.idcard" id="idcard" placeholder="请输入身份证号" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />
				</view>
				<view class="item f-align">
					<label for="emial">电子邮箱</label>
					<input type="text" v-model="form.email" id="emial" placeholder="请输入电子邮箱" placeholder-style="text-align: right;color: #ccc;font-size: 30upx;" />	
				</view>
				<view class="item f-align" v-if="j==1">
					<label for="number">编号</label>
					<view class="detail">{{identifier}}</view>
				</view>
				<view class="item f-align">
					<text class="sex">请选择性别</text>
					<view class="radiobox ">
						<radio-group class="flex" @change="radioChange">
							<label class="flex" v-for="(item, index) in items" :key="item.value">
								<view>
									<radio :value="item.value" :checked="index === current" />
								</view>
								<view>{{item.value}}</view>
							</label>
						</radio-group>			
					</view>
				</view>
			</view>
			<view class="divide"></view>
			<view class="wrapBox" v-for="(item,index) in message" :key="index">
				<view class="msg">{{item.name}}</view>
				<textarea class="inputbox" name="" id="" v-model="item.health" :placeholder="item.txt" placeholder-style="color: #ccc;font-size: 30upx;"></textarea>
			</view>
			<view class="btn fn-sz-30 p-fix" @tap="submit">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form:{name:'',tel:'',age:'',height:'',weight:'',idcard:'',email:''},
				items:[{value:'男'},{value:'女'}],
				current:0,
				message:[{name:'健康信息',txt:'请输入健康信息',health:''},
						{name:'传染病史',txt:'是否有传染病史，如有请输入传染病史信息，如否填写无',health:''},
						{name:'普通疾病史',txt:'是否有普通疾病史，如有请输入普通疾病史信息，如否 填写无',health:''}], //健康信息列表
				j:0,//是否从客户列表跳转
				identifier:'', //编号
				id:''
			}
		},
		onLoad(options){
			console.log(options);
			if(JSON.stringify(options)!=='{}'){
				let params = {id:options.id}
				this.getMessageDetail(params)
				if(options.j){
					this.j = options.j
				}				
			}
		},
		methods: {
			getMessageDetail(params){ //获取登记信息详情
				this.$api.messageDetail(params).then((res) => {
					console.log(res);
					if(res.code == 200){
						this.id = res.data.id
						this.form.name =res.data.name ;
						this.form.tel = res.data.mobile;
						this.form.age = res.data.age
						this.form.height = res.data.height
						this.form.weight = res.data.weight
						this.form.idcard = res.data.id_code
						this.form.email = res.data.email
						this.message[0].health = res.data.healthy
						this.message[1].health = res.data.infection
						this.message[2].health = res.data.disease
						this.identifier = res.data.identifier
						if(res.data.sex == '1'){
							this.current = 0
						}else{
							this.current = 1
						}						
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			submit(){
				if(this.form.name==''||this.form.tel==''||this.form.age==''||this.form.height==''||this.form.weight==''||
					this.form.idcard==''||this.form.email==''){
						this.$mUtils.toast('请输入完整信息');
						return
					};
				if(!this.$regs.isPhone.test(this.form.tel)){
					this.$mUtils.toast('手机号格式错误');
					return
				};
				if(!this.$regs.isIdCard.test(this.form.idcard)){
					this.$mUtils.toast('身份证格式错误');
					return
				};
				if(!this.$regs.isEmail.test(this.form.email)){
					this.$mUtils.toast('邮箱格式错误');
					return
				};
				if(this.message[0].health == ''){
					this.$mUtils.toast('请输入健康状况');
					return					
				}
				if(this.message[1].health == ''){
					this.$mUtils.toast('请输入传染病史');
					return					
				}
				if(this.message[2].health == ''){
					this.$mUtils.toast('请输入普通病史');
					return					
				}
				let params = {
					name:this.form.name,
					mobile:this.form.tel,
					age:this.form.age,
					height:this.form.height,
					weight:this.form.weight,
					id_code:this.form.idcard,
					email:this.form.email,
					sex:(this.current+1),
					healthy:this.message[0].health,
					infection:this.message[1].health,
					disease:this.message[2].health
				}
				if(this.id){
					params.id = this.id	
				}
				console.log(params);
				this.$api.addMessage(params).then((res) => {
					console.log(res);
					if(res.code == 200){
						this.$mUtils.toast('保存成功');
						setTimeout(() => {
							if(this.j==0){
								this.$mRouter.redirectTo({
									route:this.$mRoutesConfig.register
								})
							}else{
								this.$mRouter.redirectTo({
									route:this.$mRoutesConfig.custom
								})
							}								
						}, 1000);
					}else{
						this.$mUtils.toast('保存失败');
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
				console.log(66666);
				console.log(this.items[this.current].value);
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		width: 100%;
		height: 100%;
		background: #f6f6f6;
	}
	.write{
		width: 100%;
		background: #fff;		
		font-family: PingFang SC;
		padding-bottom: 120upx;
		.wrap{
			background: #fff;
			.item{
				border-top: 2upx solid #E5E5E5;
				width: 100%;
				background: #fff;
				height: 120upx;
				line-height: 120upx;
				// justify-content: space-between;
				label,.sex{
					flex-grow: 1;
				}
				input{
					text-align: right;
					margin-right: 15upx;
				}
			}
		}
		.btn{
			width: 695upx;
			height: 88upx;
			line-height: 88upx;
			color: #fff;
			text-align: center;
			background-image: url('../../../static/images/btn_long.png');
			background-size: 695upx 88upx;
			left: 3%;
			bottom: 35upx;
		}
	}
	.divide{
		width: 750upx;
		height: 20upx;
		background: #F6F6F6;

	}
	.wrapBox{
		width: 100%;
		background: #fff;
		box-sizing: border-box;
		padding: 27upx 20upx 14upx 27upx;
		.msg{
			font-size: 30upx;
			color: #333;
			margin-bottom: 27upx;
		}
		.inputbox{
			width: 701upx;
			height: 141upx;
			background: #F6F6F6;
			border: 1upx solid #E5E5E5;
			border-radius: 8upx;
		}
	}
</style>
