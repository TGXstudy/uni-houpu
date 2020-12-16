<template>
  <!-- 登录 绑定手机号 -->
  <view class="container">
    <!-- <image
      class="img-logo"
      src="../../static/imgs/login/img_logo.png"
      mode=""
    ></image> -->
    <view class="from-wrapper">
      <view class="from-item">
        <input
          class="fn-sz-30 fn-cl-333"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          v-model="phone"
          placeholder-class = "fn-cl-B5"
        />
        <view @click.stop="del"><image class="del" src="../../static/images/del.png" mode=""  /></view>
      </view>
      <view class="from-item">
        <input
          type="number"
          value=""
          placeholder="请输入验证码"
          v-model="validCode"
           placeholder-class = "fn-cl-B5"
        />
        <valid-code :phone="phone" :type="type"></valid-code>
      </view>
      <view class="from-item">
        <input
          type="text"
          value=""
          placeholder="请输入邀请码"
          v-model="inviteCode"
          placeholder-class = "fn-cl-B5"
        />
      </view>
    </view>
    <view class="btn-wrapper">
      <theme-button :btn-txt="'确认'" @tap-btn="doLogin"></theme-button>
    </view>
  </view>
</template>

<script>
import themeButton from "@/components/common/ThemeButton.vue";
import validCode from "@/components/register/ValidCode.vue";
export default {
  components: {
    themeButton,
    validCode,
  },
  data() {
    return {
      type: "1",
      phone: "",
      validCode: "",
      inviteCode: "",
    };
  },
  async mounted() {
    // await this.isCode()
  },
  methods: {
    del(){
      this.phone = ''
    },
    doLogin() {
      if(this.phone == ''){
        this.$mUtils.toast('请输入手机号');
        return
      }else if(this.validCode == ''){
        this.$mUtils.toast('请输入验证码');
        return
      }
      if(this.validCode){
        this.$api.bindPhone({
          mobile: this.phone,
          sms_code: this.validCode,
          invite_code: this.inviteCode,
        }).then((res) => {
          if(res.code == 200){
            this.$mRouter.push({
              route: this.$mRoutesConfig.index,
            });
          }else{
            this.$mUtils.toast(res.msg);
          }
        }).catch((err) => {
          this.$mUtils.toast(err.msg);
        });
    }
      // if (this.validCode) {
      //   const res1 = await this.$api.bindPhone({
      //     mobile: this.phone,
      //     sms_code: this.validCode,
      //     invite_code: this.inviteCode,
      //   });
      //   if (res1.code === 1) {
      //     await this.updateUser();
      //     this.$mUtils.goPage("index");
      //     return;
      //   }
      //   this.$mUtils.toast(res1.msg);
      }
  },
};
</script>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  padding: 260upx 110upx 0 90upx;
  .from-wrapper{
  	width: 100%;
  	padding: 0 24upx;
  	box-sizing: border-box;
  	.from-item{
  		width: 100%;
      height: 120upx;
      padding: 58upx 0 24upx 0;
  		display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1upx solid #e5e5e5;
      .del{
        width: 30upx;
        height: 31upx;
      }

  		input{
        display: block;
        //width: 80%;
  			// flex:1;
  			// flex-shrink: 1;
  			font-size: 28upx;
        color: #333;
  			height: 120upx;
  			line-height: 120upx;
      }  
    }
    .from-item:first-child{
      border-bottom: 1upx solid #44C4A1;
    }
  }

  .btn-wrapper {
    width: 100%;
    padding: 0 24upx;
    box-sizing: border-box;
    margin-top: 120upx;
  }
}
</style>
