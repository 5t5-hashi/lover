<template>
	<view>
		<!-- 选项栏 -->
		<view class="selectType">
			<view :class="[data.type===0?'select':'unselect']" style="margin-right: 50rpx;" @click="selectType(0)">
				支出
			</view>
			<view :class="[data.type===1?'select':'unselect']" @click="selectType(1)">
				收入
			</view>
		</view>
		<!-- 金额名称行 -->
		<view class="moneyNameBox">
			<view class="money">
				<view class="label">
					金额
				</view>
				<view class="value">
					<view class="flex">
						<view class="">
							￥
						</view>
						<view style="max-width: 140rpx;overflow-x: scroll;">
							{{data.money}}
						</view>

					</view>

				</view>
			</view>
			<view style="height: 2rpx;width: 20rpx;"></view>
			<view class="name">
				<view class="label">
					名称
				</view>
				<view class="value">
					<input type="text" :value="data.name" style="width: 70%;" @input="inputName" />
				</view>
			</view>
		</view>
		<!-- 标签列表 -->
		<view class="labelList">
			<view :class="[data.label===item._id? 'labelSelect flex':'labelUnselect flex']"
				v-for="(item,index) in data.labelList" :key="index" @click="selectLabel(item._id)">
				<image class="img" :src="item.icon" mode="aspectFill"></image>
				<view>
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="computer">
			<!-- 分四列 -->
			<view class="col">
				<view class="normal" @click="c('7')">
					7
				</view>
				<view class="normal" @click="c('4')">
					4
				</view>
				<view class="normal" @click="c('1')">
					1
				</view>
				<view class="normal" @click="c('.')">
					.
				</view>
			</view>
			<view class="col">
				<view class="normal" @click="c('8')">
					8
				</view>
				<view class="normal" @click="c('5')">
					5
				</view>
				<view class="normal" @click="c('2')">
					2
				</view>
				<view class="normal" @click="c('0')">
					0
				</view>
			</view>
			<view class="col">
				<view class="normal" @click="c('9')">
					9
				</view>
				<view class="normal" @click="c('6')">
					6
				</view>
				<view class="normal" @click="c('3')">
					3
				</view>
				<view class="normal" style="background: #F8F8F8;" @click="c('C')">
					C
				</view>
			</view>
			<view class="col">
				<view class="normal" style="background: #F2FFC5;" @click="c('-')">
					-
				</view>
				<view class="normal" style="background: #F2FFC5;height: 216rpx;line-height: 216rpx;" @click="c('+')">
					+
				</view>
				<view class="normal" style="background: #C7E94E;" @click="finish">
					完成
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { reactive, onMounted } from "vue";
	import { vibrateShort } from "@/utils.js"
	const data = reactive({
		name: "",
		money: "",
		type: 0,
		labelList: [
		],
		label: 1,
		record: "",
		logic: "",
		value1: "",
		value2: "",
		key: "",
		waterFun: null
	})

	const emit = defineEmits(['finish'])


	// 选择标签
	function selectLabel(e : number) : void {
		data.label = e
	}

	// 选择类型
	function selectType(e : number) : void {
		data.type = e
		if (e === 2) {
			getInTpye()
		} else {
			getOutTpye()
		}
	}

	function c(e : string) : void {
		vibrateShort();

		if (e === 'C') {
			data.logic = ""
			data.value1 = ""
			data.value2 = ""
			data.money = ""
			data.key = ""
			data.record = ""
		} else if (e === '+') {
			// 如果重复点击两次则不执行
			if (data.key === e || data.key === "") {
				return
			}
			// 如果第一次输入值（还未输入任何运算符的时候）
			if (data.value1 == "") {
				data.value1 = data.value2
			} else {
				// 已经输入过运算符的时候
				if (data.logic === "+") {
					data.value1 = (parseFloat(data.value1) + parseFloat(data.value2)).toString()
				} else if (data.logic === "-") {
					data.value1 = (parseFloat(data.value1) - parseFloat(data.value2)).toString()
				}
			}
			data.value2 = ""
			console.log(`value1:${data.value1}`);
			data.logic = "+"
			data.record += "+"

		} else if (e === "-") {
			// 如果重复点击两次则不执行
			if (data.key === e || data.key === "") {
				return
			}
			// 如果第一次输入值（还未输入任何运算符的时候）
			if (data.value1 == "") {
				data.value1 = data.value2
			} else {
				// 已经输入过运算符的时候
				if (data.logic === "+") {
					data.value1 = (parseFloat(data.value1) + parseFloat(data.value2)).toString()
				} else if (data.logic === "-") {
					data.value1 = (parseFloat(data.value1) - parseFloat(data.value2)).toString()
				}
			}
			data.value2 = ""
			console.log(`value1:${data.value1}`);
			data.logic = "-"
			data.record += "-"
		} else {
			// 如果输入的数字,更新value2

			if (e == ".") {
				console.log(data.value2.indexOf("."));
				// 判断输入.时,已经有.的话就不叠加,没有的话就加
				if (data.value2.indexOf(".") == -1) {
					data.value2 += e
					data.record += e
				} else {

				}
			} else {
				data.value2 += e
				data.record += e
			}

			if (data.logic === '+') {
				data.money = (parseFloat(data.value1) + parseFloat(data.value2)).toFixed(2).toString()
				// console.log(data.record);
				// data.record += e
				// console.log(`总和${parseFloat(data.value1) + parseFloat(data.value2)}`);
				// console.log(`value1=${parseFloat(data.value1)},value2=${parseFloat(data.value2)}`);
			} else if (data.logic === '-') {
				// data.record += e
				data.money = (parseFloat(data.value1) - parseFloat(data.value2)).toFixed(2).toString()
				// console.log(`总和${parseFloat(data.value1) - parseFloat(data.value2)}`);
				// console.log(`value1=${parseFloat(data.value1)},value2=${parseFloat(data.value2)}`);
			} else if (data.logic === '') {

				data.money = data.value2
				// console.log(`value1=${data.value1},value2=${data.value2}`);
				// console.log(`value1=${parseFloat(data.value1)},value2=${parseFloat(data.value2)}`);
			}

		}
		// 记录这次点击的按键
		data.key = e
	}

	// 获取支出类型
	function getOutTpye() : void {
		uni.getStorage({
			key: 'outType'
		}).then(res => {
			data.labelList = res.data
			data.labelList.forEach(e => {
				e.icon = "https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/2e05bd6e-2cf6-43a6-a076-1fe3e8ff202f.svg"
			})
			data.label = data.labelList[0]._id
		})
	}

	// 获取收入类型
	function getInTpye() : void {
		uni.getStorage({
			key: 'inType'
		}).then(res => {
			data.labelList = res.data
			data.labelList.forEach(e => {
				e.icon = "https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/2e05bd6e-2cf6-43a6-a076-1fe3e8ff202f.svg"
			})
			data.label = data.labelList[0]._id
		})
	}

	// 点击完成
	function finish() : void {

		uni.getStorage({
			key: 'role'
		}).then(res => {
			if (data.type === 0) {
				data.waterFun.out(data.label, parseInt(data.money), data.name, res.data).then(res => {
					emit('finish')
				})
			} else {
				data.waterFun.income(data.label, parseInt(data.money), data.name, res.data).then(res => {
					emit('finish')
				})
			}
			data.logic = ""
			data.value1 = ""
			data.value2 = ""
			data.money = ""
			data.key = ""
			data.record = ""
		})
	}

	// 输入名字
	function inputName(e : any) : void {
		data.name = e.detail.value
	}

	onMounted(() : void => {
		getOutTpye()
		data.waterFun = uniCloud.importObject('flowing_water')
	})
</script>

<style scoped>
	.selectType {
		margin-left: 40rpx;
		display: flex;
		align-items: center;
		margin-bottom: 38rpx;
	}

	.select {
		font-weight: 600;
		font-size: 36rpx;
		position: relative;
	}

	.select::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: -4rpx;
		width: 72rpx;
		height: 6rpx;
		background: #13DDE2;
		border-radius: 20rpx;
	}

	.unselect {
		font-weight: 600;
		font-size: 36rpx;
		opacity: 0.4;
	}

	.moneyNameBox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.money {
		width: 250rpx;
		height: 170rpx;
		background: #FAFAFA;
		border-radius: 48rpx;
	}

	.name {
		width: 460rpx;
		height: 170rpx;
		background: #FAFAFA;
		border-radius: 48rpx;
	}

	.label {
		margin-top: 36rpx;
		margin-left: 40rpx;
		font-weight: 500;
		font-size: 24rpx;
	}

	.value {
		margin-top: 18rpx;
		margin-left: 40rpx;
		font-weight: 600;
		font-size: 36rpx;
		color: #242424;
	}

	.labelList {
		margin-top: 24rpx;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 74rpx;
	}

	.labelSelect {
		padding: 16rpx 20rpx;
		background: #FAFAFA;
		border: 2rpx solid #C7E94E;
		border-radius: 36rpx;
		font-weight: 500;
		font-size: 28rpx;
		margin-right: 32rpx;
	}

	.labelUnselect {
		padding: 16rpx 20rpx;
		background: #FAFAFA;
		border-radius: 36rpx;
		border: 2rpx solid #FAFAFA;
		font-weight: 500;
		font-size: 28rpx;
		opacity: 0.4;
		margin-right: 32rpx;
	}

	.img {
		height: 38rpx;
		width: 38rpx;
		margin-right: 4rpx;
	}

	.computer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.col {
		width: 164rpx;
	}

	.normal {
		width: 100%;
		height: 102rpx;
		background: #F6F9EB;
		border-radius: 16rpx;
		margin-bottom: 12rpx;
		line-height: 102rpx;
		text-align: center;
		color: #4A3100;
		font-weight: 600;
	}
</style>