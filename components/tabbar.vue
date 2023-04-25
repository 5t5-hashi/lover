<template>
	<view class="tabbar">
		<image v-if="data.name!='card'" @click="chose('card')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/49accfbb-0c24-4fec-bdfc-fc7dbd3e1156.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
		<image v-if="data.name==='card'" @click="chose('card')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/e0546583-9723-4bc0-9503-58fd62a67214.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
		<image v-if="data.name!='home'" @click="chose('home')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/7a1db510-0a7e-43df-96cb-ff3c4f943b12.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
		<image v-if="data.name==='home'" @click="chose('home')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/6ea5eaf8-089b-4e86-aba3-6e1f65d8fbd9.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
		<image v-if="data.name!='name'" @click="chose('menu')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/1f44a874-52c4-4a00-b317-bfa474fdc303.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
		<image v-if="data.name==='name'" @click="chose('menu')"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/f8ffdab5-8898-4651-be38-a65f1a342d8a.svg"
			style="width: 88rpx;height: 88rpx" mode="aspectFill"></image>
	</view>
</template>

<script setup lang="ts">
	import {
		reactive, defineProps
	} from "vue"

	const props = defineProps({
		name: ""
	})

	const data = reactive({
		name: ""
	})


	function chose(e : string) : void {
		if (e === 'card') {
			uni.navigateTo({
				url: "/pages/water/water"
			})
		} else if (e === 'home') {
			uni.navigateTo({
				url: "/pages/index/index"
			})
		} else if (e === 'menu') {
			uni.navigateTo({
				url: "/pages/menu/menu"
			})
		}
	}
</script>

<style scoped>
	.tabbar {
		height: 130rpx;
		width: 100vw;
		padding: 24rpx 88rpx 44rpx 88rpx;
		display: flex;
		justify-content: space-between;
		border-top: 2rpx solid #C7E94E;
		position: absolute;
		bottom: 0;
		z-index: 9;
		background-color: #fff;
	}
</style>