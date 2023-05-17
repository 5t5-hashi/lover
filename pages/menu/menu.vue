<template>
	<view class="box">
		<view class="top">
			<view class="flex">
				<view :class="[data.type===1?'selectType':'unselectType']" @click="choseType(1)">
					菜谱
				</view>

				<view style="margin-left:25px ;" :class="[data.type===2?'selectType':'unselectType']"
					@click="choseType(2)">
					饮食计划
				</view>
			</view>
			<view class="inputBox">
				<input type="text" @input="inputWrod" v-model="data.keyWrod">
				<image src="@/static/search.svg" mode="aspectFill" id="searchIcon">
				</image>
			</view>
		</view>

		<view class="menuType">
			<view v-for="(item,index) in data.menuTypeList" :key="index"
				:class="[data.menuType===item.id?'selectMenuType':'unselectMenuType']" @click="choseMenuType(item.id)">
				{{item.name}}
			</view>
		</view>

		<view style="padding-bottom: 100px;display: flex;justify-content: space-between;flex-wrap: wrap;">
			<view class="item" v-for="(item,index) in data.data" :key="index" @click="jumpDetail(item)">
				<image :src="item.url" mode="aspectFill" style="height: 106px;width: 106px;border-radius: 8px;"></image>
				<view class="itemName">
					<image src="@/static/star.svg" mode="aspectFill" style="height: 14px;width: 14px;"></image>
					<view class="">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="item" style="height: 106px;" v-if="data.data.length%3===2">
			</view>
			<view class="" @click="init">
				更多
			</view>


		</view>
		<view style="position: fixed;bottom: 86px;right: 20px;">
			<image src="@/static/createFood.svg" mode="aspectFill" style="width: 88px;height: 84px;"
				@click="jumpCreate"></image>
		</view>

	</view>
</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";

	const data = reactive({
		keyWrod: "",
		menuTypeList: [
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" },
			{ id: "7", name: "汤" }],
		menuFun: null,
		data: [],
		page: 1,
		pageSize: 20,
		type: 1,
		menuType: "1"
	})

	// 搜索框输入
	function inputWrod(e : any) : void {
		data.keyWrod = e.detail.value
		data.page = 1
		data.data = []
		init()
	}

	// 选择类型
	function choseType(e : number) : void {
		data.type = e
	}

	// 选择菜单类型
	function choseMenuType(e : string) : void {
		data.menuType = e
		data.page = 1
		data.data = []
		init()
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

	// 跳转详情
	function jumpDetail(e : any) : void {
		uni.navigateTo({
			url: `./foodDetail?id=${e._id}`
		})
	}

	function jumpCreate() : void {
		uni.navigateTo({
			url: `./createFood`
		})
	}



	onMounted(() => {
		data.menuFun = uniCloud.importObject('menu')
		init()
	})
</script>

<style scoped>
	.box {
		padding: 58rpx 40rpx;
		position: relative;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 26px;
	}

	.selectType {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 22px;
		color: #242424;
	}

	.unselectType {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 22px;
		color: rgba(36, 36, 36, 0.4);
	}

	.inputBox {
		width: 159px;
		height: 40px;
		background: #FAFAFA;
		border-radius: 8px;
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
		left: 18px;
		width: 90px;
		font-size: 28rpx;
	}

	.menuType {
		display: flex;
		align-items: center;
		/* width: 353px; */
		height: 40px;
		background: #F8F8F8;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.selectMenuType {
		padding: 8px 10px;
		background: #DDFF80;
		border: 1px solid #242424;
		border-radius: 8px;
		flex: none;
		/* flex-grow: 1; */
		font-weight: 600;
		font-size: 14px;
		color: #242424;
	}

	.unselectMenuType {
		padding: 8px 10px;
		background: #F8F8F8;
		border: 1px solid #F8F8F8;
		border-radius: 8px;
		flex: none;
		/* flex-grow: 1; */
		font-weight: 600;
		font-size: 14px;
		color: rgba(36, 36, 36, 0.3);
	}

	.item {
		width: 106px;
		margin-bottom: 12px;
	}

	.itemName {
		display: flex;
		align-items: center;
	}

	.itemName view {
		width: 75px;
		font-style: normal;
		font-weight: 600;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #242424;
	}











	.menu {
		width: 100%;
		display: flex;
	}

	.select {
		padding: 16rpx 24rpx;
		background: linear-gradient(180deg, #F7FFD9 0%, rgba(252, 255, 243, 0) 100%);
		border: 2rpx solid #C7E94E;
		border-radius: 16rpx;
		text-align: center;
		font-weight: 600;
		font-size: 28rpx;
		margin-bottom: 24rpx;
		color: #242424;
	}

	.unselect {
		padding: 16rpx 24rpx;
		background: #FCFEF4;
		border: 2rpx solid #fff;
		border-radius: 16rpx;
		font-size: 28rpx;
		margin-bottom: 24rpx;
		color: #DDE8BA;
	}

	.menuList {
		padding: 0 0 0 74rpx;
		height: calc(100vh - 300rpx);
		flex: 1;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		overflow-y: scroll;
	}

	.img {
		width: 220rpx;
		height: 220rpx;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
		margin-bottom: 30rpx;
	}
</style>