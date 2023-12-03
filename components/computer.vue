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


		<!-- 标签列表 -->
		<view class="labelList">
			<view :class="[data.label===item._id? 'labelSelect':'labelUnselect']" v-for="(item,index) in data.labelList"
				:key="index" @click="selectLabel(item)">
				{{item.name}}
			</view>
		</view>

		<view class="name">
			<input type="text" :value="data.name" style="width: 70%;" @input="inputName" placeholder="名称" />
		</view>
		<view class="computerBox">
			<view class="moneyBar">
				<view style="text-align: center;width: 100%;font-size: 60rpx;font-weight: 600;">
					<view v-if="data.money==''" style="width: 100%;">
						￥0
					</view>
					<view v-else style="width: 100%;">
						￥{{data.money}}
					</view>
				</view>
				<img @click="c('back')" src="@/static/deleteMoney.svg" alt="">
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
					<view class="normal">

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
					<view class="normal" @click="c('.')">
						.
					</view>
				</view>
				<view class="col">
					<view class="normal" style="color: #13DDE2;" @click="c('reset')">
						C
					</view>
					<view class="normal" style="color: #13DDE2;" @click="c('+')">
						+
					</view>
					<view class="normal" style="color: #13DDE2;" @click="c('-')">
						-
					</view>
					<view class="normal" style="color: #13DDE2;" @click="c('=')">
						=
					</view>
				</view>
			</view>
			<view class="flex" style="font-size: 36rpx;justify-content: space-between;">
				<view class="cancel" @click="cancel">
					取消
				</view>
				<view class="submit" @click="finish">
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
		key: "",
		waterFun: null
	})

	const emit = defineEmits(['finish'])


	// 选择标签
	function selectLabel(e : any) : void {
		data.label = e._id
		data.name = e.name
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

		if (e === 'reset') {
			data.money = ''
		} else if (e === 'back') {
			data.money = data.money.toString()
			data.money = data.money.slice(0, data.money.length - 1)
		} else if (e === '=') {
			data.money = eval(data.money)
		} else {
			data.money += e
		}
	}

	// 获取支出类型
	function getOutTpye() : void {
		uni.getStorage({
			key: 'outType'
		}).then(res => {
			data.labelList = res.data
			data.name = data.labelList[0].name
			data.label = data.labelList[0]._id
		})
	}

	// 获取收入类型
	function getInTpye() : void {
		uni.getStorage({
			key: 'inType'
		}).then(res => {
			data.labelList = res.data
			data.name = data.labelList[0].name
			data.label = data.labelList[0]._id
		})
	}

	// 点击完成
	function finish() : void {
		if (data.money === '') {
			return
		}
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
			data.money = ""
		})
	}

	function cancel() : void {
		emit('finish')
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
		padding: 40rpx 32rpx;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 40rpx;
		background: #F8FBF0;
		margin-bottom: 24rpx;
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
		padding: 28rpx 32rpx;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 28rpx;
		align-self: stretch;
		border-radius: 40rpx;
		background: #F8FBF0;
		margin-bottom: 36rpx;
	}

	.labelSelect {
		padding: 36rpx 32rpx;
		align-items: center;
		border-radius: 64rpx;
		border: 2rpx solid #242424;
		background: #DDFF80;
		font-weight: 600;
	}

	.labelUnselect {
		padding: 36rpx 32rpx;
		align-items: center;
		border-radius: 64rpx;
		border: 2rpx solid #B1B1B1;
		font-weight: 600;
		color: #B1B1B1;
		border: 2rpx solid #B1B1B1;
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
		bottom: 200rpx;
		left: 0;
		right: 0;
		padding: 0 32rpx;
	}

	.moneyBar {
		width: 100%;
		padding: 32rpx;
		text-align: center;
		display: flex;
		justify-content: space-between;
	}

	.cancel {
		height: 116rpx;
		width: 200rpx;
		line-height: 116rpx;
		text-align: center;
		border-radius: 32rpx;
		border: 2rpx solid #242424;
	}

	.submit {
		height: 116rpx;
		width: 460rpx;
		line-height: 116rpx;
		text-align: center;
		border-radius: 32rpx;
		border: 2rpx solid #242424;
		background-color: #DDFF80;
	}
</style>