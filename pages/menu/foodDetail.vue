<template>
	<scroll-view class="box" style="padding-top:0;" v-if="data.data" scroll-y @scroll="scroll">
		<view class="show" :style="{opacity:data.opacity }">
			<image v-if="data.data.urlType==='image'" :src="data.data.url" mode="aspectFill"
				style="width: 100%;height: 100%;"></image>
			<video v-if="data.data.urlType==='video'" :src="data.data.url" controls
				style="width: 100%;height: 100%;"></video>
		</view>

		<!-- 内容部分 -->
		<view class="content" :style="{top:data.top+'px' }">
			<view class="foodName">
				<view class="flex">
					<image src="@/static/star.svg" mode="aspectFill" style="height: 32rpx;width: 32rpx;"></image>
					<view class="fs20 fw6 c24">
						{{data.data.name}}
					</view>
				</view>

				<image src="@/static/greenEdit.svg" mode="aspectFill" style="width: 64rpx;height: 64rpx;"
					@click="jumpEdit"></image>
			</view>

			<view class="fs16 c24 fw6" style="position: relative;">
				用料
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="dosage">
				<view v-for="(item,index) in data.data.materialList" :key="index" class="flex fs14 fw5"
					style="width: 313rpx;justify-content: space-between;height: 64rpx;">
					<view class="c24">
						{{item.name}}
					</view>
					<view style="color: rgba(36, 36, 36, 0.4);">
						{{item.dosage}}
					</view>
				</view>
			</view>

			<view class="fs16 c24 fw6" style="position: relative;">
				做法
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="step">
				<view class="stepDetail" v-for="(item,index) in data.data.step" :key="index">
					<view class="c24 fs14 fw7" style="margin-bottom: 20rpx;">
						<text style="display: inline-block;width: 40rpx;">{{index+1}}/</text><text
							style="opacity: 0.4;">{{data.data.step.length}}</text>
					</view>
					<view class="fs14 fw3 c24" v-html="item">
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive
	} from "vue";
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";

	const data = reactive({
		menuFun: null,
		data: null,
		opacity: 1,
		dom: null,
		id: null
	})



	function init() : void {

		data.menuFun = uniCloud.importObject('menu')
		data.menuFun.getDetail(data.id).then(res => {
			data.data = res.data
			data.data.url.indexOf('jpg') != -1 ? data.data.urlType = 'image' : data.data
				.urlType = 'video'

		})
	}



	function jumpEdit() : void {
		uni.navigateTo({
			url: `./editFood?id=${data.id}`
		})
	}

	function scroll(e : any) : void {
		let scrollTop = e.detail.scrollTop
		// console.log(e);
		data.opacity = 1 - scrollTop / 200

	}

	onShow(() => {
		init()
	})

	onLoad((options) => {
		data.id = options.id
	})
</script>

<style scoped>
	.box {
		/* min-height: calc(100vh + 498rpx); */
	}

	.show {
		width: 100%;
		height: 498rpx;
		position: fixed;
		top: 0;
		opacity: 1;
	}

	.content {
		width: 100%;
		/* height: 1842rpx; */
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		/* margin-top: 400rpx; */
		padding: 58rpx 40rpx;
		position: absolute;
		top: 400rpx;
		z-index: 9;
	}

	.foodName {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 2rpx solid #242424;
		margin-bottom: 40rpx;
	}

	.dosage {
		padding: 29rpx 0rpx 53rpx 0rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.step {
		margin-top: 16rpx;
		width: 100%;
		background: #FAFAFA;
		border-radius: 16rpx;
		padding: 32rpx 24rpx;
	}

	.stepDetail {
		padding-bottom: 20rpx;
		border-bottom: 2rpx dashed rgba(36, 36, 36, 0.4);
		margin-top: 20rpx;
	}
</style>