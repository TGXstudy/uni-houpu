<template>
  <view class="nav">
    <view class="map">
      <view class="page-section page-section-gap">
        <map
          style="width: 100%; height: 800upx"
          :latitude="latitude"
          :longitude="longitude"
          :markers="covers"
          scale="16"
          v-if="mapFlag"
        >
        </map>
         <!-- <view id="container" style="width: 100%; height: 750upx" 
        :latitude="latitude"
        :longitude="longitude"></view> -->
      </view> 
    </view>
   
    <view class="wrapper">
      <scroll-view class="scroll padding-25" scroll-y="true">
        <view class="content" v-for="(item, index) in dataList" :key="index">
          <image src="../../../static/images/location.png" mode="" />
          <view class="message">
            <text class="name">{{
              item.name || "成都大学附属医院体检中心"
            }}</text>
            <text class="location"
              >{{ item.address || "成都市金牛区二环路北二段82号" }}
            </text>
          </view>
          <view class="right">
            <text class="distance">{{ item.distance || "2.0" }}km</text>
            <view class="nav" @tap="sure(item)">导航</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="popupWrap f-center" v-if="popupNav">
      <view class="popup">
        <view class="status">
          <view class="cancle" @click="cancle">取消</view>
          <view class="sure" @click="sure">确认</view>
        </view>
        <view class="content">请选择导航地图</view>
        <view class="inner">
          <view
            class="select"
            :class="index == current ? 'active' : ''"
            v-for="(item, index) in menus"
            :key="index"
            @click="change(index)"
            >{{ item.txt }}</view
          >
        </view>
      </view>
    </view>

    <view class="popupWrap f-center" v-if="popupTips">
      <view class="popup">
        <view class="hospital"
          >请前往就近三甲医院体检，血常规检查，传染四项检查</view>
        <view class="chose">
          <view class="cancle" @click="toPath">取消</view>
          <view class="sure" @click="toPath">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script type="text/javascript"src="https://a.amap.com/jsapi_demos/static/remogeo/remogeo.js"></script>	
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
// var QQMapWX = require("../../../common/js/qqmap-wx-jssdk");
// var qqmapsdk = new QQMapWX({
//   key: "CY5BZ-HEWLP-XMLDE-LF2GX-VT6GO-RFFZR", // 必填
// });
import wx from "weixin-js-sdk";
export default {
  data() {
    return {
      latitude: 30.67,
      longitude: 104.07,
      covers: [
        {
          latitude: 30.67,
          longitude: 104.07,
          iconPath: "../../../static/images/icon.png",
          width: 20,
          height: 30,
        },
      ],

      dataList: [],
      popupNav: false,
      popupTips: false,
      menus: [{ txt: "高德地图" }],
      current: 0, //默认选中地图
      detail: "",
      page: 1,
      limit: 10,
      mapFlag:false,
      url:''
    };
  },
  async onLoad() {
    //获取定位
    uni.showLoading({
			title: '请稍候...',
		})
    let self = this;
    let url = uni.getStorageSync("url")
    console.log(url);
    if(url){
      self.url = url
    }else{
      self.url = window.location.href.split('#')[0]
    }
    console.log(self.url);
    self.getdata();
    const amap = await this.initAMap();
    await this.getPOI(amap);

    //await this.picker(amap)
   
  },
  methods: {
    async initAMap() {
      const amap = await AMapLoader.load({
        key: "2437520350631108848c93bfbeb1face", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Geolocation"], // 需要使用的的插件列表，如比例尺'AMap.Scale'
        AMapUI: {
          // 是否加载 AMapUI，缺省不加载
          version: "1.1", // AMapUI 缺省 1.1
          plugins: ["misc/PositionPicker"], // 需要加载的 AMapUI ui插件
        },
        Loca: {
          // 是否加载 Loca， 缺省不加载
          version: "2.0", // Loca 版本，缺省 1.3.2
        },
      });
      return amap;
    },
    async getmap(amap){
      const map = new amap.Map('container')
    //   var marker = new amap.Marker({
    //     icon: "../../../static/images/icon.png",
    //     imageSize: new AMap.Size(22,28),
    //     position: [104.07, 30.67]
    // });
    // map.add(marker);
      return map
    },
    async getPOI(amap) {
      let self = this;
      const geolocation = new amap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 100,
      });
      geolocation.getCurrentPosition(function (status, result) {
        if (status == "complete") {
          console.log(result);
           self.latitude = result.position.lat;
           self.longitude = result.position.lng;
            self.covers[0] = {
            latitude: result.position.lat,
            longitude: result.position.lng,
            iconPath: "../../../static/images/icon.png",
            width: 20,
            height: 30,
          };
          self.mapFlag = true
          uni.hideLoading()

          // onComplete(result);
          console.log(self.covers);
          self.getdata();
        } else {
          // alert('定位失败')
          console.log(result);
          self.getSite()
          // let res = self.getLocation()
          
          
        }
      });
    },
    //获取微信定位
    async getSite(){
      let self = this;
      // alert(location.href.split('#')[0])
      // console.log(location.href.split('#')[0]);
      let res = await self.$api.getSignPackage({url:self.url})
      console.log(res);
      await wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx27eeee98bfdf9b27', // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.signature,// 必填，签名
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
      });
      await wx.ready(function(){
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              console.log(res);
              self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              self.covers[0] = {
                latitude: res.latitude,
                longitude: res.longitude,
                iconPath: "../../../static/images/icon.png",
                width: 20,
                height: 30,
              };
              self.mapFlag = true
              uni.hideLoading()
            },
            fail:function(err){
              // alert('失败')
              console.log(err)
            }
          });
      });
    },
    //获取H5定位
    getLocation: function () {
      if (navigator.geolocation) {
        alert('可以h5定位')
        if(navigator.platform==='iPhone'){
            alert('进入if')
            let remoGeo = new RemoGeoLocation();
            navigator.geolocation.getCurrentPosition = function () {
              console.log('进入方法');
                return remoGeo.getCurrentPosition.apply(remoGeo, position =>{
                  alert("h5定位成功");
                  console.log(position);
                });
            };
            // navigator.geolocation.watchPosition = function () {
            //     return remoGeo.watchPosition.apply(remoGeo, arguments);
            // };
        }else{
          alert('else')
        }
      } else {
        alert("不支持H5定位");
      }
    },
    showPosition(position) {
      //成功后执行
      alert("h5定位成功");
      console.log(35431335131);
      console.log(position);
      // AMap.plugin('AMap.Geocoder', function() {
      //     var geocoder = new AMap.Geocoder({
      //       // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      //       //city: '010'
      //     })

      //     var lnglat = [res.coords.latitude, res.coords.latitude]

      //})
    },
    showError(v) {
      alert("h5定位失败失败");
      console.log(4315431);
      console.log(v);
      
    },
    getdata(i) {
      //获取体检中心信息
      let self = this;
      self.$api
        .hospitalList({
          page: self.page,
          limit: self.limit,
          longitude: '104.07',
          latitude: '30.67',
        })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.data.length > 0) {
              self.dataList = self.dataList.concat(res.data.data);
            }
            if (self.dataList.length == 0) {
              self.popupTips = true;
            }
          } else {
            self.$mUtils.toast(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nav(item) {
      this.popupNav = true;
      this.detail = item;
      console.log(99999);
      console.log(this.dataList);
      //window.location.href = `http://uri.amap.com/marker?position=${item.longitude},${item.latitude}&name=${item.address}&coordinate=gaode&callnative=1`
    },
    change(v) {
      this.current = v;
    },
    cancle() {
      this.popupNav = false;
    },
    toPath() {
      this.$mUtils.goPage("index");
    },
    sure(i) {
      this.detail = i;
      if (this.current == 0) {
        window.location.href = `http://uri.amap.com/marker?position=${this.detail.longitude},${this.detail.latitude}&name=${this.detail.address}&coordinate=gaode&callnative=1`;
      } 
      // else if (this.current == 1) {
      //   window.location.href = ` http://apis.map.qq.com/uri/v1/marker?marker=coord:${this.detail.latitude},${this.detail.longitude};addr:${this.detail.address}`;
      // } else if (this.current == 2) {
      //   window.location.href = `http://api.map.baidu.com/marker?location=${this.detail.latitude},${this.detail.longitude}&title=${this.detail.address}&output=html`;
      // }
    },
  },
};
</script>

<style scoped lang="scss">
.nav {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: PingFang SC;
  .map {
    width: 100%;
    height: 750upx;
    .page-section {
      width: 100%;
      height: 100%;
    }
  }
  .wrapper {
    width: 100%;
    height: 598upx;
    background: #ffffff;
    box-shadow: 1upx 5upx 26upx 0upx #edf2f1;
    border-radius: 40upx 40upx 10upx 10upx;
    position: relative;
    z-index: 90;
    .scroll {
      width: 100%;
      height: 598upx;
      margin-top: -16upx;
      padding-top: 20upx;
      .content {
        display: flex;
        padding-top: 27upx;
        padding-bottom: 22upx;
        border-bottom: 1px solid #e5e5e5;
        image {
          width: 25upx;
          height: 29upx;
          margin-right: 18upx;
          margin-top: 10upx;
        }
        .message {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          .name {
            font-size: 32upx;
            font-weight: 500;
            color: #333333;
            margin-bottom: 19upx;
          }
          .location {
            font-size: 22upx;
            color: #999999;
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          .distance {
            font-size: 22upx;
            font-weight: 500;
            color: #333333;
            margin-bottom: 36upx;
          }
          .nav {
            width: 109upx;
            height: 50upx;
            line-height: 50upx;
            border: 1upx solid #45c4a2;
            border-radius: 25upx;
            text-align: center;
            font-size: 26upx;
            color: #45c4a2;
          }
        }
      }
    }
  }
  .popupWrap {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    .popup {
      width: 578upx;
      // height: 341upx;
      background: #ffffff;
      border-radius: 10upx;
      .status {
        padding: 20upx 40upx;
        display: flex;
        justify-content: space-between;
        view {
          font-size: 28upx;
          color: #333;
        }
        .sure {
          color: #45c4a2;
        }
      }
      .content {
        margin-bottom: 42upx;
        text-align: center;
        font-size: 36upx;
        color: #000;
      }
      .inner {
        display: flex;
        justify-content: space-around;
        padding-bottom: 20upx;
        .select {
          width: 180upx;
          height: 62upx;
          line-height: 62upx;
          background: #f1fcf9;
          border: 1upx solid #44c4a1;
          font-size: 28upx;
          border-radius: 10upx;
          text-align: center;
          margin-bottom: 48upx;
          color: #44c4a1;
        }
        .active {
          background: #52cca5;
          color: #fff;
        }
      }
      .hospital {
        padding: 20upx 40upx;
        font-size: 32upx;
        text-align: center;
      }
      .chose {
        padding: 40upx 60upx;
        display: flex;
        justify-content: space-between;
        .cancle {
          color: #666;
        }
        .sure {
          color: #44c4a1;
        }
      }
    }
  }
}
</style>
