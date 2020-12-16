<template>
	<view class="actDetail">
		<jyf-parser :html="detail"></jyf-parser>
		<view v-if="detail==''" style="text-align:center;color:#666;margin-top:20px;">暂无内容~</view>
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
			let self = this;
			console.log(options);
			this.$api.activityDetail({id:options.id}).then((res) => {
				console.log(res);
				if(res.code == 200){
					self.detail = res.data.content
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
