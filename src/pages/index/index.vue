<template>
  <view class="content p-relative">
    <image
      class="bg" 
      src="../../static/images/logo.png"
      mode="widthFix"
    ></image>
    <text class="name fn-cl-fff fn-sz-40 fn-bold" :class="ipx?'ipx':''">厚浦科技</text>
    <!-- banner模块 -->
    <view class="carousel-wrapper" :class="ipx?'ipx':''">
      <topNav :list="banner_list"></topNav>
    </view>
    <!-- 分类模块 -->
    <view class="classify flex padding-48">
      <view
        class="item p-relative"
        v-for="(v, index) in imgList"
        :key="index"
        @click="goPage(v.value)"
      >
        <image :src="v.url" mode="widthFix"></image>
        <view class="p-absolute t-center">{{ v.name }}</view>
      </view>
    </view>
    <!-- mine -->
    <view class="mine p-fix" :class="ipx?'ipx':''" @click="goPage('mine')">
      <image class="img" src="../../static/images/mine.png" mode="" />
    </view>
    <!-- 弹窗 -->
    <view class="popupWrap f-center" v-if="popupflag" @click="closePop">
      <view class="popup">
        <view class="content">是否有体检报告？</view>
        <view class="select">
          <view class="cancle" @click.stop="toPathNav">暂无</view>
          <view class="sure" @click.stop="toPathOrder">已有</view>
        </view>
      </view>
    </view>
    <view class="popupWrap f-center" v-if="popupPay">
      <view class="popup">
        <view class="content pay">
          <text class="fn-cl-theme" v-for="(item,index) in tips" :key="index">【{{item.name}}】</text>存储费用已到期,请您支付存储费用！
        </view>
        <view class="select">
          <view class="cancle remove" @click.stop="popupPay = false">取消</view>
          <view class="sure confirm" @click.stop="toPathWaitpay">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import topNav from "@/components/index/Carousel.vue";

export default {
  data() {
    return {
      title: "Hello",
      banner_list: [
        { img: "../../static/images/bg1.png" },
        { img: "../../static/images/bg2.png" },
        { img: "../../static/images/bg3.png" },
      ],
      imgList: [
        {
          url: "../../static/images/bg2.png",
          name: "填写登记信息",
          value: "register",
        },
        {
          url: "../../static/images/bg3.png",
          name: "采血预约",
          value: "order",
        },
        {
          url: "../../static/images/bg4.png",
          name: "申请提取",
          value: "apply",
        },
        {
          url: "../../static/images/bg5.png",
          name: "平台活动",
          value: "activity",
        },
      ],
      popupflag: false,
      popupPay: false,
      tips: [], //快过期提示内容
      ipx:false, //是否为刘海屏
      code:''  //是否微信授权
    };
  },
 async onLoad() {
    
    this.isIpx()
    this.$api.bannerList().then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.banner_list = res.data;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    
    this.code = this.getQueryString("code")
			console.log(this.code);
			console.log(window.location.href);
      if(this.code){
      await  this.handleLogin({code:this.code});
      }
      let hasLogin = await uni.getStorageSync("hasLogin");
      if(hasLogin){
        this.getUserInfo();
        this.getMessage();
      }
  },
  methods: {
    isIpx(){
      let self = this;
      uni.getSystemInfo({
        success: function (res) {
          console.log(res);
          res.model = res.model.split('<')[0]
          console.log(res.model);
          if(res.model == 'iPhone'){
            uni.setStorageSync('url', window.location.href.split('#')[0])
          }
          console.log(88888);
          console.log(window.location.href.split('#')[0]);
          if (res.model == 'iPhone X' || res.model == 'iPhone XS' || res.model == 'iPhone XR' || res.model ==
            'iPhone XS Max' || res.model == 'iPhone 11' || res.model == 'iPhone 11 Pro' || res.model ==
            'iPhone 11 Pro Max' || res.model == 'iPhone 12 Pro' || res.model == 'iPhone 12 Pro Max' || res
            .model == 'iPhone 12') {
              console.log(6666);
              
              self.$store.commit("IS_IPX")
             self.ipx = true;
          }
          console.log(self.ipx);
        }
      });
    },
    getQueryString (name) { //获取url参数
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    //是否登录
    handleLogin(data){
      this.$api.login(data).then(res=>{
        console.log("授权登录接口",res)
        if(res.code == 200){
          console.log(res);
          let token = res.data
            this.$store.commit("SET_TOKEN",token)
            this.$store.commit("SET_HASLOGIN")
            console.log(3333333);
          //console.log(this.$store.getters.getToken)
          uni.setStorageSync('hasLogin', true)	
          uni.setStorageSync('auth', token)
          //获取用户信息 childCode
          console.log(6666); 
          this.getUserInfo();
          this.getMessage();
          
        }else{
          this.$mUtils.toast(res.msg)
        }
      })
      
    },
    //获取用户信息 childCode  
			getUserInfo(){
				console.log(this.$store);
				this.$api.userInfo().then(res=>{
					console.log(res);
					if(res.code == 200){
						// this.$store.commit("SET_CHILDCODE",res.data.child_code);
						// this.$store.commit("SET_USERINFO",res.data);
						if(!res.data.mobile){
							this.$mRouter.redirectTo({
								route:this.$mRoutesConfig.bindTel
							})
						}else{
							this.$mRouter.redirectTo({
								route:this.$mRoutesConfig.index
							})							
						}
					}
				})
      },
      //信息弹框
      getMessage(){
        this.$api.messageTips().then((res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.length > 0) {
              this.tips =this.tips.concat(res.data);
              if(!this.$store.state.showPopup){
                this.popupPay = true;
                this.$store.commit("CHANGE")
              }              
            }
          }
        }).catch((err) => {
          console.log(err);
        });
      },
    goPage(i) {
      console.log(i);
      if (i == "order") {
        this.popupflag = true;
        return;
      }
      this.$mUtils.goPage(i);
    },
    //关闭弹层
    closePop(){
      this.popupflag = false;
      console.log(8888);
    },
    toPathNav() {  //弹层跳转至导航页
      this.popupflag = false;
      this.$mUtils.goPage("nav");
    },
    toPathOrder() {  //弹层跳转至预约页面
      this.popupflag = false;
      this.$mUtils.goPage("order");
    },
    toPathWaitpay() {  //弹层跳转至储存续费
      this.popupPay = false;
      this.$mUtils.goPage("waitpay");
    },
  },
  components: {
    topNav,
  },
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: PingFang SC;
  .bg {
    width: 100%;
    height: 660upx;
  }
  .name {
    position: absolute;
    top: 60upx;
    left: 40upx;
  }
  .name.ipx{
    top: 100upx;
  }
  .carousel-wrapper {
    width: 94%;
    height: 300upx;
    position: absolute;
    top: 160upx;
    left: 3%;
  }
  .carousel-wrapper.ipx{
    top: 190upx;
  }
  .classify {
    width: 100%;
    height: auto;
    padding: 0 48upx;
    margin-top: 160upx;
    flex-wrap: wrap;
    justify-content: space-between;
    .item {
      width: 296upx;
      height: 325upx;
      margin-bottom: 38upx;
      image {
        width: 100%;
        height: 100%;
      }
      view {
        width: 100%;
        top: 220upx;
        font-size: 30upx;
        left: 0;
      }
    }
  }
  .mine {
    width: 100upx;
    height: 131upx;
    top: 90%;
    right: 0;
    .img {
      width: 133upx;
      height: 136upx;
      position: absolute;
    }
  }
  .mine.ipx{
    top: 74%;
  }
}
.classify .item:nth-child(1) view {
  color: #45c4a2;
}
.classify .item:nth-child(2) view {
  color: #788dfd;
}
.classify .item:nth-child(3) view {
  color: #37b6ff;
}
.classify .item:nth-child(4) view {
  color: #ff9d54;
}
.popupWrap {
  width: 100%;
  height: 102%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  .popup {
    width: 578upx;
    // height: 341upx;
    background: #ffffff;
    border-radius: 10upx;
    .content {
      margin-top: 84upx;
      margin-bottom: 93upx;
      text-align: center;
      font-size: 36upx;
      color: #000;
    }
    .select {
      display: flex;
      justify-content: space-around;
      view {
        width: 248upx;
        height: 82upx;
        line-height: 82upx;
        background: #dbfff5;
        border: 1upx solid #44c4a1;
        border-radius: 10upx;
        text-align: center;
        margin-bottom: 48upx;
        color: #44c4a1;
      }
      .sure {
        background: #44c4a1;
        color: #fff;
      }
    }
    .pay {
      font-size: 30upx; 
      padding: 0 40upx;
      box-sizing: border-box;
      font-weight: bold;
      }
    .select {
      .remove {
        background: #eee;
        border: none;
      }
      .confirm {
        color: #fff;
      }
    }
  }
  
}
// .content .ipx:first-child{
//   top: 100upx;
// }
// .content .ipx:last-child{
//   top: 190upx;
// }
</style>
