<template>
	<view class="box">
		<view class="searchBox">
			<input type="text" @input="inputWrod">
			<image src="@/static/search.svg" mode="aspectFill" id="searchIcon">
			</image>
		</view>

		<view class="menu">
			<view class="typeList">
				<view v-for="(item,index) in data.typeList" :key="index"
					:class="[data.type===item.id?'select':'unselect']" @click="choseType(item.id)">
					{{item.name}}
				</view>
			</view>
			<view class="menuList">
				<!-- 	<image class="img" :src="item.url" mode="aspectFill" v-for="(item,index) in data.data" :key="index">
				</image> -->
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
				<image class="img" src="../../static/demo1.svg" mode="aspectFill">
				</image>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from "vue";

	const data = reactive({
		keyWrod: "",
		typeList: [
			{ id: "0", name: "全部" },
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" }],
		type: "0",
		// data: [
		// 	{ id: "1", url: "@/static/demo1" },
		// 	{ id: "2", url: "@/static/demo1" },
		// 	{ id: "3", url: "@/static/demo1" },
		// 	{ id: "4", url: "@/static/demo1" },
		// 	{ id: "5", url: "@/static/demo1" }]
	})

	// 搜索框输入
	function inputWrod(e : any) : void {
		data.keyWrod = e.detail.value
	}

	// 选择类型
	function choseType(e : string) : void {
		data.type = e
	}
</script>

<style scoped>
	.box {
		padding: 58rpx 40rpx;
	}

	.searchBox {
		width: 100%;
		height: 88rpx;
		border: 2rpx solid #242424;
		border-radius: 24rpx;
		position: relative;
		margin-bottom: 48rpx;
	}

	#searchIcon {
		position: absolute;
		width: 46rpx;
		height: 46rpx;
		right: 22.74rpx;
		top: 20rpx;
	}

	input {
		position: absolute;
		top: 24rpx;
		left: 22.74rpx;
		font-size: 28rpx;
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