<template>
  <view class="waitpay">
    <view class="wrap padding-25">
      <view
        v-if="list.length == 0 || list == ''"
        style="text-align: center; color: #666; margin-top: 20px"
        >暂无数据~</view
      >
      <view
        class="item p-relative"
        v-else
        v-for="(item, index) in list"
        :key="index"
        @click="change(index)"
      >
        <view class="detail f-column">
          <view class="wrap_name f-align">
            <text class="name fn-sz-30 fn-bold fn-cl-333">{{ item.name }}</text>
            <view class="inner fn-sz-22">{{ item.age }}岁</view>
            <view class="number fn-sz-24 fn-cl-theme"
              >编号{{ item.identifier }}</view
            >
          </view>
          <view class="tel fn-sz-24 fn-cl-666"
            >手机号码：{{ item.mobile }}</view
          >
          <view class="id_card fn-sz-24 fn-cl-666"
            >身份证号：{{ item.id_code }}</view
          >
          <view class="endtime fn-sz-24 fn-cl-666"
            >到期时间：{{ item.storage_time }}</view
          >
          <view class="icon p-absolute">
            <image
              :src="
                item.is_select == 1
                  ? '../../static/images/select.png'
                  : '../../static/images/no_select.png'
              "
            />
          </view>
        </view>
      </view>
    </view>
    <view class="foot">
      <view class="agreement" @click="click">
        <image
          class="selectBox"
          :src="
            isReady
              ? '../../static/images/read.png'
              : '../../static/images/no_select.png'
          "
        />
        <text class="my fn-sz-24">我已阅读并同意</text>
        <text class="storage fn-sz-24 fn-cl-theme" @click.stop="toPath"
          >《存储协议》</text
        >
      </view>
      <view class="footer padding-25">
        <view class="mount">
          <text class="order fn-sz-24 m-right-10">订单金额</text>
          <text class="price fn-sz-24 fn-cl-theme">￥</text>
          <text class="total fn-sz-36 fn-cl-theme">{{ total }}</text>
        </view>
        <view class="btn fn-sz-30" @click="submit">提交订单</view>
      </view>
    </view>
  </view>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      list: [],
      isReady: false, //是否已读
      // flag: true, //记录是否请求数据的状态
      limit: 10, //每页条数
      page: 1, //当前页
      total: "0", //金额
      price:''
    };
  },
  async onLoad() {  
    console.log(666);
    await this.getPrice();
    await this.getData();
  },
  //触底分页
  // onReachBottom: function () {
  //   if (this.flag) {
  //     this.getData();
  //   }
  // },
  methods: {
    change(i) {
      this.list.forEach((currentItem, idx) => {
        if (idx == i) {
          if (currentItem.is_select == 0) {
            currentItem.is_select = 1;
          } else {
            currentItem.is_select = 0;
          }
        }
      });
      this.compute();
    },
    click() {
      //是否已读
      this.isReady = !this.isReady;
    },
    toPath() {
      //跳转至协议页面
      this.$mUtils.goPage("agreement");
    },
    //缴费
    async getData() {
      let self = this;
      self.flag = false;
      let res = await self.$api.messageWait({
          limit: self.limit,
          page: self.page,
        })
        console.log("测试", res);
        if (res.code == 200) {
        
          self.list = res.data;
          // console.log(list);
          //为下一页的请求参数做准备
          await self.compute();
        } else {
          this.$mUtils.toast(res.msg);
        }
    },
    async getPrice(){
      let res = await this.$api.agreement()
      if(res.code==200){
        this.price = res.data.storage
      }else{
        console.log(res.msg);
      }
    },
    compute() {
      //计算费用
      let num = 0;
      this.list.forEach((goods) => {
        if (goods.is_select == 1) {
          num++;
        }
      });
      this.total = Number(this.price).subtract(Number(num));
    },
    //调取微信支付接口
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
    submit() {
      //储存续费
      if (this.total == "0") {
        this.$mUtils.toast("未选中任何成员");
        return;
      } else if (!this.isReady) {
        this.$mUtils.toast("请先阅读并勾选储存协议");
        return;
      } else {
        let idList = [];
        this.list.forEach((item) => {
          if (item.is_select == 1) {
            idList.push(item.id);
          }
        });
        let params = {
          id: idList.toString(),
          type: "2",
        };
        this.$api
          .messagePost(params)
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.onBridgeReady(res.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.waitpay {
  width: 100%;
  // height: 100%;
  background: #fff;
  font-family: PingFang SC;
  padding-bottom: 150upx;
  .wrap {
    width: 100%;
    overflow: hidden;
    .item {
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
        top: 140upx;
        image {
          width: 30upx;
          height: 30upx;
        }
      }
    }
  }

  .foot {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    .agreement {
      text-align: center;
      .selectBox {
        width: 23upx;
        height: 23upx;
        margin-right: 6upx;
        vertical-align: middle;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      width: 100%;
      height: 98upx;
      background: #ffffff;
      border: 1upx solid #f6f6f6;
      box-shadow: 1upx 5upx 26upx 0upx #edf2f1;
      left: 0;
      bottom: 0;
      justify-content: space-between;
      .mount {
        display: flex;
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
}
</style>
