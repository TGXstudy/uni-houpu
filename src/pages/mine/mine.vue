<template>
  <view class="mine">
    <view class="header" >
      <view class="right" :class="ipx?'ipx':''" @click="goPage('index')">
        <!-- <image class="return"  src="../../static/images/return.png"></image> -->
      </view>
      <view class="header_msg flex">
        <view class="left flex">
          <view class="img">
            <image :src="user.avatar?user.avatar:'../../static/images/photo.png'" mode="" />
          </view>
          <view class="msg flex">
            <text class="name fn-sz-40 fn-cl-fff">{{user.user_nickname}}</text>
            <text class="vote fn-sz-24 fn-cl-fff">邀请码:{{user.invite_code}}</text>
          </view>
        </view>
        <view class="Right flex" @click="goPage('personal')">
          <text class="person fn-sz-24 fn-cl-fff">个人主页</text>
          <image class="arrow" src="../../static/images/arrow-small.png"/>
        </view>
      </view>
    </view>
	<view class="content padding-25">
		<view class="menu-item flex" v-for="(v,index) in menus" :key="index" @click="goPage(v.value)">
			<image class="icon" :src="v.icon" mode="" />
			<text class="text fn-sz-30 fn-cl-333">{{v.txt}}</text>
			<image class="arrow_right" src="../../static/images/arrow.png"></image>
		</view>
      <view class="menu-item flex" @tap="makePhone">
        <image class="icon" src="../../static/images/service.png" mode="" />
        <text class="text fn-sz-30 fn-cl-333">客服热线</text>
        <image class="arrow_right" src="../../static/images/arrow.png"></image>
      </view>
	</view>
  </view>
</template>

<script>

//  import vConsole from "vconsole"
export default {
  data() {
    return {
      user:'',
      ipx:false, //是否为刘海屏
      tel:'',
      menus: [
          {
        id: 1,
        value: "custom",
            icon: "../../static/images/custom.png",
            txt: "客户信息",
          },
          {
        id: 2,
        value: "friends",
            icon: "../../static/images/friends.png",
            txt: "推荐好友",
          },
          {
        id: 3,
        value: "waitpay",
            icon: "../../static/images/waitpay.png",
            txt: "待交费",
          },
          {
        id: 4,
        value: "system",
            icon: "../../static/images/system.png",
            txt: "系统消息",
          },
        ],
    };
  },
  onLoad(){
    //  const v = new vConsole();
    this.ipx = this.$store.state.isIpx
    console.log(this.ipx);
    this.getUserMsg();
    this.getCustomer();
  },
  methods:{
	  goPage(i){
      console.log(6666);
      this.$mUtils.goPage(i);
    },
    //获取用户信息
    getUserMsg(){
      this.$api.userInfo().then((res) => {
        console.log(res);
        if(res.code == 200){
          this.user = res.data
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    //获取客服热线
    async getCustomer(){
      let res = await this.$api.agreement()
      console.log(res);
      if(res.code==200){
        this.tel = res.data.customer
      }else{
        console.log(res.msg);
      }
    },
    makePhone(){
       console.log(this.tel);
      // alert(this.tel)
      if(!this.tel){
        this.$mUtils.toast('请稍后');
      }else{
        uni.makePhoneCall({
            phoneNumber: this.tel //仅为示例
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
a{
  text-decoration: none;
}
.mine {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: PingFang SC;
  .header {
    width: 100%;
    height: 456upx;
    background: #45C4A2;
    padding: 0 25upx 0 13upx;
	box-sizing: border-box;
	align-items: center;
    .right {
      height: 33upx;
      padding-top: 72upx;
      padding-left: 25upx;
      margin-bottom: 69upx;
      .return {
        width: 19upx;
        height: 33upx;
      }
    }
    .right.ipx{
      padding-top: 112upx;
    }
    .header_msg {
      justify-content: space-between;
	  align-items: center;
      .left {
		align-items: center;
        .img {
          width: 152upx;
          height: 152upx;
          // border: 1upx solid #e5e5e5;
          margin-right: 8upx;
          border-radius: 50%;
          overflow: hidden;
          image {
            width: 151upx;
            height: 151upx;
            border-radius: 50%;
          }
        }
        .msg {
		  flex-direction: column;
		  .name{
			  margin-bottom: 14upx;
		  }
        }
      }
      .Right {
		 align-items: center;
		 .person{
			 margin-right: 9upx;
		 }
        .arrow {
          width: 12upx;
          height: 19upx;
        }
      }
    }
  }
  .content{
	width: 100%;
	height: 720upx;
	background: #FFFFFF;
	border-radius: 30upx;
	position: relative;
	top: -40upx;
	left: 0;
	padding-top: 66upx;
	.menu-item{
		align-items: center;
		margin-bottom: 66upx;
		.icon{
			width: 52upx;
			height: 52upx;
			margin-right: 19upx;
		}
		.text{
			flex-grow: 1;
		}
		.arrow_right{
			width: 16upx;
			height: 24upx;
		}
	}
  }
}
</style>
