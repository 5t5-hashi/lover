<template>
	<view class="box">
		<view class="loginText" style="font-family: F;">
			登录
		</view>
		<view class="roleList">
			<!-- 选猫 -->
			<image v-show="data.role==='cat'" class="img"
				src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/abcb5947-5543-493a-a633-3aeae4df4c5f.svg"
				mode="aspectFit">
			</image>
			<!-- 未选猫 -->
			<image v-show="data.role==='dog'" class="img" @click="selectRole('cat')"
				src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/1d5822d9-25d6-4f58-bbab-e922aebb0d06.svg"
				mode="aspectFit">
			</image>
			<!-- 选狗 -->
			<image v-show="data.role==='dog'" class="img"
				src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/d7c583b1-24f4-455a-9dbb-ce60af2861bb.svg"
				mode="aspectFit">
			</image>
			<!-- 未选狗 -->
			<image v-show="data.role==='cat'" class="img" @click="selectRole('dog')"
				src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/0fa83ec0-70e6-4fdb-b023-9e1d556d1b7f.svg"
				mode="aspectFit">
			</image>
		</view>

		<view class="passWrodBox">
			<view class="tips">
				请输入密码
			</view>
			<image class="X"
				src="https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/e0e4c7ff-4043-4d64-ad6d-13d15ba39be5.svg"
				mode="aspectFill" @click="clearPassWrod"></image>
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
		font-weight: 500;
		font-size: 64rpx;
		margin-bottom: 48rpx;
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