<template>
	<view v-if="data.data" style="position: relative;">
		<header>
			<view class="timeBox">
				<view class="">
					<view class="fs11">
						开始时间
					</view>
					<view class="flex" style="margin-top: 8px;">
						<image src="@/static/chaoshiRed.svg" mode="aspectFill" class="clock"></image>
						<strong class="fs13">
							{{data.data.start}}
						</strong>
					</view>
				</view>

			</view>
			<view class="timeBox" style="background-color: #fff;">
				<view class="">
					<view class="fs11">
						计划截至时间
					</view>
					<view class="flex" style="margin-top: 8px;">
						<image src="@/static/chaoshiRed.svg" mode="aspectFill" class="clock"></image>
						<strong class="fs13">
							{{data.data.end}}
						</strong>
					</view>
				</view>

				<view class="fs11" @click="changeEnd"
					style="text-align:center;height: 26px;width: 42px;border-radius: 20px;border: 1px solid #242424;line-height: 26px;">
					更改
				</view>
			</view>
		</header>

		<view class="body">
			<nav class="flex" style="margin-bottom: 12px;">
				<view class="o" style="background-color: #DDFF80;">

				</view>
				<strong>{{data.data.name}}</strong>
			</nav>

			<template v-for="(item,index) in data.data.goalDetail">
				<view class="item" v-if="item.status==='doing'" :key="index" @longpress="item.edit=true">
					<view class="checkbox" @click.stop="changeGoalItemStatus(item)">

					</view>
					<strong v-if="!item.edit" class="fs14">{{item.name}}</strong>
					<input v-else type="text" class="fs14" v-model="item.name" @blur="editGoalItem(item)">
				</view>
			</template>


			<image @click="createGoalItem" src="@/static/addGoalItem.svg" mode="aspectFill"
				style="height: 46px;width: 46px;margin-top: 12px;margin-bottom: 20px;">
			</image>

			<view class="flex" style="margin-bottom: 12px;">
				<strong class="fs14">已完成</strong>
				<image src="@/static/selectUp.svg" mode="aspectFill" style="height: 8px;width: 8px;margin-left: 6px;">
				</image>
			</view>
			<template v-for="(item,index) in data.data.goalDetail">
				<view class="finishBox" :key="index" v-if="item.status==='done'">
					<image src="@/static/iconScheduleDone.svg" mode="aspectFill"
						style="width: 18px;height: 18px;margin-right: 10px;"></image>
					<view style="opacity: 0.2;">
						{{item.name}}
					</view>
				</view>
			</template>

		</view>

		<view class="bottom">
			<view class="button" @click="option('delete')">
				删除目标
			</view>
			<view class="button" style="background-color: #DDFF80;" @click="option('finish')">
				完成目标
			</view>
		</view>

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="center" cancelText="取消" confirmText="确定" :title="data.dialogTitle"
				:content="data.dialogText" @confirm="sureOption"></uni-popup-dialog>
		</uni-popup>

		<!-- 时间选择 -->
		<uni-calendar :insert="false" ref="calendar" v-if="data.data" :clear-date="true" :date="data.data.end"
			@confirm="confirm" />
	</view>
</template>

<script setup lang="ts">
	import {
		reactive, ref
	} from "vue";
	import { getDate } from "@/utils.js"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	import { showToast, Toast } from "vant";
	const data = reactive({
		doneList: [],
		doingList: [],
		data: null,
		dialogText: "",
		dialogTitle: "",
		api: null
	})

	const calendar = ref()

	const alertDialog = ref()

	onLoad((options) => {
		data.api = uniCloud.importObject('goal')
		getDetail(options.id)
	})

	// 操作
	function option(type : string) : void {
		alertDialog.value.open()
		if (type === 'delete') {
			data.dialogText = "是否确认删除目标"
			data.dialogTitle = "删除确认框"
		} else {
			data.dialogText = "是否确认完成目标"
			data.dialogTitle = "完成确认框"
		}
	}

	// 确认操作
	function sureOption() {
		if (data.dialogTitle === '完成确认框') {

			for (let i = 0; i < data.data.goalDetail.length; i++) {
				if (data.data.goalDetail[i].status === 'doing') {
					return uni.showToast({
						icon: "error",
						title: '还有内容没有完成',
						duration: 2000
					})
				}
			}

			data.api.finishGoal(data.data._id).then(() => {
				uni.navigateBack()
			})
		} else if (data.dialogTitle === '删除确认框') {
			data.api.deleteGoal(data.data._id).then(() => {
				uni.navigateBack()
			})
		}

	}


	// 改变状态
	function changeGoalItemStatus(e : any) {
		e.status = "done"
		data.api.finishGoalDetail(e._id).then(res => {
		})
	}

	// 修改目标子内容
	function editGoalItem(e : any) : void {
		e.edit = false
		data.api.editGoalItem(e._id, e.name).then(res => {

		})
	}


	// 创建目标子项
	function createGoalItem() : void {
		data.api.createGoalItem(data.data._id, "").then(res => {
			getDetail(data.data._id)
		})
	}

	// 获取详情
	function getDetail(id : string) : void {
		data.api.getDetail(id).then(res => {
			data.data = res.data
			for (let i = 0; i < data.data.goalDetail.length; i++) {
				data.data.goalDetail[i].edit = false
			}
			console.log(data.data);
		})


	}

	// 改变截止时间
	function changeEnd() {
		calendar.value.open()
	}

	// 选择时间
	function confirm(e : any) : void {
		console.log(e.fulldate);
		if (new Date(data.data.start).getTime() > new Date(e.fulldate).getTime()) {
			uni.showToast({
				icon: "error",
				title: "非法时间"
			})
		} else {
			data.data.end = e.fulldate
			data.api.editGoalEnd(data.data._id, e.fulldate).then(res => {
			})
		}
	}
</script>

<style scoped lang="less">
	@success: #C7FF02;

	@fail: #D06400;

	@black: #242424;

	header {
		height: 180px;
		width: 100%;
		background: #F4FADE;
		padding: 41px 28px 0 28px;
		box-sizing: border-box;
	}

	.timeBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 62px;
		border-radius: 12px;
		padding: 8px 18px;
	}

	.clock {
		height: 14px;
		width: 14px;
		margin-right: 6px;
	}

	.o {
		width: 5px;
		height: 5px;
		border-radius: 2.5px;
		border: 1px solid #242424;
		margin-right: 6px;
	}

	.body {
		padding: 20px;
		position: relative;
	}

	.item {
		padding: 16px 12px;
		display: flex;
		align-self: center;
		border-radius: 8px;
		border: 1px solid #E6E6E6;
		background: #FAFAFA;
		margin-bottom: 12px;
	}

	.checkbox {
		width: 18px;
		height: 18px;
		border-radius: 2px;
		border: 1px solid #E6E6E6;
		background: #FAFAFA;
		margin-right: 10px;
	}

	.finishBox {
		display: flex;
		padding: 16px 10px 16px 12px;
		align-items: center;
		border-radius: 8px;
		background: #FAFAFA;
		color: @black;
		font-size: 14px;
		margin-bottom: 12px;
	}

	.bottom {
		position: fixed;
		bottom: 0px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		font-weight: 700;
	}

	.button {
		text-align: center;
		height: 58px;
		width: 160px;
		border-radius: 16px;
		border: 1px solid @black;
		line-height: 58px;
	}
</style>