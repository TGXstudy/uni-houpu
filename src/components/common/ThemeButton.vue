<template>
  <button @tap.stop="tapBtn">{{ btnTxt }}</button>
</template>

<script>
export default {
  props: {
    btnTxt: {
      type: String,
      default: "确定",
    },
  },
  methods: {
    tapBtn() {
      this.$emit("tap-btn");
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  //#ifdef MP-WEIXIN
  background-color: #45C4A2;
  //#endif
  //#ifdef H5
  background-color: #45C4A2;
  //#endif
  font-size: 32upx;
  color: #fff;
  border-radius: 40upx;
  width: 100%;
  height: 90upx;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
