<template>
	<view class="box" v-if="data.data" @touchmove="touchMove">
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
					<image src="@/static/star.svg" mode="aspectFill" style="height: 16px;width: 16px;"></image>
					<view class="fs20 fw6 c24">
						{{data.data.name}}
					</view>
				</view>

				<image src="@/static/greenEdit.svg" mode="aspectFill" style="width: 32px;height: 32px;"
					@click="jumpEdit"></image>
			</view>

			<view class="fs16 c24 fw6" style="position: relative;">
				用料
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="dosage">
				<view v-for="(item,index) in data.data.materialList" :key="index" class="flex fs14 fw5"
					style="width: 156.5px;justify-content: space-between;height: 32px;">
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
					<view class="c24 fs14 fw7" style="margin-bottom: 10px;">
						<text style="display: inline-block;width: 20px;">{{index+1}}/</text><text
							style="opacity: 0.4;">{{data.data.step.length}}</text>
					</view>
					<view class="fs14 fw3 c24">
						{{item}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		watch
	} from "vue";


	const data = reactive({
		menuFun: null,
		data: null,
		top: 200,
		opacity: 1,
		dom: null
	})



	function init() : void {
		uni.getStorage({
			key: 'menuId',
		}).then((prop : any) => {

			data.menuFun = uniCloud.importObject('menu')
			data.menuFun.getDetail(prop.data).then(res => {
				data.data = res.data
				data.data.url.indexOf('jpg') != -1 ? data.data.urlType = 'image' : data.data
					.urlType = 'video'

			})
		})
	}

	init()

	function touchMove(e : any) : void {

		data.dom = uni.createSelectorQuery().select('.content')

		uni.createSelectorQuery().select('.content').boundingClientRect(res => {
			data.opacity = (1 / 235) * res.top
		}).exec();
	}

	function jumpEdit() : void {
		uni.navigateTo({
			url: "./editFood"
		})
	}

	onMounted(() => {
	})
</script>

<style scoped>
	.box {
		/* min-height: calc(100vh + 249px); */
	}

	.show {
		width: 100%;
		height: 249px;
		position: fixed;
		top: 0;
		opacity: 1;
	}

	.content {
		width: 100%;
		/* height: 921px; */
		background: #FFFFFF;
		border-radius: 20px 20px 0px 0px;
		/* margin-top: 200px; */
		padding: 29px 20px;
		position: absolute;
		top: 200px;
		z-index: 9;
	}

	.foodName {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid #242424;
		margin-bottom: 20px;
	}

	.dosage {
		padding: 14.5px 0px 26.5px 0px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.step {
		margin-top: 8px;
		width: 100%;
		background: #FAFAFA;
		border-radius: 8px;
		padding: 16px 12px;
	}

	.stepDetail {
		padding-bottom: 10px;
		border-bottom: 1px dashed rgba(36, 36, 36, 0.4);
		margin-top: 10px;
	}
</style>