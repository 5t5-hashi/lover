<template>
	<view class="box">
		<view class="top">
			<view style="width: 100%;padding-bottom: 16rpx;border-bottom: #EBEBEB 2rpx solid;margin-bottom: 32rpx;">
				<image src="@/static/wucan.svg" mode="aspectFill" style="height: 56rpx;width: 116rpx;"
					v-if="data.time==='lunch'"></image>
				<image src="@/static/wancan.svg" mode="aspectFill" style="height: 56rpx;width: 116rpx;"
					v-if="data.time==='dinner'"></image>
			</view>

			<view v-for="(item,index) in data.list" :key="index" class="food" style="margin-bottom: 20rpx;">
				<view class="">
					{{item.name}}
				</view>
				<image src="@/static/menuPlanDelete.svg" mode="aspectFill" style="height: 48rpx;width: 48rpx;"
					@click="deleteFromList(index)"></image>
			</view>
		</view>

		<view style="width: 100%;display: flex;background: #FAFAFA;border-radius: 16rpx;margin: 40rpx 0;">
			<view :class="[data.type1==='0'?'selectChoseType':'unselectChoseType']" @click="chose1('0')">
				菜单
			</view>
			<view :class="[data.type1==='1'?'selectChoseType':'unselectChoseType']" @click="chose1('1')">
				随机
			</view>
		</view>

		<view class="inputBox">
			<input type="text" @input="inputWrod" v-model="data.keyWrod" placeholder="输入菜名"
				placeholder-class="placeholder">
			<image src="@/static/search.svg" mode="aspectFill" id="searchIcon">
			</image>
		</view>

		<view class="menu">
			<view class="menuLeft">
				<view v-for="(item,index) in data.menuTypeList" :key="index"
					style="margin-bottom: 40rpx;text-align: center;"
					:class="[data.menuType===item.id?'selectMenuType':'unselectMenuType']"
					@click="choseMenuType(item.id)">
					{{item.name}}
				</view>
			</view>
			<scroll-view style="height: calc(100vh - 600rpx);width: 540rpx;" scroll-y="true" @scrolltolower="init">
				<view v-for="(item,index) in data.data" :key="index" class="food">
					<view class="">
						{{item.name}}
					</view>
					<image src="@/static/menuPlanAdd.svg" mode="aspectFill" style="height: 48rpx;width: 48rpx;"
						@click="addToList(item)"></image>
				</view>
			</scroll-view>

		</view>
		<view class="bottom">
			<view class="button" @click="upload">
				上传
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import { reactive } from "vue";

	const data = reactive({
		time: "",
		menuFun: null,
		itemList: [],
		type1: "0",
		keyWrod: "",
		page: 1,
		pageSize: 21,
		data: [],
		menuType: "1",
		menuTypeList: [
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" },
			{ id: "7", name: "汤" }],
		list: [],
		date: ""

	})

	// 菜单选择还是随机选择
	function chose1(e : string) : void {
		data.type1 = e
	}


	// 初始化
	function init() : void {
		data.menuFun.getList(data.keyWrod, data.menuType, data.page, data.pageSize).then(res => {
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

	// 选择菜单类型
	function choseMenuType(e : string) : void {
		data.menuType = e
		data.page = 1
		data.data = []
		init()
	}

	// 菜品添加到待上传列表中
	function addToList(e : any) : void {
		data.list.push(e)
	}

	// 从待上传的列表中删除
	function deleteFromList(e : number) : void {
		data.list.splice(e, 1)
	}

	function upload() : void {
		let foodList : any = [];
		data.list.forEach(e => {
			foodList.push({ name: e.name, materialList: e.materialList })
		})
		for (let i = 0; i < foodList.length; i++) {
			for (let j = 0; j < foodList[i].materialList.length; j++) {
				foodList[i].materialList[j].has = false
			}
		}
		console.log(foodList);

		data.menuFun.updataPlan({
			time: data.date,
			foodList: foodList,
			type: data.time
		}).then(() => {
			uni.navigateBack()
		})
	}

	onLoad((options) => {
		data.menuFun = uniCloud.importObject('menu')
		data.time = options.time
		data.date = options.date
		init()
	})
</script>

<style scoped>
	.box {
		padding: 64rpx 40rpx 0 40rpx;
	}

	.top {
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		width: 100%;
		padding: 28rpx;
	}

	.selectChoseType {
		flex: 1;
		height: 80rpx;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 80rpx;
		text-align: center;
		color: #242424;
		background: #DDFF80;
		border: 2rpx solid #242424;
		border-radius: 16rpx;

	}

	.unselectChoseType {
		flex: 1;
		height: 80rpx;
		font-weight: 600;
		font-size: 28rpx;
		line-height: 80rpx;
		text-align: center;
		color: rgba(36, 36, 36, 0.3);
		background: #FAFAFA;
		border: 2rpx solid #FAFAFA;
		border-radius: 16rpx;
	}

	.search {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 24rpx;
		height: 72rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
	}

	.inputBox {
		width: 100%;
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
		width: 70%;
		font-size: 28rpx;
	}

	.placeholder {
		color: #242424;
		font-size: 28rpx;
		opacity: 0.2;
	}

	.menu {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-top: 40rpx;
	}

	.menuLeft {
		width: 108rpx;
	}



	.selectMenuType {
		padding: 16rpx 24rpx;
		width: 108rpx;
		height: 70rpx;
		background: #DDFF80;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		font-weight: 600;
		font-size: 28rpx;
		text-align: right;
		color: #242424;
	}

	.unselectMenuType {
		padding: 16rpx 24rpx;
		width: 108rpx;
		height: 70rpx;
		background: #FAFAFA;
		border: 2rpx solid #FAFAFA;
		border-radius: 16rpx;
		font-weight: 600;
		font-size: 28rpx;
		text-align: right;
		color: #B9B9B9;
	}

	.food {
		display: flex;
		justify-content: space-between;
		height: 88rpx;
		width: 100%;
		margin-bottom: 2rpx;
		background: #FAFAFA;
		align-items: center;
		padding: 20rpx 24rpx;
		border-radius: 8px;
		font-weight: 600;
	}

	.bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 34rpx;
	}

	.button {
		width: 100%;
		text-align: center;
		height: 112rpx;
		line-height: 112rpx;
		font-weight: 600;
		font-size: 32rpx;
		background: #DDFF80;
		border: 1px solid #242424;
		border-radius: 12px;
	}
</style>