<template>
	<view class="agreement">
		<jyf-parser :html="detail"></jyf-parser>
	</view>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser";
	export default {
		data() {
			return {
				detail:''
			}
		},
		onLoad(options){
			let self = this
			console.log(options);
			self.$api.agreement().then((res) => {
				console.log(res);
				if(res.code==200){
					self.detail = res.data.agreement;
				}else{
					this.$mUtils.toast(res.msg);
				}
				
			}).catch((err) => {
				console.log(err);
			});
		},
		methods: {
			
		},
		components: {
			"jyf-parser": parser,
		}
	}
</script>

<style>

</style>
