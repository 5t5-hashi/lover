<template>
	<view class="box" style="height: 1000px;">
		<view class="a">
			芝士{{data.name}}D主页
		</view>

		<!-- <button type="default" @click="jump('../menu/createFood')">添加菜品</button> -->
		<button type="default" @click="logout">退出</button>
	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref
	} from "vue";

	const data = reactive({
		name: ""
	})

	function logout() : void {
		uni.clearStorage()
		uni.redirectTo({
			url: "/pages/login"
		})
	}

	function jump(e : string) : void {
		uni.navigateTo({
			url: e
		})
	}


	onMounted(() => {
		uni.getStorage({
			key: 'name',
		}).then((res) => {
			data.name = res.data
		})
	})
</script>

<style scoped>
	.a {
		height: 500px;
		margin-top: 50px;
		position: sticky;
		top: 10px;
	}

	.top {
		width: 100%;
		padding: 0 56rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.moneyText {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 56rpx;
	}

	.statisticsBox {
		margin-top: 18rpx;
		width: 100%;
		height: 212rpx;
		padding: 0 40rpx;
		border-bottom: 4rpx solid #242424;
	}

	.statistics {
		width: 100%;
		height: 210rpx;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		border: 4rpx solid;
		border-image-source: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
			linear-gradient(0deg, #242424, #242424);
		border-bottom: none;

		position: relative;
	}

	.statisticsTop {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.statisticsLeft {
		margin-left: 56rpx;
		margin-top: 40rpx;
	}

	.balance {
		padding: 12rpx 28rpx;
		gap: 20rpx;
		height: 72rpx;
		background: #FAFAFA;
		border-radius: 52rpx;
		border: 1.2rpx solid;
		border-image-source: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
			linear-gradient(0deg, #242424, #242424);
		margin-top: 12rpx;
		font-weight: 600;
		font-size: 36rpx;
		color: #004244;
	}

	.statisticsRight {
		margin-left: 196rpx;
		position: absolute;
		left: 196rpx;
		top: 50rpx;
	}

	.monthOut {
		width: 100%;
		margin-bottom: 28rpx;
	}

	.wave {
		width: 100%;
		height: 32rpx;
		position: relative;
		bottom: 32rpx;
	}

	.selectBar {
		margin-top: 38rpx;
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 38rpx;
	}

	.detailsText {
		margin-left: 72rpx;
		width: 80rpx;
		height: 54rpx;
		font-weight: 500;
		font-size: 40rpx;
		color: rgba(36, 36, 36, 1);
		position: relative;
	}

	.selectItems {
		margin-left: 112rpx;
		display: flex;
		align-items: center;
	}

	.selectItemActive {
		gap: 20rpx;
		background: #FBFBFB;
		border-radius: 50rpx;
		color: rgba(36, 36, 36, 1);
		border: 2rpx solid rgba(36, 36, 36, 1);
		font-weight: 500;
		font-size: 26rpx;
		width: 96rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-right: 24rpx;
	}

	.selectItemUnactive {
		/* gap: 20rpx;
		background: #FBFBFB;
		border-radius: 50rpx;
		color: rgba(36, 36, 36, 0.4);
		border: 2rpx solid rgba(36, 36, 36, 0.4);
		font-weight: 500;
		font-size: 26rpx;
		width: 96rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-right: 24rpx; */
		opacity: 0.4;
	}

	.createButton {
		position: fixed;
		width: 166rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #C7E94E;
		box-shadow: 0rpx 44rpx 32rpx -26rpx rgba(0, 0, 0, 0.16);
		border-radius: 16rpx;
		font-weight: 600;
		font-size: 30rpx;
		color: #FFFFFF;
		bottom: 120rpx;
		right: 32rpx;
	}

	.waterBox {
		width: 100%;
		padding: 0rpx 40rpx 0rpx 44rpx;
		overflow: scroll;
		height: calc(100vh - 586rpx);
	}

	.waterDay {
		padding: 32rpx 27rpx;
		width: 100%;
		background: #FAFAFA;
		border-radius: 22rpx;
		margin-bottom: 36rpx;
	}

	.waterDayTop {
		display: flex;
		justify-content: space-between;
	}


	.empty {
		position: relative;
		width: 28rpx;
		height: 28rpx;
		background: #FBFBFB;
		border: 2rpx solid #13DDE2;
		border-radius: 38rpx;

		box-sizing: content-box;
		margin-right: 8rpx;
	}

	.able {
		position: absolute;
		width: 16rpx;
		height: 16rpx;
		left: 7rpx;
		top: 6rpx;
		background: #13DDE2;
		border-radius: 8rpx;
	}

	.waterItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 28rpx;
	}

	.popBox {
		width: 100%;
		height: 1110rpx;
		border-radius: 48rpx 48rpx 0rpx 0rpx;
		background-color: #fff;
		padding: 30rpx;
	}
</style>