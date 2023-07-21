<template>
	<view class="box">
		<view class="top">
			<view class="flex">
				<view :class="[data.type===1?'selectType':'unselectType']" @click="choseType(1)">
					菜谱
				</view>

				<view style="margin-left:50rpx ;" :class="[data.type===2?'selectType':'unselectType']"
					@click="choseType(2)">
					饮食计划
				</view>
			</view>
			<view class="inputBox" v-if="data.type===1">
				<input type="text" @input="inputWrod" v-model="data.keyWrod">
				<image src="@/static/search.svg" mode="aspectFill" id="searchIcon">
				</image>
			</view>
			<view v-if="data.type===2" class="inputBox" style="background-color: #fff;">

			</view>
		</view>

		<!-- 菜谱 -->
		<template v-if="data.type===1">
			<view class="menuType">
				<view v-for="(item,index) in data.menuTypeList" :key="index"
					:class="[data.menuType===item.id?'selectMenuType':'unselectMenuType']"
					@click="choseMenuType(item.id)">
					{{item.name}}
				</view>
			</view>

			<scroll-view scroll-y="true" class="scrollList" style="height: calc(100vh - 320rpx);"
				@scrolltolower="loadMore" @refresherrefresh="refresherrefresh" refresher-enabled>
				<view class="item" v-for="(item,index) in data.data" :key="index" @click="jumpDetail(item)">
					<image :src="item.url" mode="aspectFill" style="height: 212rpx;width: 212rpx;border-radius: 16rpx;"
						lazy-load></image>
					<view class="itemName">
						<image src="@/static/star.svg" mode="aspectFill" style="height: 28rpx;width: 28rpx;"></image>
						<view class="">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="item" style="height: 212rpx;" v-if="data.data.length%3===2">
				</view>
			</scroll-view>
			<view style="position: fixed;bottom: 172rpx;right: 40rpx;">
				<image src="@/static/createMenu.svg" mode="aspectFill" style="width: 166rpx;height: 172rpx;"
					@click="jumpCreate"></image>
			</view>
		</template>


		<!-- 饮食计划 -->
		<template v-else>
			<view class="dayType">
				<view v-for="(item,index) in data.dayList" :key="index"
					:class="[data.day===index?'selectDayType':'unselectDayType']" @click="choseDayType(index)">
					<text v-if="index===0">今天</text>
					<text v-if="index===1">明天</text>
					<text v-if="index===2">后天</text>
				</view>
			</view>

			<!-- 午餐晚餐 -->
			<view class="planBox" v-if="data.item">
				<view class="plan">
					<image src="@/static/wucan.svg" mode="aspectFill" style="height: 28px;width: 58px;"></image>
					<view class="flex">
						<template v-for="(item,index) in data.lunchList" :key="index">
							{{item.name}} <text v-if="index<data.lunchList.length-1">/</text>

						</template>

						<image src="@/static/greenEdit.svg" mode="aspectFill"
							style="margin-left: 20px;width: 24px;height: 24px;" @click="jumpEdit('lunch')"></image>
					</view>
				</view>
				<view class="plan" style="margin-top: 24px;">
					<image src="@/static/wancan.svg" mode="aspectFill" style="height: 28px;width: 58px;"></image>
					<view class="flex">
						<template v-for="(item,index) in data.dinnerList" :key="index">
							{{item.name}}<text v-if="index<data.dinnerList.length-1">/</text>
						</template>

						<image src="@/static/greenEdit.svg" mode="aspectFill"
							style="margin-left: 20px;width: 24px;height: 24px;" @click="jumpEdit('dinner')"></image>
					</view>
				</view>
			</view>

			<!-- 食物清单 -->
			<view class="planBox">
				<view class="planTop">
					<image src="@/static/shoppingBag.svg" mode="aspectFill" style="height: 24px;width: 24px;"></image>
					<view style="margin-left: 6px;">
						食材清单
					</view>
				</view>

				<view class="foodList" v-if="data.item">
					<view :class="[it.name===data.foodName?'selectFood':'unselectFood']" style="margin-right: 16px;"
						v-for="(it,index) in data.allFood" :key="index" @click="choseFood(it)">
						{{it.name}}
					</view>
				</view>

				<view class="materialList">
					<view class="material" v-for="(item,index) in data.materialList" :key="index"
						@click="selectMaterial(item)">
						<view
							style="width: 18px;height: 18px;opacity: 0.2;border: 1px solid #242424;border-radius: 2px;margin-right: 10px;"
							:class="[item.has?'boxSelect':'']">
						</view>
						<view class="">
							{{item.name}}
						</view>

					</view>
				</view>
			</view>
		</template>

	</view>
</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";
	import { getDate } from "@/utils.js"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
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
		pageSize: 21,
		type: 1,
		menuType: "1",
		day: 0,
		dayList: [
		],
		item: null,
		foodName: "",
		materialList: [],
		dinnerList: [],
		lunchList: [],
		allFood: []
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
		if (e === 2) {
			init2()
		}
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


	function init2() : void {
		data.menuFun.getPlan().then(res => {
			data.dayList = res.data
			data.item = data.dayList[data.day]
			data.lunchList = data.item.lunch
			data.dinnerList = data.item.dinner
			data.allFood = []
			data.allFood = [...data.lunchList, ...data.dinnerList]

			console.log(data.lunchList, data.dinnerList);
			if (data.allFood.length != 0) {
				data.foodName = data.allFood[0].name
				data.materialList = data.allFood[0].materialList
			} else {
				data.foodName = ""
				data.materialList = []
			}
			// data.item.foodList.length != 0 ? data.foodName = data.item.foodList[0].name : ""
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

	function loadMore() : void {
		init()
	}


	function refresherrefresh() : void {
		data.page = 1
		data.data = []
		init()
	}

	function choseDayType(e : number) : void {
		data.day = e
		data.item = data.dayList[e]
		init2()
	}

	// 选择食物
	function choseFood(e : any) : void {
		data.foodName = e.name
		data.materialList = e.materialList
	}


	function jumpEdit(e : string) : void {
		uni.navigateTo({
			url: `./editFoodPlan?time=${e}&date=${data.day}`
		})
	}

	// 选择是否有食材
	function selectMaterial(e : any) : void {
		e.has ? e.has = false : e.has = true
		let type : string;
		data.lunchList.forEach(el => {
			console.log(el);
			if (el.name == data.foodName) {
				type = "lunch"
			}
		})
		data.dinnerList.forEach(el => {
			console.log(el);
			if (el.name == data.foodName) {
				type = "dinner"
			}
		})

		let list : any[] = [];

		if (type == 'dinner') {
			list = data.dinnerList
		} else if (type == 'lunch') {
			list = data.lunchList
		}
		data.menuFun.updataPlan({
			time: data.day,
			foodList: list,
			type: type
		}).then(() => {
		})
	}

	onLoad(() => {
		data.menuFun = uniCloud.importObject('menu')
	})


	onShow(() => {
		init()
		init2()
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
		margin-bottom: 52rpx;
	}

	.selectType {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 44rpx;
		color: #242424;
	}

	.unselectType {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 44rpx;
		color: rgba(36, 36, 36, 0.4);
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
		width: 212rpx;
		margin-bottom: 24rpx;
	}

	.itemName {
		display: flex;
		align-items: center;
	}

	.itemName view {
		width: 150rpx;
		font-style: normal;
		font-weight: 600;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #242424;
	}

	.scrollList>>>.uni-scroll-view-content {
		padding-bottom: 200rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.scrollList {
		/* height: calc(100vh - 300rpx); */
	}


	.scrollList>>>.uni-scroll-view-refresher {
		display: none;
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

	.dayType {
		margin-bottom: 20px;
		width: 353px;
		background: #FAFAFA;
		border-radius: 8px;
		display: flex;
		/* border: 1px solid #FAFAFA; */
		text-align: center;
		font-weight: 700;
		font-size: 14px;
	}

	.planList {
		width: 100%;
		height: 108px;
		border: 1px solid #242424;
		border-radius: 8px;
		padding: 16px 14px;
	}

	.selectDayType {
		padding: 8px 12px;
		gap: 10px;
		flex: 1;
		height: 40px;
		background: #DDFF80;
		color: #242424;
		border: 1px solid #242424;
		border-radius: 8px;
	}

	.unselectDayType {
		padding: 8px 12px;
		gap: 10px;
		flex: 1;
		height: 40px;
		background: #FAFAFA;
		border: 1px solid #FAFAFA;
		border-radius: 8px;
		color: rgba(36, 36, 36, 0.3);
	}

	.planBox {
		align-items: flex-start;
		padding: 16px 14px;
		width: 100%;
		border: 1px solid #242424;
		border-radius: 8px;
		color: #242424;
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 20px;
	}

	.plan {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.planTop {
		display: flex;
		align-items: center;
		font-weight: 600;
		font-size: 14px;
		color: #242424;
		border-bottom: 1px solid #EBEBEB;
		padding-bottom: 9px;
		margin-bottom: 16px;
	}

	.foodList {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-weight: 500;
		font-size: 12px;
	}

	.selectFood {
		padding: 7px 11px;
		height: 30px;
		background: #DDFF80;
		color: #242424;
		border: 1px solid #242424;
		border-radius: 4px;
	}

	.unselectFood {
		padding: 7px 11px;
		height: 30px;
		background: #FAFAFA;
		color: rgba(36, 36, 36, 0.3);
		border: 1px solid #FAFAFA;
		border-radius: 4px;
	}

	.material {
		height: 80rpx;
		width: 100%;
		padding: 10px 10px 10px 12px;
		background: #FAFAFA;
		border-radius: 8px;
		display: flex;
		margin-top: 10px;
		align-items: center;
	}

	.boxSelect {
		background-color: red;
	}
</style>