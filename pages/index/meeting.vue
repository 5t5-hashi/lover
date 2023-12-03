<template>
	<view>
		<nav>
			<view class="search">
				<input @blur="init" type="text" v-model="data.keyWord" placeholder="请输入地点" class="fs12"
					style="opacity: 0.2;">
				<image src="@/static/iconSearch.svg" mode="aspectFill" style="height: 20px;width: 20px;"></image>
			</view>
		</nav>
		<image class="add" @click="toCreate('play')" v-if="data.type==='play'" src="@/static/addPlay.svg"
			mode="aspectFill"></image>
		<image class="add" @click="toCreate('show')" v-else src="@/static/addShow.svg" mode="aspectFill"></image>
		<main class="">

			<view class="title">
				<view @click="changeType('play')" :class="[data.type==='play'?'select':'unselect']">
					游玩
				</view>
				<view style="width: 50rpx;">

				</view>
				<view @click="changeType('show')" :class="[data.type==='show'?'select':'unselect']">
					展览
				</view>
			</view>


			<scroll-view scroll-y="true" style="height: 300px;margin-top: 24px;" @scrolltolower="loadMore">
				<view class="item" v-for="(item,index) in data.list" :key="index">
					<image class="img" :src="item.cover" mode="aspectFill"></image>
					<view class="right">
						<view>
							<view class="flex name">
								<view style="width: 170px;" class="ellipsis">
									{{item.name}}
								</view>
								<uni-tooltip :content="item.remark" v-if="item.remark!=''">
									<image src="@/static/meetingRemark.svg" mode="aspectFill"
										style="height: 16px;width: 16px;">
									</image>
								</uni-tooltip>
								<!-- 	<image src="@/static/meetingRemark.svg" mode="aspectFill"
									style="height: 16px;width: 16px;">
								</image> -->
							</view>
							<view class="address flex">
								<image src="@/static/iconCart.svg" mode="aspectFill"
									style="width: 10px;height: 13px;margin-right: 6px;min-width: 10px;min-height: 13px;">
								</image>
								<view class="fs10">
									{{item.address}}
								</view>
							</view>
						</view>

						<view class="flex time">
							<view class="timeItem">
								{{item.date}}
							</view>
							<view v-if="item.day===3" class="timeItem">
								整周
							</view>
							<view v-if="item.day===2" class="timeItem">
								周末
							</view>
							<view v-if="item.day===1" class="timeItem">
								工作日
							</view>
							<view class="timeItem">
								{{item.time}}
							</view>
						</view>
					</view>
				</view>

			</scroll-view>
		</main>
	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref,
	} from "vue";

	import { getDate } from "@/utils.js"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";

	const data = reactive({
		keyWord: "",
		type: "play",
		api: null,
		list: []
	})

	// 切换目标,日程
	function changeType(type : string) : void {
		data.type = type
		init()
	}

	// 初始化
	function init() {
		data.api.getMeeting(data.type, data.keyWord).then(res => {
			// console.log(res.data);
			data.list = res.data
		})
	}


	// 加载更多
	function loadMore() {

	}

	// 跳转创建页面
	function toCreate(type : string) : void {
		uni.navigateTo({
			url: `/pages/index/createMeeting?type=${type}`
		})
	}

	onShow(() => {
		init()
	})

	onLoad(() => {
		data.api = uniCloud.importObject('meeting')
	})
</script>

<style scoped lang="less">
	@success: #C7FF02;

	@fail: #D06400;

	@black: #242424;

	nav {
		box-sizing: border-box;
		width: 100%;
		height: 154px;
		background-color: #D06400;
		position: relative;
		background-image: url("@/static/meetingBg.svg");
	}

	main {
		padding: 20px;
		border-radius: 20px 20px 0px 0px;
		background: #fff;
		position: absolute;
		top: 134px;
		width: 100%;
		box-sizing: border-box;
	}

	.search {
		display: flex;
		width: 173px;
		height: 40px;
		padding: 10px 12px;
		justify-content: space-between;
		align-items: center;
		border-radius: 12px;
		border: 1px solid #fff;
		background: rgba(250, 250, 250, 0.80);
		position: absolute;
		right: 20px;
		bottom: 33px;
		font-size: 12px;
	}

	.title {
		display: flex;
		justify-content: center;
	}

	.select {
		color: #242424;
		font-size: 18px;
		font-weight: 600;
		position: relative;
	}

	.select::after {
		content: "";
		position: absolute;
		width: 36px;
		height: 2px;
		background-color: #13DDE2;
		left: 1px;
		bottom: -2px;
	}

	.unselect {
		color: #242424;
		font-size: 18px;
		font-weight: 600;
		opacity: 0.4;
	}

	.item {
		width: 100%;
		height: 111px;
		display: flex;
		padding: 12px;
		align-items: center;
		border-radius: 8px;
		background: #FAFAFA;
		margin-top: 18px;
	}

	.img {
		width: 120px;
		height: 87px;
		min-width: 120px;
		min-height: 87px;
		border-radius: 8px;
		margin-right: 10px;
	}

	.name {
		color: @black;
		font-size: 14px;
		font-weight: 600;
		width: 100%;
		justify-content: space-between;
	}

	.address {
		align-items: flex-start;
		margin-top: 6px;
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.time {
		display: flex;
		flex-wrap: wrap;
		font-size: 8px;

	}

	.timeItem {
		display: flex;
		padding: 4px 6px;
		border-radius: 8px;
		background: #EFEFEF;
		color: @black;
		font-size: 8px;
		font-weight: 600;
		margin-right: 6px;
		margin-bottom: 5px;
	}

	.add {
		width: 87px;
		height: 89px;
		position: absolute;
		z-index: 9;
		right: 24px;
		bottom: 94px;
	}
</style>