<template>
	<view class="box">
		<view class="loginText" style="font-family: F;">
			你是哪个?
		</view>
		<view class="roleList">
			<!-- 选猫 -->
			<image v-show="data.role==='cat'" class="img" src="@/static/loginCatSelect.svg" mode="aspectFit">
			</image>
			<!-- 未选猫 -->
			<image v-show="data.role==='dog'" class="img" @click="selectRole('cat')" src="@/static/loginCatUnselect.svg"
				mode="aspectFit">
			</image>
			<!-- 选狗 -->
			<image v-show="data.role==='dog'" class="img" src="@/static/loginDogselect.svg" mode="aspectFit">
			</image>
			<!-- 未选狗 -->
			<image v-show="data.role==='cat'" class="img" @click="selectRole('dog')" src="@/static/loginDogUnselect.svg"
				mode="aspectFit">
			</image>
		</view>

		<view class="passWrodBox">
			<view class="tips">
				请输入密码
			</view>
			<image class="X" src="@/static/X.svg" mode="aspectFill" @click="clearPassWrod"></image>
			<input class="uni-input" password type="text" :value="data.passWord" @input="inputPassword" />
		</view>

		<view class="buttonBox" @click="login">
			<view class="loginButton">登录</view>
		</view>

	</view>
</template>

<script setup lang="ts">
	import Md5 from 'js-md5'
	import {
		onMounted,
		reactive
	} from "vue";


	const data = reactive({
		userName: "18008300976",
		passWord: "",
		user_fun: null,
		label_fun: null,
		role: "cat"
	})

	function login() : void {
		if (data.role === 'cat') {
			data.userName = "13527373058"
		} else if (data.role === 'dog') {
			data.userName = "18008300976"
		}

		data.user_fun.login(data.userName, Md5(data.passWord)).then((res) => {
			uni.setStorage({
				key: '_id',
				data: res.data._id,
			}).then(() => {
				return uni.setStorage({
					key: 'name',
					data: res.data.name,
				})
			}).then(() => {
				return uni.setStorage({
					key: 'role',
					data: res.data.role_name,
				})
			}).then(() => {

				data.label_fun.getLabel(2).then(res => {
					uni.setStorage({
						key: 'inType',
						data: res.data,
					})
				})
				data.label_fun.getLabel(1).then(res => {
					uni.setStorage({
						key: 'outType',
						data: res.data,
					})
				})
				uni.switchTab({
					url: "./index/index"
				})
			})
		})
	}


	function inputPassword(e : any) : void {
		data.passWord = e.detail.value
	}

	function selectRole(e : string) : void {
		data.role = e
		console.log(e);
	}

	function clearPassWrod() : void {
		data.passWord = ""
	}

	onMounted(() : void => {
		data.user_fun = uniCloud.importObject('user')
		data.label_fun = uniCloud.importObject('label')
	})
</script>

<style scoped>
	input {
		border: 2rpx solid #000;
	}

	.box {
		padding: 0 60rpx;
		position: relative;
		height: 100%;
		width: 100%;
	}

	.loginText {
		margin-top: 78rpx;
		font-weight: 300;
		font-size: 52rpx;
		margin-bottom: 48rpx;
		text-align: center;
	}

	.roleList {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 86rpx;
	}

	.img {
		width: 292rpx;
		height: 194rpx;
	}

	.buttonBox {
		position: fixed;
		bottom: 104rpx;
		width: 630rpx;
	}

	.loginButton {
		width: 100%;
		height: 104rpx;
		line-height: 104rpx;
		text-align: center;
		background: #242424;
		border-radius: 114rpx;
		font-size: 40rpx;
		color: #FFFFFF;
	}

	.passWrodBox {
		width: 100%;
		height: 96rpx;
		border: 2rpx solid #242424;
		border-radius: 67rpx;
		position: relative;
	}

	.tips {
		position: absolute;
		font-weight: 500;
		font-size: 24rpx;
		text-align: center;
		color: #242424;
		background-color: #FFFFFF;
		width: 130rpx;
		height: 44rpx;
		left: 86rpx;
		top: -18rpx;
	}

	.X {
		width: 24rpx;
		height: 24rpx;
		position: absolute;
		right: 36rpx;
		top: 36rpx;
	}

	uni-input {
		border: none;
		position: absolute;
		left: 56rpx;
		top: 24rpx;
	}
</style>