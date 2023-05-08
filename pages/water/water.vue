<template>
	<view class="box">
		<view class="top">
			<view class="flex">
				<view class="moneyText">
					钱
				</view>
				<image style="height: 56.84rpx;width: 58.1rpx;margin-left: 10.6rpx;" src="@/static/money.svg"
					mode="aspectFill"></image>
			</view>

			<view class="flex">
				<!-- actCat -->
				<image src="@/static/icon_active_cat.svg" mode="aspectFill"
					style="width: 44rpx;height: 44rpx;margin-right:42rpx;" @click="selectRole('cat')"
					v-show="data.role==='cat'">
				</image>
				<!-- unactCat -->
				<image src="@/static/icon_unactive_cat.svg" mode="aspectFill"
					style="width: 44rpx;height: 44rpx;margin-right:42rpx;" @click="selectRole('cat')"
					v-show="data.role==='dog'"></image>
				<!-- actDog -->
				<image src="@/static/icon_active_dog.svg" mode="aspectFill" style="width: 44rpx;height: 44rpx;"
					@click="selectRole('dog')" v-show="data.role==='dog'"></image>
				<!-- unactDog -->
				<image src="@/static/icon_unactive_dog.svg" mode="aspectFill" style="width: 44rpx;height: 44rpx"
					@click="selectRole('dog')" v-show="data.role==='cat'">
				</image>

			</view>

		</view>
		<view class="statisticsBox" v-if="data.total">
			<!-- 统计 -->
			<view class="statistics">
				<view class="statisticsTop">
					<!-- 统计左 -->
					<view class="statisticsLeft">
						<view class="flex" style="margin-left: 18.58rpx;">
							<image src="@/static/crocodile.svg" mode="aspectFill"
								style="height: 20rpx;width: 42rpx;margin-right: 20.66rpx;"></image>
							<view style="font-size: 28rpx;font-weight: 600;">
								余额
							</view>
						</view>
						<view class="balance">
							￥{{data.total.balance.toFixed(2)}}
						</view>
					</view>
					<!-- 统计右 -->
					<view class="statisticsRight">
						<view class="monthOut flex">
							<view
								style="font-weight: 400;font-size: 24rpx;color: rgba(36, 36, 36, 0.2);margin-right: 12rpx;">
								当月支出</view>
							<view style="font-weight: 600;font-size: 28rpx;color: rgba(36, 36, 36, 1);">
								￥{{data.total.outMoney.toFixed(2)}}</view>
						</view>
						<view class="dayOut flex">
							<view
								style="font-weight: 400;font-size: 24rpx;color: rgba(36, 36, 36, 0.2);margin-right: 12rpx;">
								平均每日</view>
							<view style="font-weight: 600;font-size: 28rpx;color: rgba(36, 36, 36, 1);">
								￥{{data.total.average}}</view>
						</view>
					</view>
				</view>
				<view class="wave">
					<image src="@/static/wave.svg" mode="aspectFill" style="width: 100%;height: 100%;"></image>
				</view>
			</view>
		</view>
		<!-- 明细选项栏 -->
		<view class="selectBar">
			<view class="detailsText">
				明细
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -6rpx;bottom: 0;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="selectItems">
				<template v-if="!data.showDuringDate">
					<view :class="[data.type===0?'selectItemActive':'selectItemActive selectItemUnactive']"
						@click="selectFilter(0)">
						今日
					</view>
					<view :class="[data.type===1?'selectItemActive':'selectItemActive selectItemUnactive']"
						@click="selectFilter(1)">
						本周
					</view>
					<view :class="[data.type===2?'selectItemActive':'selectItemActive selectItemUnactive']"
						@click="selectFilter(2)">
						全部
					</view>
				</template>
				<template v-else>
					<view class="c04 fs12" style="padding: 7px 16px;">
						<picker mode="date" :value="data.startDate.slice(0,10)" @change="bindDateStart">
							<view class="uni-input">{{data.startDate.slice(0,10)}}</view>
						</picker>
					</view>
					<view class="c04 fs12" style="padding: 7px 16px;">
						<picker mode="date" :value="data.endDate.slice(0,10)" @change="bindDateEnd">
							<view class="uni-input">{{data.endDate.slice(0,10)}}</view>
						</picker>
					</view>
				</template>
				<view :class="[data.type===3?'selectItemActive':'selectItemActive selectItemUnactive']"
					@click="selectFilter(3)" style="right: 24rpx;position: absolute;">
					<image style="height: 40rpx;width: 40rpx;margin-top: 8rpx;" src="@/static/calendar.svg"
						mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<!-- 流水盒子 -->
		<view class="waterBox">
			<view class="waterDay" v-for="(item,index) in data.list" :key="index">
				<view class="waterDayTop">
					<view style="display: flex;align-items:center;">
						<view style="font-weight: 600;font-size: 36rpx;color: #008C38;margin-right: 14rpx;">
							{{item.date.slice(5,10)}}
						</view>
						<view class="c04 fs12">
							{{item.week}}
						</view>
					</view>
					<!-- 复选框 -->
					<view class="flex">
						<!-- 支出 -->
						<view class="filterItem flex" @click="selectWaterType(item,'out')">
							<view class="empty">
								<view class="able" v-if="item.outShow">
								</view>
							</view>
							<view style="font-weight: 400;font-size: 30rpx;margin-right: 48rpx;" class="c">
								-{{item.outMoney}}
							</view>
						</view>
						<!-- 收入 -->
						<view class="filterItem flex" @click="selectWaterType(item,'in')">
							<view class="empty">
								<view class="able" v-if="item.inShow">
								</view>
							</view>
							<view style="font-weight: 400;font-size: 30rpx;" class="c">
								+{{item.inMoney}}
							</view>
						</view>
					</view>
				</view>
				<view class="waterItem" v-for="(water,index2) in item.water" :key="index2"
					v-show="(water.type.type===1&&item.outShow)||(water.type.type===2&&item.inShow)">
					<view class="waterItemLeft">
						<view class="fs16 fw6">
							{{water.name}}
						</view>
						<view class="fw4 c04 fs12" style="margin-top: 8rpx;">
							{{water.create_time.slice(6,16)}}
						</view>
					</view>
					<view class="fs18 fw6" v-if="water.type.type===2&&item.inShow">
						+{{water.money}}
					</view>
					<view class="fs18 fw6" v-if="water.type.type===1&&item.outShow">
						-{{water.money}}
					</view>
				</view>
			</view>
		</view>

		<!-- 记一笔 -->
		<view class="createButton" @click="createPop">
			记一笔
		</view>
		<uni-popup ref="popup">
			<view class="popBox">
				<computer @finish="finish" />
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import computer from "@/components/computer.vue"
	import { getDate } from "@/utils.js"
	import {
		onMounted,
		reactive,
		ref
	} from "vue";
	const data = reactive({
		list: [],//原始的数据
		type: 0,
		data: null,
		role: "cat",
		api: null,
		startDate: getDate(0, 11) + "00:00:00",
		endDate: getDate(0, 11) + "23:59:59",
		total: null,
		showDuringDate: false,
		filterStartDate: "开始时间",
		filterEndDate: "结束时间",
	})

	const popup = ref("")

	function init() {
		getWater()
	}

	// 小记一笔
	function createPop() {
		console.log(popup.value);
		popup.value.open("bottom")
	}

	// 选择日期筛选
	function selectFilter(e : number) : void {
		data.type = e
		if (e === 0) {
			data.startDate = getDate(0, 11) + "00:00:00"
			data.endDate = getDate(0, 11) + "23:59:59"
			getWater()
		} else if (e === 1) {
			let week = new Date().getDay()
			if (week === 0) {
				data.startDate = getDate(-7, 11) + "00:00:00"
				data.endDate = getDate(0, 11) + "23:59:59"
			} else {
				data.startDate = getDate(-week + 1, 11) + "00:00:00"
				data.endDate = getDate(7 - week, 11) + "23:59:59"
			}
			getWater()
		} else if (e === 2) {
			data.startDate = "2000-01-01 00:00:00"
			data.endDate = "2999-01-01 00:00:00"
			getWater()
		} else if (e === 3) {
			if (data.showDuringDate) {
				data.showDuringDate = false
				getWater()
			} else {
				data.showDuringDate = true
				data.type = 0
				data.startDate = getDate(0, 11) + "00:00:00";
				data.endDate = getDate(0, 11) + "23:59:59";
				getWater()
			}
		}

	}



	// 选择查看流水类型
	function selectWaterType(e : any, type : string) : void {
		if (type === 'in') {
			if (e.inShow) {
				e.inShow = false
			} else {
				e.inShow = true
			}
		} else {
			if (e.outShow) {
				e.outShow = false
			} else {
				e.outShow = true

			}
		}
		console.log(e);
	}

	function selectRole(e : string) : void {
		console.log(e);
		data.role = e
		getWater()
		getTotal()
	}


	function getWater() : void {
		data.api.getWater(data.role, data.startDate, data.endDate).then(res => {
			data.list = res.data
		})
	}

	// 创建流水
	function finish() : void {
		popup.value.close()
		init()
		getTotal()
	}

	// 获取总览
	function getTotal() : void {
		data.api.getTotal(data.role).then(res => {
			console.log(res.data);
			data.total = res.data
		})
	}


	function bindDateStart(e : any) : void {
		data.startDate = e.detail.value + " 00:00:00"
		getWater()
	}

	function bindDateEnd(e : any) : void {
		data.endDate = e.detail.value + " 23:59:59"
		getWater()
	}

	onMounted(() => {

		uni.getStorage({
			key: 'role'
		}).then((res) => {
			data.role = res.data
			data.api = uniCloud.importObject('flowing_water')
			getTotal()
			init()
		})

	})
</script>

<style scoped>
	.box {
		height: 100%;
		width: 100%;
		padding: 62rpx 0rpx 0rpx 0rpx;
	}

	.top {
		width: 100%;
		padding: 0 56rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.moneyText {
		font-family: 'F';
		font-style: normal;
		font-weight: 500;
		font-size: 56rpx;
	}

	.statisticsBox {
		margin-top: 18rpx;
		width: 100%;
		height: 212rpx;
		padding: 0 40rpx;
		border-bottom: 4rpx solid #242424;
	}

	.statistics {
		width: 100%;
		height: 210rpx;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		border: 4rpx solid;
		border-image-source: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
			linear-gradient(0deg, #242424, #242424);
		border-bottom: none;

		position: relative;
	}

	.statisticsTop {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.statisticsLeft {
		margin-left: 56rpx;
		margin-top: 40rpx;
	}

	.balance {
		padding: 12rpx 28rpx;
		gap: 20rpx;
		height: 72rpx;
		background: #FAFAFA;
		border-radius: 52rpx;
		border: 1.2rpx solid;
		border-image-source: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
			linear-gradient(0deg, #242424, #242424);
		margin-top: 12rpx;
		font-weight: 600;
		font-size: 36rpx;
		color: #004244;
	}

	.statisticsRight {
		margin-left: 196rpx;
		position: absolute;
		left: 196rpx;
		top: 50rpx;
	}

	.monthOut {
		width: 100%;
		margin-bottom: 28rpx;
	}

	.wave {
		width: 100%;
		height: 32rpx;
		position: relative;
		bottom: 32rpx;
	}

	.selectBar {
		margin-top: 38rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 38rpx;
		position: relative;
	}

	.detailsText {
		margin-left: 72rpx;
		width: 80rpx;
		height: 54rpx;
		font-weight: 500;
		font-size: 40rpx;
		color: rgba(36, 36, 36, 1);
		position: relative;
	}

	.selectItems {
		display: flex;
		align-items: center;
		position: relative;
	}

	.selectItemActive {
		gap: 20rpx;
		background: #FBFBFB;
		border-radius: 50rpx;
		color: rgba(36, 36, 36, 1);
		border: 2rpx solid rgba(36, 36, 36, 1);
		font-weight: 500;
		font-size: 26rpx;
		width: 96rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		/* margin-right: 24rpx; */

	}

	.selectItemUnactive {
		/* gap: 20rpx;
		background: #FBFBFB;
		border-radius: 50rpx;
		color: rgba(36, 36, 36, 0.4);
		border: 2rpx solid rgba(36, 36, 36, 0.4);
		font-weight: 500;
		font-size: 26rpx;
		width: 96rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		margin-right: 24rpx; */
		opacity: 0.4;
	}

	.createButton {
		position: fixed;
		width: 166rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #C7E94E;
		box-shadow: 0rpx 44rpx 32rpx -26rpx rgba(0, 0, 0, 0.16);
		border-radius: 16rpx;
		font-weight: 600;
		font-size: 30rpx;
		color: #FFFFFF;
		bottom: 120rpx;
		right: 32rpx;
	}

	.waterBox {
		width: 100%;
		padding: 0rpx 40rpx 0rpx 44rpx;
		overflow: scroll;
		height: calc(100vh - 586rpx);
	}

	.waterDay {
		padding: 32rpx 27rpx;
		width: 100%;
		background: #FAFAFA;
		border-radius: 22rpx;
		margin-bottom: 36rpx;
	}

	.waterDayTop {
		display: flex;
		justify-content: space-between;
	}


	.empty {
		position: relative;
		width: 28rpx;
		height: 28rpx;
		background: #FBFBFB;
		border: 2rpx solid #13DDE2;
		border-radius: 38rpx;

		box-sizing: content-box;
		margin-right: 8rpx;
	}

	.able {
		position: absolute;
		width: 16rpx;
		height: 16rpx;
		left: 7rpx;
		top: 6rpx;
		background: #13DDE2;
		border-radius: 8rpx;
	}

	.waterItem {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 28rpx;
	}

	.popBox {
		width: 100%;
		height: 1110rpx;
		border-radius: 48rpx 48rpx 0rpx 0rpx;
		background-color: #fff;
		padding: 30rpx;
	}
</style>