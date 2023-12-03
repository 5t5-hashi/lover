<template>
	<navTabbar v-if="data.title" :title="data.title" />
	<view style="padding: 20px;padding-top: 70px;position: relative;">
		<image v-if="data.url===''" @click="chose" src="@/static/addImage.svg" mode="scaleToFill"
			style="width: 100%;height: 132px;">
		</image>
		<image v-else @click="chose" :src="data.url" mode="aspectFill" style="width: 100%;height: 132px;"></image>
		<view class="fs16 c24 fw6 title">
			名称
			<image class="titleImg" src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="name">
			<input type="text" v-model="data.name" class="fs14" placeholder="请输入名称">
		</view>

		<view class="fs16 c24 fw6 title">
			地址
			<image class="titleImg" src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="name">
			<input type="text" v-model="data.address" class="fs14" placeholder="请输入地址">
		</view>

		<view class="fs16 c24 fw6 title">
			营业日期
			<image class="titleImg" src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="flex">
			<view style="width: 68px;margin-right: 10px;" @click="openChoseDate(1)"
				:class="[data.date==='全年'?'selectButton select':'selectButton unSelect']">
				全年
			</view>
			<view @click="openChoseDate(0)" style="width: 100%;"
				:class="[data.date!='全年'?'selectButton select':'selectButton unSelect']">
				<image src="@/static/calendar.svg" mode="aspectFill"
					style="height: 18px;width: 18px;margin-right: 12px;">
				</image>
				<view>
					{{data.date==='全年'?'选择日期':data.date}}

				</view>
			</view>
		</view>


		<view class="flex" style="margin-top: 12px;">
			<view style="flex: 1;margin-right: 10px;" @click="data.isWeek?data.isWeek=false:data.isWeek=true"
				:class="[data.isWeek?'selectButton select':'selectButton unSelect']">
				周末
			</view>
			<view @click="data.isDay?data.isDay=false:data.isDay=true" style="flex: 1"
				:class="[data.isDay?'selectButton select':'selectButton unSelect']">
				<view>
					工作日
				</view>
			</view>
		</view>
		<view class="fs16 c24 fw6 title">
			营业时间
			<image class="titleImg" src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="flex" style="margin-top: 12px;">
			<view style="width: 106px;margin-right: 10px;" @click="openChoseTime(1)"
				:class="[data.time==='24小时'?'selectButton select':'selectButton unSelect']">
				24小时
			</view>
			<view @click="openChoseTime(0)" style="width: 100%;"
				:class="[data.time!='24小时'?'selectButton select':'selectButton unSelect']">
				<view>

					{{data.time==='24小时'?'选择时间':data.time}}
				</view>
			</view>
		</view>

		<view class="fs16 c24 fw6 title">
			注意事项
			<image class="titleImg" src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>


		<view class="name">
			<input type="text" v-model="data.remark" class="fs14" placeholder="如是否需要带身份证、是否需要提前预约等">
		</view>

		<view class="uploadButton" @click="create">
			上传
		</view>

		<uv-calendar ref="calendar" mode="range" @confirm="confirmDate"></uv-calendar>
		<uv-datetime-picker ref="datetimePicker" mode="time" @confirm="confirmTime">
		</uv-datetime-picker>
	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref,
	} from "vue";

	import navTabbar from '@/components/nav.vue';
	import { chooseImg, compressImage } from "@/utils.js"
	import { getDate } from "@/utils.js"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";

	const data = reactive({
		title: "",
		name: "",
		address: "",
		date: "全年",
		isWeek: false,
		isDay: false,
		time: "24小时",
		remark: "",
		url: "",
		api: null
	})

	const calendar = ref()
	const datetimePicker = ref()

	// 选择日期
	function openChoseDate(e : number) {
		if (e === 1) {
			data.date = '全年'
		} else {
			calendar.value.open()

		}
	}

	// 选择时间
	function openChoseTime(e : number) {
		if (e === 1) {
			data.time = '24小时'
		} else {
			datetimePicker.value.open()
		}
	}

	// 选择日期范围
	function confirmDate(e : any) {
		console.log(e);
		data.date = `${e[0].slice(5, 10)} - ${e[e.length - 1].slice(5, 10)}`
	}


	// 选择时间范围
	function confirmTime(e : any) {
		console.log(e);
		if (data.time === '24小时') {
			data.time = e.value + "-"
			datetimePicker.value.open()
		} else if (data.time != '24小时' && data.time.length < 7) {
			data.time += e.value
		} else if (data.time.length === 11) {
			data.time = ""
			data.time = e.value + "-"
		}
		// data.date = `${e[0]} - ${e[e.length - 1]}`
	}

	// 选择图片
	async function chose() {
		let filePath = await chooseImg()
		// console.log(filePath);
		data.url = filePath

		// 在APP平台才执行
		// #ifdef APP-PLUS
		let compressFile = await compressImage(filePath)
		data.url = compressFile
		console.log(data.url);
		// console.log(compressFile);
		// #endif
	}

	// 上传
	function upload() : any {
		return new Promise((resolve) => {
			let arr = data.url.split("/")
			uniCloud.uploadFile({
				filePath: data.url,
				cloudPath: "meeting/" + arr[arr.length - 1],
				success: (uploadFileRes) => {
					console.log(uploadFileRes);
					resolve(uploadFileRes)
				}
			});
		})

	}

	// 创建
	async function create() : void {
		console.log(data.url, data.name, data.address, data.date, data.time, data.isDay, data.isWeek, data.remark);
		let url = await upload()
		let day = 0
		if (data.isDay && data.isWeek) {
			day = 3
		} else if (data.isDay && !data.isWeek) {
			day = 1
		} else if (!data.isDay && data.isWeek) {
			day = 2
		}

		let type = ""
		data.title === "新增游玩" ? type = "play" : type = "show"
		data.api.createMeeting(url.fileID, data.name, data.address, data.date, data.time, data.remark, type, day).then(res => {
			uni.navigateBack()
		})
	}


	onLoad((options) => {
		data.api = uniCloud.importObject('meeting')
		options.type === 'play' ? data.title = "新增游玩" : data.title = "新增展览"
		console.log(options, data.title);
	})
</script>

<style scoped lang="less">
	@title: #13DDE2;

	@bgc: #DDFF80;

	@black: #242424;

	.title {
		position: relative;
		margin-left: 12rpx;
		margin-top: 18px;
		margin-bottom: 10px;
	}

	.titleImg {
		height: 11rpx;
		width: 60rpx;
		position: absolute;
		left: -12rpx;
		bottom: -6rpx;
	}

	.name {
		width: 100%;
		height: 46px;
		padding: 14px 12px;
		border-radius: 8px;
		border: 1px solid rgba(36, 36, 36, 0.10);
	}

	.select {
		color: @black;
		background-color: @bgc;
	}

	.unSelect {
		color: @black;
		background-color: #e2e2e2;
		opacity: 0.4;
	}

	.selectButton {
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px;
		font-size: 14px;
	}

	.uploadButton {
		width: 100%;
		height: 58px;
		line-height: 58px;
		text-align: center;
		border-radius: 16px;
		border: 1px solid @black;
		background: @bgc;
		font-weight: 700;
		margin-top: 58px;
	}
</style>