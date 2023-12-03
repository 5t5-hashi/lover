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
			<view class="inputBox fs12" v-if="data.type===1">
				<input type="text" @input="inputWrod" v-model="data.keyWrod" placeholder="输入食材或菜名">
				<image src="@/static/iconSearch.svg" mode="aspectFill" id="searchIcon">
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

			<scroll-view scroll-y="true" class="scrollList" style="height: calc(100vh - 420rpx);"
				@scrolltolower="loadMore" @refresherrefresh="refresherrefresh" refresher-enabled>
				<view class="item" v-for="(item,index) in data.data" :key="index" @click="jumpDetail(item)">
					<view class="flex">
						<image :src="item.url" mode="aspectFill"
							style="width: 80rpx;height: 80rpx;border-radius: 16rpx;" lazy-load></image>
						<view class="itemName">
							{{item.name}}
						</view>
					</view>
					<image src="@/static/iconRight.svg" mode="aspectFill" style="height: 20rpx;width: 20rpx;"></image>
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
				<view :class="[data.dayIndex===0?'selectDayType':'unselectDayType']" @click="choseDayType(0)">
					<text>今天</text>
				</view>
				<view :class="[data.dayIndex===1?'selectDayType':'unselectDayType']" @click="choseDayType(1)">
					<text>明天</text>
				</view>
				<view :class="[data.dayIndex===2?'selectDayType':'unselectDayType']" @click="choseDayType(2)">
					<text>后天</text>
				</view>
			</view>


			<!-- 早饭 -->
			<view class="foodList" v-if="data.item.breakfast.length!=0">
				<view class="flex">
					<image src="@/static/breakfast.svg" mode="aspectFill"
						style="width: 34rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="fs13 fw7">
						早餐
					</view>
				</view>
				<view class="planFood" v-for="(item,index) in data.item.breakfast" :key="index">
					<view class="flex">
						<image :src="item.url" mode="aspectFill"
							style="width: 80rpx;height: 80rpx;border-radius: 16rpx;">
						</image>
						<view class="itemName">
							{{item.name}}
						</view>
					</view>
					<image @click="deletePlanFood(0,index)" src="@/static/deletePlanFood.svg" mode="aspectFill"
						style="height: 40rpx;width: 40rpx;">
					</image>
				</view>
			</view>

			<!-- 午饭 -->
			<view class="foodList" v-if="data.item.dinner.length!=0">
				<view class="flex">
					<image src="@/static/dinner.svg" mode="aspectFill"
						style="width: 34rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="fs13 fw7">
						午餐
					</view>
				</view>
				<view class="planFood" v-for="(item,index) in data.item.dinner" :key="index">
					<view class="flex">
						<image :src="item.url" mode="aspectFill"
							style="width: 80rpx;height: 80rpx;border-radius: 16rpx;">
						</image>
						<view class="itemName">
							{{item.name}}
						</view>
					</view>
					<image @click="deletePlanFood(1,index)" src="@/static/deletePlanFood.svg" mode="aspectFill"
						style="height: 40rpx;width: 40rpx;">
					</image>
				</view>
			</view>

			<!-- 晚饭 -->
			<view class="foodList" v-if="data.item.lunch.length!=0">
				<view class="flex">
					<image src="@/static/lunch.svg" mode="aspectFill"
						style="width: 34rpx;height: 32rpx;margin-right: 12rpx;"></image>
					<view class="fs13 fw7">
						晚餐
					</view>
				</view>
				<view class="planFood" v-for="(item,index) in data.item.lunch" :key="index">
					<view class="flex">
						<image :src="item.url" mode="aspectFill"
							style="width: 80rpx;height: 80rpx;border-radius: 16rpx;">
						</image>
						<view class="itemName">
							{{item.name}}
						</view>
					</view>
					<image @click="deletePlanFood(2,index)" src="@/static/deletePlanFood.svg" mode="aspectFill"
						style="height: 40rpx;width: 40rpx;">
					</image>
				</view>
			</view>

			<view class="createPlanButton">
				<view class="createPlanButtonItem" @click="toCreatePlan(0)">
					<image src="@/static/breakfast.svg" mode="aspectFill" class="createPlanIcon"></image>
					<view>
						+早餐
					</view>
				</view>
				<view class="createPlanButtonItem" @click="toCreatePlan(1)">
					<image src="@/static/dinner.svg" mode="aspectFill" class="createPlanIcon"></image>
					<view>
						+午餐
					</view>
				</view>
				<view class="createPlanButtonItem" @click="toCreatePlan(2)">
					<image src="@/static/lunch.svg" mode="aspectFill" class="createPlanIcon"></image>
					<view>
						+晚餐
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
		dayIndex: 0,
		dayList: [
			0, 1, 2
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
		data.menuFun.getPlan(getDate(data.dayIndex, 10)).then(res => {
			console.log(res.data);
			data.item = res.data
		})
	}

	// 跳转详情
	function jumpDetail(e : any) : void {
		uni.navigateTo({
			url: `./foodDetail?id=${e._id}&from=menu`
		})
	}

	// 跳转添加饮食计划页面
	function toCreatePlan(type : number) : void {
		uni.navigateTo({
			url: `/pages/menu/editFoodPlan?timeIndex=${type}&dayIndex=${data.dayIndex}`
		})
	}


	// 删除饮食计划中某一项
	function deletePlanFood(type : number, index : number) : void {
		console.log(type, index);
		let list : any[] = []
		if (type === 0) {
			list = data.item.breakfast
		} else if (type === 1) {
			list = data.item.dinner
		} else if (type === 2) {
			list = data.item.lunch
		}

		list.splice(index, 1)
		data.menuFun.updatePlan(data.item._id, type, list).then(res => {
			data.item = res.data
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

	// 选择日期
	function choseDayType(e : number) : void {
		data.dayIndex = e
		init2()
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
		margin-bottom: 40rpx;
		width: 706rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
		display: flex;
		/* border: 2rpx solid #FAFAFA; */
		text-align: center;
		font-weight: 700;
		font-size: 28rpx;
	}

	.planList {
		width: 100%;
		height: 216rpx;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		padding: 32rpx 28rpx;
	}

	.selectDayType {
		padding: 16rpx 24rpx;
		gap: 20rpx;
		flex: 1;
		height: 80rpx;
		background: #DDFF80;
		color: #242424;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
	}

	.unselectDayType {
		padding: 16rpx 24rpx;
		gap: 20rpx;
		flex: 1;
		height: 80rpx;
		background: #FAFAFA;
		border: 2rpx solid #FAFAFA;
		border-radius: 16rpx;
		color: rgba(36, 36, 36, 0.3);
	}

	.planBox {
		align-items: flex-start;
		padding: 32rpx 28rpx;
		width: 100%;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		color: #242424;
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 40rpx;
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
		font-size: 28rpx;
		color: #242424;
		border-bottom: 2rpx solid #EBEBEB;
		padding-bottom: 18rpx;
		margin-bottom: 32rpx;
	}



	.selectFood {
		padding: 14rpx 22rpx;
		height: 60rpx;
		background: #DDFF80;
		color: #242424;
		border: 2rpx solid #242424;
		border-radius: 8rpx;
	}

	.unselectFood {
		padding: 14rpx 22rpx;
		height: 60rpx;
		background: #FAFAFA;
		color: rgba(36, 36, 36, 0.3);
		border: 2rpx solid #FAFAFA;
		border-radius: 8rpx;
	}

	.material {
		height: 80rpx;
		width: 100%;
		padding: 20rpx 20rpx 20rpx 24rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
		display: flex;
		margin-top: 20rpx;
		align-items: center;
	}

	.boxSelect {
		background-color: red;
	}

	.foodList {
		width: 100%;
		padding: 32rpx 28rpx;
		border-radius: 24rpx;
		background: #FAFAFA;
		margin-bottom: 36rpx;
	}

	.planFood {
		margin-top: 20rpx;
		display: flex;
		padding: 28rpx 40rpx 28rpx 28rpx;
		justify-content: space-between;
		align-items: center;
		border-radius: 16rpx;
		background: #FFF;
	}

	.createPlanButton {
		display: flex;
		padding: 24rpx 64rpx;
		justify-content: space-between;
		align-items: center;
		border-radius: 146rpx;
		border: 2rpx solid #C7FF02;
		background: #FBFFED;
		font-size: 22rpx;
		position: fixed;
		left: 78rpx;
		right: 76rpx;
		bottom: 184rpx;
	}

	.createPlanButtonItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.createPlanIcon {
		width: 44rpx;
		height: 42rpx;
		margin-bottom: 8rpx;
	}
</style>