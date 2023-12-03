<template>
	<view class="box">
		<view class="top">
			<view class="flex">
				<image src="@/static/iconBack.svg" @click="back" style="width: 20rpx;height: 20rpx;margin-right: 16rpx;"
					mode="aspectFill"></image>
				<view class="fw7 fs16">
					添加{{data.timeIndex===0?'早':data.timeIndex===1?'午':'晚'}}餐
				</view>
				<view class="fs16" style="margin-left: 16rpx;">
					{{data.dayIndex===0?'今':data.dayIndex===1?'明':'后'}}天
				</view>
			</view>
			<view class="inputBox fs12">
				<input type="text" @input="inputWrod" v-model="data.keyWrod" placeholder="输入食材或菜名">
				<image src="@/static/iconSearch.svg" mode="aspectFill" id="searchIcon">
				</image>
			</view>
		</view>

		<view class="menuType">
			<view v-for="(item,index) in data.menuTypeList" :key="index"
				:class="[data.menuType===item.id?'selectMenuType':'unselectMenuType']" @click="choseMenuType(item.id)">
				{{item.name}}
			</view>
		</view>

		<scroll-view scroll-y="true" class="scrollList" style="height: calc(100vh - 390rpx);" @scrolltolower="loadMore"
			refresher-enabled>
			<view class="item" v-for="(item,index) in data.data" :key="index" @click="addList(item)">
				<view class="flex">
					<image :src="item.url" mode="aspectFill" style="width: 80rpx;height: 80rpx;border-radius: 16rpx;"
						lazy-load></image>
					<view class="itemName">
						{{item.name}}
					</view>
				</view>
				<image src="@/static/iconRight.svg" mode="aspectFill" style="height: 20rpx;width: 20rpx;"></image>
			</view>

		</scroll-view>

		<view class="bottom" @click="showPop">
			<view class="flex">
				<image v-if="data.timeIndex===0" src="@/static/breakfast.svg" mode="aspectFill"
					style="width: 34rpx;height: 32rpx;margin-right: 12rpx;">
				</image>
				<image v-if="data.timeIndex===1" src="@/static/dinner.svg" mode="aspectFill"
					style="width: 34rpx;height: 32rpx;margin-right: 12rpx;">
				</image>
				<image v-if="data.timeIndex===2" src="@/static/lunch.svg" mode="aspectFill"
					style="width: 34rpx;height: 32rpx;margin-right: 12rpx;">
				</image>
				<view class="o" v-if="data.list.length!=0">

				</view>
				<view class="fs13">
					{{data.list.length}}种食物
				</view>
			</view>

			<view @click.stop="add" :class="[data.list.length===0?'hasFoodComplate':'noFoodComplate']">
				完成
			</view>
		</view>

		<uni-popup ref="popup">
			<view class="popBox">
				<view class="popTop">
					<strong>
						已选({{data.list.length}})
					</strong>
					<view @click="data.list=[]">
						清空
					</view>
				</view>

				<view class="carFood" v-for="(item,index) in data.list" :key="index">
					<view class="flex">
						<image :src="item.url" mode="aspectFill"
							style="width: 80rpx;height: 80rpx;border-radius: 16rpx;">
						</image>
						<view class="itemName">
							{{item.name}}
						</view>
					</view>
					<image @click="deleteFood(index)" src="@/static/deletePlanFood.svg" mode="aspectFill"
						style="height: 40rpx;width: 40rpx;">
					</image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import { reactive, ref } from "vue";
	import { getDate } from "../../utils";

	const data = reactive({
		menuFun: null,
		keyWrod: "",
		page: 1,
		pageSize: 21,
		menuType: "1",
		menuTypeList: [
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" },
			{ id: "7", name: "汤" }],
		dayIndex: 0,
		timeIndex: 0,
		data: null,
		list: [],
		plan: null
	})


	const popup = ref()

	// 初始化
	function init() : void {
		data.menuFun.getList(data.keyWrod, data.menuType, data.page, data.pageSize).then(res => {
			console.log(res);
			if (res.data.length != 0) {
				data.data = [...data.data, ...res.data]
				data.page = data.page + 1
			}
		})
	}

	// 模糊搜索
	function inputWrod(e : any) : void {
		data.keyWrod = e.detail.value
		data.page = 1
		data.data = []
		init()
	}

	// 返回
	function back() : void {
		uni.navigateBack()
	}

	// 选择菜单类型
	function choseMenuType(e : string) : void {
		data.menuType = e
		data.page = 1
		data.data = []
		init()
	}

	// 打开弹窗
	function showPop() {
		popup.value.open('bottom')
	}


	// 加入车
	function addList(e : any) : void {
		data.list.push(e)
	}

	// 删除
	function deleteFood(index : number) {
		data.list.splice(index, 1)
	}

	function loadMore() : void {
		init()
	}

	// 添加计划
	function add() : void {
		if (data.list.length === 0) {
			return
		}
		console.log(data.plan);
		let list : any[] = []
		if (data.timeIndex === 0) {
			list = data.plan.breakfast
		} else if (data.timeIndex === 1) {
			list = data.plan.dinner
		} else if (data.timeIndex === 2) {
			list = data.plan.lunch
		}

		list = [...list, ...data.list]
		data.menuFun.updatePlan(data.plan._id, data.timeIndex, list).then(res => {
			uni.navigateBack()
		})
	}


	onLoad((options) => {
		data.menuFun = uniCloud.importObject('menu')
		console.log(options);
		data.dayIndex = parseInt(options.dayIndex)
		data.timeIndex = parseInt(options.timeIndex)
		init()
		data.menuFun.getPlan(getDate(data.dayIndex, 10)).then(res => {
			data.plan = res.data
		})

	})
</script>

<style scoped>
	.box {
		padding: 40rpx;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 52rpx;
		padding: 40rpx;
		padding-left: 0rpx;
	}

	.inputBox {
		width: 318rpx;
		height: 80rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
		position: relative;
	}

	#searchIcon {
		position: absolute;
		width: 46rpx;
		height: 46rpx;
		right: 22.74rpx;
		top: 16rpx;
	}

	input {
		position: absolute;
		top: 18rpx;
		left: 36rpx;
		width: 180rpx;
		font-size: 28rpx;
	}

	.menuType {
		display: flex;
		align-items: center;
		/* width: 706rpx; */
		height: 80rpx;
		background: #F8F8F8;
		border-radius: 16rpx;
		margin-bottom: 40rpx;
	}

	.selectMenuType {
		padding: 16rpx 20rpx;
		background: #DDFF80;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		flex: none;
		/* flex-grow: 1; */
		font-weight: 600;
		font-size: 28rpx;
		color: #242424;
	}

	.unselectMenuType {
		padding: 16rpx 20rpx;
		background: #F8F8F8;
		border: 2rpx solid #F8F8F8;
		border-radius: 16rpx;
		flex: none;
		/* flex-grow: 1; */
		font-weight: 600;
		font-size: 28rpx;
		color: rgba(36, 36, 36, 0.3);
	}

	.item {
		width: 100%;
		border-radius: 16rpx;
		height: 136rpx;
		margin-bottom: 20rpx;
		display: flex;
		padding: 28rpx 40rpx 28rpx 28rpx;
		align-items: center;
		justify-content: space-between;
		background-color: #FAFAFA;
	}

	.itemName {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
	}

	.bottom {
		position: fixed;
		padding: 24rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 128rpx;
		border: 2rpx solid#C7FF02;
		background: #FBFFED;
		bottom: 64rpx;
		left: 106rpx;
		right: 106rpx;
		height: 118rpx;
		z-index: 999;
	}

	.hasFoodComplate {
		padding: 16rpx 40rpx;
		opacity: 0.4;
		font-size: 28rpx;
		font-weight: 700;
	}

	.noFoodComplate {
		padding: 16rpx 40rpx;
		border-radius: 128rpx;
		background: #C7FF02;
		font-size: 28rpx;
	}

	.popBox {
		padding: 40rpx;
		height: 694rpx;
		width: 100%;
		padding: 40rpx;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		background: #FFF;
	}

	.popTop {
		font-size: 28rpx;
		display: flex;
		justify-content: space-between;
	}

	.o {
		width: 12rpx;
		height: 12rpx;
		border-radius: 6rpx;
		background-color: #C7FF02;
		position: relative;
		left: -10rpx;
		top: -20rpx;
	}

	.carFood {
		margin-top: 24rpx;
		display: flex;
		padding: 28rpx 40rpx 28rpx 28rpx;
		justify-content: space-between;
		align-items: center;
		border-radius: 16rpx;
		background: #FAFAFA;
	}
</style>