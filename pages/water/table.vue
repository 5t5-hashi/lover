<template>
	<view style="padding: 0px 20px;">
		<view class="topBar">
			<image src="../../static/back.svg" mode="aspectFill" style="width: 15px;height: 15px;" @click="back">
			</image>
			<strong>{{data.month}}月</strong>
			<view class="calendar" @click="open">
				<image class="calendar" src="../../static/calendar.svg" style="height: 19px;width: 19px;"
					mode="aspectFill"></image>
			</view>
		</view>

		<view class="total flex j_c_b a_i_c">
			<view class="flex j_c_b type a_i_c">
				<view class="flex">
					<view
						style="height: 4px;width: 4px;border-radius: 50%;border: 0.6px solid #242424;background-color: #C7ff02;margin-right: 6px;">
					</view>
					<view class="">
						收入
					</view>
				</view>
				<view class="">
					￥{{data.in.toFixed(2)}}
				</view>
			</view>
			<view class="flex j_c_b type a_i_c">
				<view class="flex">
					<view
						style="height: 4px;width: 4px;border-radius: 50%;border: 0.6px solid #242424;background-color:#13DDE2;margin-right: 6px;">
					</view>
					<view class="">
						支出
					</view>
				</view>
				<view class="">
					￥{{data.out.toFixed(2)}}
				</view>
			</view>
		</view>

		<view class="detail flex a_i_c" style="flex-direction: column;">
			<view class="">
				支出分布
			</view>
			<qiun-data-charts type="ring" v-if="!data.loading" :opts="data.opts" :chartData="data.chartData"
				:canvas2d="true" canvasId="QbkMGBHAPWBNsYOnTIxCDhmJXNeIvqVz" />

			<view class="list">
				<view class="item " v-for="(item,index) in data.chartData.series[0].data">
					<view class="flex j_c_b">
						<view class="flex" style="align-items: flex-end;">
							<strong style="font-size: 14px;margin-right: 6px;">
								{{item.name}}
							</strong>
							<view style="font-size: 10px;color: #6E6E6E;">
								{{item.percentage}}%
							</view>
						</view>
						<view class="flex">
							￥{{item.value}}
						</view>
					</view>
					<uv-line-progress :percentage="item.percentage" height="6" :showText="false"
						:activeColor="item.color" style="margin-top: 12px;"></uv-line-progress>
				</view>
			</view>
		</view>
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :insert="false" :lunar="true"
			@confirm="monthSwitch" />
	</view>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue';
	const calendar = ref()

	const data = reactive({
		role: "",
		api: null,
		startDate: "",
		endDate: "",
		month: 0,
		data: [],
		opts: {
			rotate: false,
			rotateLock: false,
			color: ["#C7FF02", "#13DDE2", "#DDFF80", "#B4EDEE", "#CFEDF1", "#F8FDCF", "#E2F6CA", "#ECF5CB"],
			padding: [5, 5, 5, 5],
			dataLabel: true,
			enableScroll: false,
			legend: {
				show: true,
				position: "bottom",
				lineHeight: 5
			},
			title: {
				name: "总计",
				fontSize: 14,
				color: "#666666"
			},
			subtitle: {
				name: "￥",
				fontSize: 14,
				color: "#7cb5ec"
			},
			extra: {
				ring: {
					ringWidth: 30,
					activeOpacity: 0.5,
					activeRadius: 10,
					offsetAngle: 0,
					labelWidth: 15,
					border: false,
					borderWidth: 10,
					borderColor: "#FFFFFF"
				}
			}
		},
		chartData: {
			series: [
				{
					data:
						[{ name: "食材", value: 0, color: "#C7FF02", percentage: 0 },
						{ name: "外卖", value: 0, color: "#13DDE2", percentage: 0 },
						{ name: "生活费", value: 0, color: "#DDFF80", percentage: 0 },
						{ name: "奶油", value: 0, color: "#B4EDEE", percentage: 0 },
						{ name: "还款", value: 0, color: "#CFEDF1", percentage: 0 },
						{ name: "饮品", value: 0, color: "#F8FDCF", percentage: 0 },
						{ name: "服饰", value: 0, color: "#E2F6CA", percentage: 0 },
						{ name: "生活用品", value: 0, color: "#ECF5CB", percentage: 0 }]
				}
			]
		},
		in: 0,
		out: 0,
		loading: true
	})

	// 获取流水
	function getWater() {
		data.loading = true
		data.data = []
		data.in = 0
		data.out = 0

		data.api.getWater(data.role, data.startDate, data.endDate).then(res => {
			console.log(res);
			let outList = []
			for (let i = 0; i < res.data.length; i++) {
				for (let j = 0; j < res.data[i].water.length; j++) {
					data.data.push(res.data[i].water[j])
				}
			}
			data.data.forEach(e => {
				if (e.type.type === 1) {
					data.out += e.money
					outList.push(e)
				}
				if (e.type.type === 2) {
					data.in += e.money
				}
			})
			data.opts.subtitle.name = "￥" + data.out

			console.log(outList);
			outList.forEach(e => {
				switch (e.type.name) {
					case "食材":
						data.chartData.series[0].data[0].value += e.money
						data.chartData.series[0].data[0].percentage = parseFloat((data.chartData.series[0].data[0].value / data.out * 100).toFixed(2))
						break;
					case "外卖":
						data.chartData.series[0].data[1].value += e.money
						data.chartData.series[0].data[1].percentage = parseFloat((data.chartData.series[0].data[1].value / data.out * 100).toFixed(2))
						break;
					case "生活费":
						data.chartData.series[0].data[2].value += e.money
						data.chartData.series[0].data[2].percentage = parseFloat((data.chartData.series[0].data[2].value / data.out * 100).toFixed(2))
						break;
					case "奶油":
						data.chartData.series[0].data[3].value += e.money
						data.chartData.series[0].data[3].percentage = parseFloat((data.chartData.series[0].data[3].value / data.out * 100).toFixed(2))
						break;
					case "还款":
						data.chartData.series[0].data[4].value += e.money
						data.chartData.series[0].data[4].percentage = parseFloat((data.chartData.series[0].data[4].value / data.out * 100).toFixed(2))
						break;
					case "饮品":
						data.chartData.series[0].data[5].value += e.money
						data.chartData.series[0].data[5].percentage = parseFloat((data.chartData.series[0].data[5].value / data.out * 100).toFixed(2))
						break;
					case "服饰":
						data.chartData.series[0].data[6].value += e.money
						data.chartData.series[0].data[6].percentage = parseFloat((data.chartData.series[0].data[6].value / data.out * 100).toFixed(2))
						break;
					case "生活用品":
						data.chartData.series[0].data[7].value += e.money
						data.chartData.series[0].data[7].percentage = parseFloat((data.chartData.series[0].data[7].value / data.out * 100).toFixed(2))
						break;
					default:
						break;
				}
			})
			data.loading = false
		})
	}

	// 打开日历
	function open() : void {
		calendar.value.open()
	}

	function getLastDay(year : number, month : number) {
		return new Date(new Date(`${month < 12 ? year : ++year}-${month == 12 ? 1 : ++month} 00:00`).getTime() - 1).getDate()
	}



	// 月份选择
	function monthSwitch(e : any) {
		console.log(e);
		data.month = e.month
		data.endDate = e.year + e.month + "-" + getLastDay(parseInt(e.year), parseInt(e.month)).toString()
		data.startDate = `${e.year}-${e.month}-01`
		getWater()
	}

	// 返回
	function back() : void {
		uni.navigateBack()
	}

	onMounted(() => {
		let my = new Date()
		data.month = my.getMonth() + 1
		data.startDate = `${my.getFullYear()}-${my.getMonth() + 1}-01`
		data.endDate = `${my.getFullYear()}-${my.getMonth() + 1}-${getLastDay(my.getFullYear(), my.getMonth() + 1).toString()}`
		uni.getStorage({
			key: 'role'
		}).then((res) => {
			data.role = res.data
			data.api = uniCloud.importObject('flowing_water')
			getWater()
		})

	})
</script>

<style scoped>
	.topBar {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 14px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		z-index: 99;
	}

	.calendar {
		width: 34px;
		height: 34px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #f5f5f5;
	}

	.total {
		border-radius: 8px;
		background: #FAFAFA;
		width: 100%;
		margin-top: 68px;
		padding: 16px 18px;
	}

	.type {
		padding: 12px;
		width: 142px;
		border-radius: 8px;
		background: #FFF;
	}

	.detail {
		margin-top: 18px;
		border-radius: 8px;
		background: #FAFAFA;
		padding: 16px 18px;
		width: 100%;
		display: flex;
	}

	.list {
		margin-top: 24px;
		/* height: calc(100vh - 520px); */
		width: 100%;
		/* overflow-y: scroll; */
	}

	.item {
		border-radius: 8px;
		background: #FFF;
		padding: 12px;
		margin-bottom: 8px;
		width: 100%;
	}
</style>