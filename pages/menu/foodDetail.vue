<template>
	<scroll-view class="box" style="padding-top:0;" v-if="data.data" scroll-y @scroll="scroll">
		<view class="show" :style="{opacity:data.opacity }">
			<image :src="data.data.url" mode="aspectFill" style="width: 100%;height: 100%;"></image>

		</view>

		<!-- 内容部分 -->
		<view class="content">
			<view class="foodName">
				<view class="flex">
					<view class="type">
						{{data.data.typeName}}
					</view>
					<view class="fs20 fw6 c24">
						{{data.data.name}}
					</view>
				</view>
				<image src="@/static/foodEdit.svg" mode="aspectFill" style="width: 134.5px;
height: 49.5px;position: absolute;right: 0;top: 0;" @click="jumpEdit"></image>

			</view>

			<view class="fs16 c24 fw6" style="position: relative;">
				食材清单
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="dosage">
				<nav>主要原料</nav>
				<view v-for="(item,index) in data.data.materialList" :key="index" class="flex fs14 fw5"
					style="width: 100%;justify-content: space-between;height: 64rpx;">
					<view class="c24">
						{{item.name}}
					</view>
					<view>
						{{item.dosage}}
					</view>
				</view>
				<nav style="margin-top: 16px;">主要辅料</nav>
				<view v-for="(item,index) in data.data.ingredientsList" :key="index" class="flex fs14 fw5"
					style="width: 100%;justify-content: space-between;height: 64rpx;">
					<view class="c24">
						{{item.name}}
					</view>
					<view>
						{{item.dosage}}
					</view>
				</view>
			</view>

			<view class="fs16 c24 fw6" style="position: relative;">
				制作步骤
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="step">
				<view class="stepDetail" v-for="(item,index) in data.data.step" :key="index">
					<view class="c24 fs14 fw7" style="margin-bottom: 20rpx;">
						<text style="display: inline-block;">步骤{{index+1}}</text>
					</view>
					<view class="fs14 fw3 c24" v-html="item">
					</view>
				</view>
			</view>
		</view>
		<view class="bottom" v-if="data.from==='menu'">
			<view class="bottomButton" @click="openAddPlan">
				+饮食记录
			</view>
		</view>

		<uni-popup ref="popup" @change="change">
			<view class="popBox">
				<view class="flex">
					<view class="selectItem">
						<image src="@/static/breakfast.svg" mode="aspectFill" class="img"></image>
						<view class="selectText">
							<picker @change="choseTime" :value="data.timeIndex" :range="data.timeList">
								<view class="uni-input">{{data.timeList[data.timeIndex]}}</view>
							</picker>
						</view>
						<image src="@/static/addPlanSelect.svg" mode="aspectFill" style="height: 15px;width: 15px;">
						</image>
					</view>
					<view class="selectItem">
						<view class="selectText">
							<view class="selectText">
								<picker @change="choseDay" :value="data.dayIndex" :range="data.dayList">
									<view class="uni-input">{{data.dayList[data.dayIndex]}}</view>
								</picker>
							</view>
						</view>
						<image src="@/static/addPlanSelect.svg" mode="aspectFill" style="height: 15px;width: 15px;">
						</image>
					</view>
				</view>

				<view class="food" v-for="(item,index) in data.planList" :key="index">
					<image :src="item.url" mode="aspectFill"
						style="height: 40px;width: 40px;border-radius: 6px;margin-right: 10px;">
					</image>
					<view class="">
						{{item.name}}
					</view>
				</view>

				<view class="popBottom">
					<view class="popBottomButton" style="margin-right: 12px;" @click="cancel">
						取消
					</view>
					<view class="popBottomButton" style="background-color: #DDFF80;" @click="sureAddPlan">
						确定
					</view>
				</view>

			</view>
		</uni-popup>
	</scroll-view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref
	} from "vue";
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";

	import { getDate } from "@/utils.js"


	const popup = ref()

	const data = reactive({
		menuFun: null,
		data: null,
		opacity: 1,
		dom: null,
		id: null,
		from: "",
		dayList: ["今天", "明天", "后天"],
		dayIndex: 0,
		timeIndex: 0,
		timeList: ["早饭", "午饭", "晚饭"],
		planList: [],
		plan: null
	})

	// 添加计划选择饭点
	function choseTime(e : any) {
		data.timeIndex = e.detail.value
		if (data.timeIndex === 0) {
			data.planList = data.plan.breakfast
		} else if (data.timeIndex === 1) {
			data.planList = data.plan.dinner
		} else if (data.timeIndex === 2) {
			data.planList = data.plan.lunch
		}
	}

	// 添加计划选择日期
	function choseDay(e : any) {
		data.dayIndex = e.detail.value
		getPlan()
	}


	// 取消添加计划
	function cancel() : void {
		popup.value.close()
	}


	// 确定添加计划
	function sureAddPlan() : void {
		popup.value.close()
		data.planList.push(data.data)
		data.menuFun.updatePlan(data.plan._id, data.timeIndex, data.planList).then(res => {

		})

	}

	// 获取计划
	function getPlan() {
		let date = getDate(data.dayIndex, 10)
		data.menuFun.getPlan(date).then(res => {
			data.plan = res.data
			if (data.timeIndex === 0) {
				data.planList = res.data.breakfast
			} else if (data.timeIndex === 1) {
				data.planList = res.data.dinner
			} else if (data.timeIndex === 2) {
				data.planList = res.data.lunch
			}
		})
	}


	function init() : void {
		data.menuFun = uniCloud.importObject('menu')
		data.menuFun.getDetail(data.id).then(res => {
			data.data = res.data
			switch (data.data.type) {
				case '1':
					data.data.typeName = '炒菜'
					break;
				case '2':
					data.data.typeName = '减脂'
					break;
				case '3':
					data.data.typeName = '小吃'
					break;
				case '4':
					data.data.typeName = '面食'
					break;
				case '5':
					data.data.typeName = '甜品'
					break;
				case '6':
					data.data.typeName = '饮品'
					break;
				case '7':
					data.data.typeName = '汤'
					break;
				default:
					data.data.typeName = ''
					break;
			}
			console.log(data.data);
		})


	}

	// 打开加入饮食计划弹窗
	function openAddPlan() : void {
		popup.value.open('bottom')
		getPlan()
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
		data.from = options.from
		if (data.from === 'menu') {

		}
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
		padding-top: 32rpx;
	}

	.foodName {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		/* border-bottom: 2rpx solid #242424; */
		margin-bottom: 40rpx;
	}

	.dosage {
		padding: 16px 12px 12px 12px;
		border-radius: 12px;
		background: #FAFAFA;
	}

	.step {
		margin-top: 16rpx;
		width: 100%;
		background: #FAFAFA;
		border-radius: 16rpx;
		padding: 32rpx 24rpx;
	}

	.type {
		padding: 8px 12px;
		border-radius: 13px;
		border: 1px solid #242424;
		background: #DDFF80;
		font-size: 10px;
		margin-right: 12px;
		font-weight: 700;
	}

	.stepDetail {
		margin-top: 20rpx;
	}

	nav {
		color: #295253;
		font-size: 12px;
		font-weight: 600;
		opacity: 0.6;

	}

	.bottom {
		width: 100%;
		padding: 20px;
		position: fixed;
		bottom: 0px;
		background-color: #fff;
		display: flex;
		justify-content: center;
		z-index: 9;
	}

	.bottomButton {
		height: 52px;
		width: 100%;
		border-radius: 16px;
		border: 1px solid #242424;
		background: #DDFF80;
		text-align: center;
		line-height: 52px;
		font-size: 16px;
	}

	.popBox {
		height: 350px;
		width: 100%;
		border-radius: 20px 20px 0px 0px;
		background: #FFF;
		padding: 20px;
		position: relative;
	}

	.selectItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px;
		border-radius: 8px;
		background: #FAFAFA;
		font-size: 16px;
		margin-right: 12px;
	}

	.img {
		height: 16px;
		width: 17px;
		/* margin-right: 6px; */
	}

	.selectText {
		margin-left: 6px;
		margin-right: 6px;
	}

	.food {
		width: 100%;
		display: flex;
		padding: 14px 20px 14px 14px;
		align-items: center;
		border-radius: 8px;
		background: #FAFAFA;
		margin-top: 18px;
		font-size: 16px
	}

	.popBottom {
		position: fixed;
		bottom: 0px;
		right: 0px;
		left: 0px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
	}

	.popBottomButton {
		flex: 1;
		border-radius: 16px;
		border: 1px solid #242424;
		height: 52px;
		line-height: 52px;
		text-align: center;
	}
</style>