<template>
	<view style="width:100%;">
		<header class="header">
			<view class="img" style="position: relative;">
				<image src="@/static/loveDay.svg" mode="aspectFill" class="img">
				</image>
				<view class="day">
					{{data.day}} day
				</view>
			</view>

			<image src="@/static/meeting.svg" mode="aspectFill" class="img" @click="toMeeting"></image>
		</header>

		<view class="body">
			<view class="title">
				<view @click="changeType('goal')" :class="[data.type==='goal'?'select':'unselect']">
					目标
				</view>
				<view style="width: 50rpx;">

				</view>
				<view @click="changeType('schedule')" :class="[data.type==='schedule'?'select':'unselect']">
					日程
				</view>
			</view>
			<template v-if="data.type==='goal'">
				<view class="statistics">
					<view class="statisticsItem">
						<view class="flex">
							<view class="o" style="background-color: #C7FF02;">
							</view>
							<strong class="">
								全部
							</strong>
						</view>


						<strong style="color:#242424 ;">
							{{data.goalList.length}}个
						</strong>
					</view>
					<view class="statisticsItem">
						<view class="flex">
							<view class="o" style="background-color: #D06400;">
							</view>
							<strong class="">
								超期
							</strong>
						</view>


						<strong style="color:#D06400 ;">
							{{data.timeoutNum}}个
						</strong>
					</view>
				</view>

				<nav>
					<view class="flex">
						<view class="o" style="background-color: #C7FF02">

						</view>
						<strong>
							全部目标
						</strong>
					</view>

					<image @click="sort" src="@/static/endTime.svg" mode="aspectFill" style="width: 70px;height: 28px;">
					</image>
				</nav>

				<!-- 目标列表 -->
				<scroll-view scroll-y="true" class="scrollList" style="height: 500px" @scrolltolower="loadMore">
					<view :class="[!item.timeout?'goal success':'goal fail']" v-for="(item,index) in data.goalList"
						:key="index" @click="toGoalDetail(item)">
						<view class="goalTop">
							<strong class="left">
								{{item.name}}
							</strong>
							<view class="flex">
								<view class="remark" style="margin-right: 12px;">
									<image v-if="!item.timeout" src="@/static/daibanGreen.svg" mode="aspectFill"
										class="remarkImg"></image>
									<image v-else src="@/static/daibanRed.svg" mode="aspectFill" class="remarkImg">
									</image>
									<strong>{{item.doing}}个代办</strong>
								</view>
								<view class="remark">
									<image v-if="!item.timeout" src="@/static/chaoshiGreen.svg" mode="aspectFill"
										class="remarkImg"></image>
									<image v-else src="@/static/chaoshiRed.svg" mode="aspectFill" class="remarkImg">
									</image>
									<strong>{{item.timeoutText}}</strong>
								</view>
							</view>
						</view>
						<uv-line-progress :percentage="((item.done/(item.doing+item.done)).toFixed(2))*100"
							height="14px" :activeColor="[!item.timeout?'#6B870A':'#D06400']"
							style="margin-top: 12px;"></uv-line-progress>
					</view>

				</scroll-view>

				<image src="@/static/addGoal.svg" mode="aspectFill" @click="create('goal')"
					style="width: 83px;height: 77px;position: fixed;z-index:9;right: 10px;bottom: 100px;">
				</image>
			</template>


			<template v-if="data.type==='schedule'">
				<scroll-view scroll-y="true" class="scrollList" style="height: 500px;margin-top: 24px;"
					@scrolltolower="loadMore">
					<view @click="changeSchedule(item)" class="schedule" v-for="(item,index) in data.scheduleList"
						:key="index">
						<view :class="[item.status==='doing'?'scheduleCheckbox':'scheduleCheckbox scheduleDone']">
						</view>
						<view class="">
							{{item.name}}
						</view>
					</view>
				</scroll-view>
				<image src="@/static/addSchedule.svg" mode="aspectFill" @click="create('schedule')"
					style="width: 83px;height: 77px;position: fixed;z-index:9;right: 10px;bottom: 100px;">
				</image>

				<uni-popup ref="popup" style="border-radius: 20px 20px 0px 0px;">
					<view class="createBox">
						<textarea v-model="data.scheduleName" placeholder="输入日程名称" style="height: 130px;" />
						<view class="flex" style="justify-content: space-between;">
							<view :class="[data.sent?'sentSelect':'sentUnselect']"
								@click="data.sent?data.sent=false:data.sent=true">
								<view v-show="!data.sent" class="O" style="background-color: #EFEFEF;">

								</view>
								<view v-show="data.sent" class="O" style="background-color: #13DDE2;">

								</view>
								<view class="fs12" style="margin-right: 10px;">
									发送给
								</view>
								<image src="@/static/smallDog.svg" mode="aspectFill" style="height: 18px;width: 18px;">
								</image>

							</view>

							<view @click="addSchedule">
								完成
							</view>
						</view>

					</view>
				</uni-popup>
			</template>
		</view>


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
		name: "",
		type: "goal",
		role: "",
		api: null,
		api2: null,
		goalList: [],
		timeoutNum: 0,
		scheduleList: [],
		sort: "down",
		scheduleName: "",
		sent: false,
		day: null
	})

	const popup = ref("")


	// 切换目标,日程
	function changeType(type : string) : void {
		data.type = type
		init()
	}

	function loadMore() {

	}

	// 跳转约会页面
	function toMeeting() {
		uni.navigateTo({
			url: "/pages/index/meeting"
		})
	}

	// 跳转目标详情
	function toGoalDetail(e : any) : void {
		uni.navigateTo({
			url: `/pages/index/goal?id=${e._id}`
		})
	}

	// 创建目标或日程
	function create(type : string) : void {
		if (type === 'goal') {

		} else {
			popup.value.open('bottom')
		}

	}


	// 新增日程
	function addSchedule() : void {
		let role = ""
		if (data.role === 'dog') {
			data.sent ? role = 'cat' : role = 'dog'
		} else if (data.role === 'cat') {
			data.sent ? role = 'dog' : role = 'cat'
		}

		data.api2.createSchedule(data.scheduleName, role, getDate(0, 10)).then(res => {
			popup.value.close()
			data.sent = false
			data.scheduleName = ""
			init()
		})
	}

	// 排序
	function sort() : void {
		if (data.sort === 'down') {
			data.sort = 'up'
			data.goalList.sort((a : any, b : any) => {
				return new Date(a.end).getTime() - new Date(b.end).getTime()
			})
		} else {
			data.sort = 'down'
			data.goalList.sort((a : any, b : any) => {
				return new Date(b.end).getTime() - new Date(a.end).getTime()
			})
		}

	}

	// 改变日程状态
	function changeSchedule(e : any) : void {
		e.status === 'doing' ? e.status = 'done' : e.status = 'doing'
		data.api2.updateSchedule(e._id, e.status)
	}

	// 检查每个目标的代办是否有超期
	function checkTimeout() : void {
		let myDate = new Date().getTime()
		console.log(myDate);

		data.timeoutNum = 0
		data.goalList.forEach(e => {
			if (myDate === new Date(e.end).getTime()) {
				e.timeoutText = "今天"
				e.timeout = false
			} else if (myDate > new Date(e.end).getTime()) {
				e.timeoutText = "超期"
				e.timeout = true
				data.timeoutNum += 1
			} else if (myDate < new Date(e.end).getTime()) {
				e.timeoutText = e.end
				e.timeout = false
			}
		})

		console.log(data.goalList);
	}

	// 初始化
	function init() : void {
		if (data.type === "goal") {
			data.api.getGoal(data.role).then(res => {
				data.goalList = res.data
				data.goalList.forEach(e => {
					e.doing = 0
					e.done = 0
					for (let i = 0; i < e.goalDetail.length; i++) {
						if (e.goalDetail[i].status === 'doing') {
							e.doing += 1
						}
						if (e.goalDetail[i].status === 'done') {
							e.done += 1
						}
					}
				})

				checkTimeout()
			})
		} else {
			data.api2.getSchedule(data.role, getDate(0, 10)).then(res => {
				data.scheduleList = res.data
			})
		}

	}

	// 计算恋爱天数
	function computedDay() : void {
		let start = new Date('2021-12-24').getTime()
		let end = new Date(getDate(0, 10)).getTime()
		data.day = (end - start) / (1 * 24 * 60 * 60 * 1000)
	}


	onLoad(() => {
		computedDay()
		uni.getStorage({
			key: 'role'
		}).then((res) => {
			data.role = res.data
			data.api = uniCloud.importObject('goal')
			data.api2 = uniCloud.importObject('schedule')
			init()
		})
	})

	onShow(() => {
		if (data.api) {
			init()
		}

	})
</script>

<style scoped lang="less">
	@success: #C7FF02;

	@fail: #D06400;

	@black: #242424;

	.header {
		height: 180px;
		width: 100%;
		background: #F4FADE;
		padding: 41px 28px 0 28px;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	nav {
		display: flex;
		margin-top: 18px;
		width: 100%;
		justify-content: space-between;
		align-self: center;
		margin-bottom: 18px;
	}

	.img {
		width: 155px;
		height: 115px;
	}

	.body {
		padding: 20px;
		position: relative;
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

	.statistics {
		padding: 16px 18px 14px 18px;
		border-radius: 8px;
		background: #FAFAFA;
		width: 100%;
		margin-top: 23px;
		display: flex;
		justify-content: space-between;
	}

	.statisticsItem {
		display: flex;
		align-items: center;
		padding: 12px;
		justify-content: space-between;
		width: 142.5px;
		background-color: #fff;
		border-radius: 8px;
	}

	.o {
		width: 5px;
		height: 5px;
		border-radius: 2.5px;
		border: 1px solid #242424;
		margin-right: 6px;
	}

	.goal {
		width: 100%;
		padding: 16px 14px;
		border-radius: 8px;
		border: 1px solid @black;
		background: #fff;
		margin-bottom: 18px;
	}

	.success {
		box-shadow: 4px 4px 0px 0px @success;
		color: #6B870A;
	}

	.fail {
		box-shadow: 4px 4px 0px 0px @fail;
		color: #D06400;
	}

	.goalTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.remark {
		border-radius: 7px;
		background: #F1ECE8;
		display: flex;
		padding: 2px 6px;
		font-size: 10px;
		align-items: center;
	}

	.remarkImg {
		height: 12px;
		width: 12px;
		margin-right: 4px;
	}

	.schedule {
		width: 100%;
		border-radius: 8px;
		border: 1px solid @black;
		background: #fff;
		padding: 24px 26px;
		display: flex;
		align-items: center;
		font-size: 14px;
		margin-bottom: 14px;

	}

	.scheduleCheckbox {
		margin-right: 10px;
		width: 18px;
		height: 18px;
		border-radius: 2px;
		border: 1px solid #242424;
		opacity: 0.2;
	}

	.scheduleDone {
		background-color: @success;
	}

	.createBox {
		width: 100%;
		height: 244px;
		padding: 20px 32px;
		border-radius: 20px 20px 0px 0px;
		background: #FFF;
	}

	.sentUnselect {
		padding: 8px 12px;
		border-radius: 8px;
		background: #FAFAFA;
		border: 1px solid #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.sentSelect {
		padding: 8px 12px;
		border-radius: 8px;
		background: #FAFAFA;
		border: 1px solid @black;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.O {
		height: 8px;
		width: 8px;
		border-radius: 4px;
		margin-right: 10px;
	}

	.day {
		position: absolute;
		bottom: 20px;
		left: 12px;
		font-family: 'XM';
		font-weight: 500;
		font-size: 48rpx;
	}
</style>