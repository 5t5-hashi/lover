<template>
	<view class="box">
		<view class="searchBox">
			<input type="text" @input="inputWrod" v-model="data.keyWrod">
			<image src="@/static/search.svg" mode="aspectFill" id="searchIcon">
			</image>
		</view>

		<view style="padding-bottom: 100px;">
			<view class="" v-for="(item,index) in data.data">
				{{item.name}}
			</view>
			<view class="" @click="init">
				更多
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";

	const data = reactive({
		keyWrod: "",
		typeList: [
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" },
			{ id: "7", name: "汤" }],
		type: "0",
		menuFun: null,
		data: [],
		page: 1,
		pageSize: 20
	})

	// 搜索框输入
	function inputWrod(e : any) : void {
		data.keyWrod = e.detail.value
		data.page = 1
		data.data = []
		init()
	}

	// 选择类型
	function choseType(e : string) : void {
		data.type = e
	}

	// 初始化
	function init() : void {
		data.menuFun.getList(data.keyWrod, data.page, data.pageSize).then(res => {
			if (res.data.length != 0) {
				data.data = [...data.data, ...res.data]
				data.page = data.page + 1
			}

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