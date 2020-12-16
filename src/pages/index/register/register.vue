<template>
  <view class="register padding-25">
    <view class="wrapbox" v-if="msgList.length > 0">
      <view
        class="detail f-column"
        v-for="(item, index) in msgList"
        :key="index"
        @tap="modify(item.id)"
      >
        <view class="wrap_name f-align">
          <text class="name fn-sz-30 fn-bold fn-cl-333">{{
            item.name || "李大壮"
          }}</text>
          <view class="inner fn-sz-22">{{ item.age}}岁</view>
        </view>
        <view class="tel fn-sz-24 fn-cl-666"
          >手机号码：{{ item.mobile || 18724582114 }}</view
        >
        <view class="id_card fn-sz-24 fn-cl-666"
          >身份证号：{{ item.id_code || "510824199014158x" }}</view
        >
        <image
          class="chose"
          :src="
            item.storage_status == 0
              ? '../../../static/images/no_select.png'
              : '../../../static/images/select.png'
          "
          @tap.stop="select(index)"
        />
      </view>
    </view>
    <view class="adduser f-center">
      <view class="add" @click="toPath('write')">
        <image src="../../../static/images/add.png" mode="" />
        <text class="fn-sz-30">添加用户</text>
      </view>
    </view>
    <view class="agreement p-fix" @click="click">
      <image
        class="selectBox"
        :src="
          flag
            ? '../../../static/images/read.png'
            : '../../../static/images/no_select.png'
        "
      />
      <text class="my fn-sz-24">我已阅读并同意</text>
      <text
        class="storage fn-sz-24 fn-cl-theme"
        @click.stop="toPath('agreement')"
        >《存储协议》</text
      >
    </view>
    <view class="footer padding-25 p-fix f-align">
      <view class="mount">
        <text class="order fn-sz-24 m-right-10">订单金额</text>
        <text class="price fn-sz-24 fn-cl-theme">￥</text>
        <text class="total fn-sz-36 fn-cl-theme">{{ total }}</text>
      </view>
      <view class="btn fn-sz-30" @tap="submit">提交订单</view>
    </view>
  </view>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      msgList: [],
      flag: false,
	  total: "0.00", //待交费用
	  price:''//jiage
    };
  },
  onShow() {
    this.getData();
    this.$api.agreement()
      .then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.price = res.data.money;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    getData() {
      //获取数据列表
      this.$api
        .messageList({ page: 1 })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.msgList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    toPath(i) {
      //页面跳转
      console.log(i);
      this.$mUtils.goPage(i);
    },
    click() {
      //是否已读
      this.flag = !this.flag;
    },
    modify(i) {
      //修改登记信息
      this.$mUtils.goPage("write", { id: i });
    },
    select(i) {
      //是否选择缴费
      this.msgList.forEach((value, index) => {
        if (index == i) {
          if (value.storage_status == 0) {
            value.storage_status = 1;
          } else {
            value.storage_status = 0;
          }
        }
        this.compute();
      });
    },
    compute() {
      //计算费用
      let num = 0;
      this.msgList.forEach((goods) => {
        if (goods.storage_status == 1) {
          num++;
        }
      });
      this.total = Number(this.price).subtract(Number(num));
    },
    submit() {
      //提交订单
      if (this.total == "0.00") {
        this.$mUtils.toast("未选中任何成员");
        return;
      } else if (!this.flag) {
        this.$mUtils.toast("请先阅读并勾选储存协议");
        return;
      } else {
        let idList = [];
        this.msgList.forEach((item) => {
          if (item.storage_status == 1) {
            idList.push(item.id);
          }
        });
        let params = {
          id: idList.toString(),
          type: "1",
        };
        this.$api
          .messagePost(params)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.onBridgeReady(res.data); //调用微信支付
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    /**
     * @description 调起微信支付
     */
    onBridgeReady(data) {
      let self = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appid,
          timeStamp: data.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.nonce_str, // 支付签名随机串，不长于 32 位
          package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: data.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.sign, // 支付签名
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            self.$mUtils.toast("支付成功！");
            setTimeout(() => {
              self.$mUtils.goPage("index");
            }, 400);
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            self.$mUtils.toast("支付取消！");
          }else if(res.err_msg == "get_brand_wcpay_request:fail"){
            self.$mUtils.toast("支付失败！");
          }
        }
      );
    },
  },
};
</script>

<style scoped lang="scss">
.register {
  background: #fff;
  font-family: PingFang SC;
  padding-bottom: 180upx;
  overflow: hidden;
  .detail {
    width: 100%;
    padding: 33upx 0 56upx 27upx;
    box-shadow: 1px 5px 26px 0px #edf2f1;
    border-radius: 10px;
    margin-top: 20upx;
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
    }
    .tel {
      margin-bottom: 24upx;
    }
    .chose {
      width: 30upx;
      height: 30upx;
      position: absolute;
      right: 50upx;
      top: 120upx;
    }
  }
  .adduser {
    width: 97%;
    margin-top: 40upx;
    height: 106upx;
    background: #ffffff;
    border: 1upx solid #45c4a2;
    box-shadow: 1upx 5upx 26upx 0upx #edf2f1;
    border-radius: 10upx;
    .add {
      image {
        width: 37upx;
        height: 36upx;
        margin-right: 11upx;
      }
      text {
        color: #45c4a2;
      }
    }
  }
  .agreement {
    width: 100%;
    height: 64upx;
    text-align: center;
    background: #fff;
    bottom: 100upx;
    left: 0;
    z-index: 99;
    .selectBox {
      width: 23upx;
      height: 23upx;
      margin-right: 6upx;
      vertical-align: middle;
    }
  }
  .footer {
    width: 100%;
    height: 98upx;
    background: #ffffff;
    border: 1upx solid #f6f6f6;
    box-shadow: 1upx 5upx 26upx 0upx #edf2f1;
    left: 0;
    bottom: 4upx;
    z-index: 99;
    justify-content: space-between;
    .mount {
      height: 100%;
      line-height: 98upx;
    }
    .btn {
      width: 260upx;
      height: 78upx;
      line-height: 78upx;
      background: #45c4a2;
      color: #fff;
      border-radius: 39upx;
      text-align: center;
    }
  }
}
</style>
