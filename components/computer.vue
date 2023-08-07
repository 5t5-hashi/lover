<template>
	<view>
		<!-- 选项栏 -->
		<view class="selectType">
			<view :class="[data.type===1?'select':'unselect']" style="margin-right: 50rpx;" @click="selectType(1)">
				支出
			</view>
			<view :class="[data.type===2?'select':'unselect']" @click="selectType(2)">
				收入
			</view>
		</view>

		<view class="name">
			<input type="text" :value="data.name" style="width: 70%;" @input="inputName" placeholder="名称" />
		</view>
		<!-- 标签列表 -->
		<view class="labelList">
			<view :class="[data.label===item._id? 'labelSelect':'labelUnselect']" v-for="(item,index) in data.labelList"
				:key="index" @click="selectLabel(item._id)">
				{{item.name}}
			</view>
		</view>
		<view class="computerBox">
			<view class="moneyBar">
				<view style="text-align: center;width: 100%;font-size: 30px;font-weight: 600;">
					<view v-if="data.money==''" style="width: 100%;">
						￥0
					</view>
					<view v-else style="width: 100%;">
						￥{{data.money}}
					</view>
				</view>
				<img src="@/static/deleteMoney.svg" alt="">
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
					<view class="normal" @click="c('C')">
						.
					</view>
				</view>
				<view class="col">
					<view class="normal" style="color: #13DDE2;" @click="c('-')">
						C
					</view>
					<view class="normal" style="color: #13DDE2;" @click="c('+')">
						+
					</view>
					<view class="normal" style="color: #13DDE2;" @click="c('+')">
						-
					</view>
					<view class="normal" style="color: #13DDE2;" @click="finish">
						=
					</view>
				</view>
			</view>
			<view class="flex" style="font-size: 18px;justify-content: space-between;">
				<view class="cancel">
					取消
				</view>
				<view class="submit">
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
		type: 1,
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
			if (data.type === 1) {
				data.waterFun.out(data.label, parseFloat(data.money).toFixed(2), data.name, res.data).then(res => {
					emit('finish')
				})
			} else {
				data.waterFun.income(data.label, parseFloat(data.money).toFixed(2), data.name, res.data).then(res => {
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
		justify-content: center;
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


	.name {
		width: 100%;
		padding: 20px 16px;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 20px;
		background: #F8FBF0;
		margin-bottom: 12px;
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
		display: flex;
		padding: 14px 16px;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 14px;
		align-self: stretch;
		border-radius: 20px;
		background: #F8FBF0;
	}

	.labelSelect {
		padding: 18px 16px;
		align-items: center;
		border-radius: 32px;
		border: 1px solid #242424;
		background: #DDFF80;
		font-weight: 600;
	}

	.labelUnselect {
		padding: 18px 16px;
		align-items: center;
		border-radius: 32px;
		border: 1px solid #B1B1B1;
		font-weight: 600;
		color: #B1B1B1;
		border: 1px solid #B1B1B1;
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
		background: #F9F9F9;
		border-radius: 16rpx;
		margin-bottom: 12rpx;
		line-height: 102rpx;
		text-align: center;
		color: #4A3100;
		font-weight: 600;
	}

	.computerBox {
		background-color: #fff;
		position: absolute;
		bottom: 100px;
	}

	.moneyBar {
		width: 100%;
		padding: 16px;
		text-align: center;
		display: flex;
		justify-content: space-between;
	}

	.cancel {
		height: 58px;
		width: 100px;
		line-height: 58px;
		text-align: center;
		border-radius: 16px;
		border: 1px solid #242424;
	}

	.submit {
		height: 58px;
		width: 230px;
		line-height: 58px;
		text-align: center;
		border-radius: 16px;
		border: 1px solid #242424;
		background-color: #DDFF80;
	}
</style>