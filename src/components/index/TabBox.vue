<template>
	<view :class="['tabs-list',isBlack? 'black':'']">
		<text v-for="tab in tabs" :key="tab.id" :class="['tab-item',theTab == tab.id ? 'the-tab':'']"  @click="changeTab(tab)">{{tab.txt}}</text>
	</view>
</template>

<script>
	export default{
		props:{
			tabs:{
				type:Array
			},
			initTab:{
				type:[String,Number]
			},
			isBlack:{
				type:Boolean
			}
		},
		data(){
			return {
				// theTab:this.initTab,
			}
		},
		computed:{
			theTab:{
				set(val){
					return val;
				},
				get(){
					return this.initTab;
				}
			}
		},
		
		methods:{
			changeTab(tab){
				this.$emit("change-tab",tab)
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs-list{
		width: 100%;
		height: 120upx;
		margin-top: 20upx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.tab-item{
			font-size: 28upx;
			color: #1B285D;
			font-weight: bold;
		}
		
		.tab-item::after{
			content: '';
			width: 100%;
			height: 8upx;
			display: block;
			background-color: transparent;
			border-radius: 8upx;
		}
		.the-tab::after{
			background-color: #45C4A2;
		}
	}
	.tabs-list.black {
		height: 80upx;
		margin-top: 0;
	
		.tab-item {
			font-weight: normal;
			color: #333;
		}
	
	
		.the-tab {
			//#ifdef H5
			// color: var(--theme-color-blue);
			//#endif
			//#ifdef MP-WEIXIN
			 color: #333;
			//#endif
		}
	
	}
		
</style>
