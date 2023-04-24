<template>
	<view class="box">
		<image class="img"
			src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/bb79e10d-7da3-452a-ba36-9e09b31eced9.svg"
			mode="aspectFit"></image>
	</view>
</template>

<script setup>
	import {
		onMounted
	} from "vue";
	onMounted(() => {
		setTimeout(() => {
			uni.getStorage({
				key: '_id'
			}).then((res) => {
				uni.switchTab({
					url: "./index/index"
				})
			}).catch(err => {
				uni.redirectTo({
					url: "./login"
				})
			})
		}, 1500)

	})
</script>

<style scope>
	.box {
		width: 100%;
		height: 100%;
	}

	.img {
		position: absolute;
		width: 638rpx;
		height: 919.6rpx;
		left: 110rpx;
		top: 362rpx;

	}
</style>