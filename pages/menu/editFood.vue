<template>
	<view class="box" v-if="data.data">
		<!-- 返回图片 -->
		<image src="@/static/back.svg" mode="aspectFill"
			style="margin-bottom: 86rpx;width: 40rpx;height: 28rpx;margin-top: 60rpx;" @click="back"></image>
		<!-- 添加图片 -->
		<view style="margin-bottom: 40rpx">
			<image v-if="data.data.url===''" src="@/static/addFoodCover.svg" mode="aspectFill"
				style="height: 160rpx;width: 220rpx;" @click="select">
			</image>

			<image v-else :src="data.data.url" mode="aspectFill" style="height: 160rpx;width: 220rpx;" @click="select">
			</image>

		</view>

		<view class="fs16 c24 fw6" style="position: relative;margin-left: 12rpx;">
			菜品名称
			<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
				src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="inputName">
			<input type="text" v-model="data.data.name">
		</view>

		<view class="typeList">
			<view v-for="(item,index) in data.typeList" :key="index"
				:class="[item.id===data.data.type?'selectType':'unselectType']" @click="chooseType(item.id)">
				{{item.name}}
			</view>
		</view>

		<view class="fs16 c24 fw6" style="position: relative;margin-left: 12rpx;">
			用料
			<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
				src="@/static/detailsBlue.svg" mode="aspectFill"></image>
		</view>

		<view class="materialList">

			<view class="c24 fs16" v-for="(item,index) in data.data.materialList" :key="index"
				style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 20rpx;">
				<view class="fw5 materialName">
					<input type="text" v-model="item.name" placeholder="食材名称" placeholder-class="placeholder">
				</view>
				<view class="fw4 materialDosage">
					<input type="text" v-model="item.dosage" style="text-align: right;" placeholder="用量"
						placeholder-class="placeholder">
				</view>
			</view>

			<view class="addIconBox" @click="addMaterial">
				<view class="addIcon">
					+
				</view>
			</view>

			<message v-if="data.showMessage" :title="data.title" />
		</view>

		<view class="stepBox">
			<view class="fs16 c24 fw6" style="position: relative;margin-left: 12rpx;">
				做法
				<image style="height: 11rpx;width: 60rpx;position: absolute;left: -12rpx;bottom: -6rpx;"
					src="@/static/detailsBlue.svg" mode="aspectFill"></image>
			</view>

			<view class="step" v-for="(item,index) in data.data.step" :key="index">
				<view class="stepTitle c24 fw7 fs14">
					步骤{{index+1}}
				</view>
				<view class="stepDetail">
					<!-- <input style="width: 100%;word-wrap:break-word; word-break:break-all; overflow: hidden;" type="text"
						class="c24 fs14" v-model="data.data.step[index]" placeholder="添加步骤说明"
						placeholder-class="placeholder2"> -->
					<textarea placeholder="添加步骤说明" placeholder-class="placeholder2" class="c24 fs14"
						v-model="data.data.step[index]" />

				</view>
			</view>
			<view class="addIconBox" @click="addStep">
				<view class="addIcon">
					+
				</view>
			</view>
		</view>

		<view class="submit" @click="submit">
			<view class="fs18">
				+
			</view>
			&nbsp;
			<view>
				修改
			</view>
		</view>

	</view>

</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";
	import message from "@/components/message.vue"
	import { textareaToHtml } from "@/utils.js"
	import {
		onShow,
		onLoad
	} from "@dcloudio/uni-app";
	const data = reactive({
		data: {
			name: "",
			url: "",
			type: "1",
			materialList: [
				{
					name: "",
					dosage: "",
				},
				{
					name: "",
					dosage: "",
				},
			],
			step: [
				"",
				"",
			]
		},
		showMessage: false,
		title: "",
		menuFun: null,
		typeList: [
			{ id: "1", name: "炒菜" },
			{ id: "2", name: "减脂" },
			{ id: "3", name: "小吃" },
			{ id: "4", name: "面食" },
			{ id: "5", name: "甜品" },
			{ id: "6", name: "饮品" },
			{ id: "7", name: "汤" },
		],
		id: "",
		choseImage: false
	})


	// 新增食材列表项
	function addMaterial() : void {

		data.data.materialList.push({ name: "", dosage: "" })
	}

	// 返回键
	function back() : void {
		uni.navigateBack()
	}

	// 提交新增
	async function submit() : Promise<any> {

		let list : any[] = []
		if (data.data.name === '') {
			data.title = "菜谱名呢？"
			data.showMessage = true
			return
		}
		if (data.data.url === '') {
			data.title = "图片呢？"
			data.showMessage = true
			return
		}

		// 用try和catch来退出foreach循环
		try {
			data.data.materialList.forEach(e => {
				if ((e.name === '' && e.dosage != '') || (e.dosage === '' && e.name != '')) {
					data.title = `"${e.name}${e.dosage}"这一栏还缺少东西哟！`
					data.showMessage = true
					throw new Error('1')
				} else if (e.name === '' && e.dosage === '') {
				} else {
					list.push(e)
				}
			})
			data.data.materialList = list
		} catch (e) {
			// 退出整个函数
			if (e.message === '1') {
				return
			}
		}

		let changeStep : string[] = []
		// 把步骤内容更新放入数组中
		for (let i = 0; i < data.data.step.length; i++) {
			if (data.data.step[i] === '') {
				data.data.step.splice(i, 1)
			} else {
				changeStep.push(textareaToHtml(data.data.step[i]))
			}
		}
		// console.log(changeStep);
		// console.log(data.data);
		let file : any = {}
		if (data.choseImage) {
			file = await upload()
		} else {
			file.fileID = data.data.url
		}

		// console.log(file.fileID);
		uni.getStorage({
			key: 'role'
		}).then(res => {
			data.menuFun.updateMenu(data.id, {
				name: data.data.name,
				url: file.fileID,
				type: data.data.type,
				materialList: data.data.materialList,
				step: changeStep,
				created_time: new Date().valueOf(),
				creater: res.data
			}).then(() => {
				data.title = "已更新！"
				data.showMessage = true
				uni.navigateBack(1)
			})
		})

	}

	// 选择上传的文件
	async function select() : Promise<any> {
		let filePath = await chooseFile()
		// console.log(filePath);
		data.data.url = filePath

		// 在APP平台才执行
		// #ifdef APP-PLUS
		let compressFile = await compressImage(filePath)
		data.data.url = compressFile
		// console.log(compressFile);
		// #endif



	}

	// 压缩图片
	function compressImage(e : any) : any {
		return new Promise((resolve) => {
			uni.compressImage({
				src: e,
				quality: 60,
				success: res => {
					resolve(res.tempFilePath)
				}
			})
		})

	}

	// 选择图片
	function chooseFile() : any {
		return new Promise((resolve) => {
			uni.chooseImage({
				count: 1, //默认100
				extension: ['.png', '.jpg'],
				success: function (res) {
					console.log(res);
					data.choseImage = true
					resolve(res.tempFilePaths[0])
				}
			});
		})
	}

	// 上传
	function upload() : any {
		return new Promise((resolve) => {
			let arr = data.data.url.split("/")
			uniCloud.uploadFile({
				filePath: data.data.url,
				cloudPath: "food/" + arr[arr.length - 1],
				success: (uploadFileRes) => {
					console.log(uploadFileRes);
					resolve(uploadFileRes)
				}
			});
		})

	}

	// 选择菜品类型
	function chooseType(e : string) : void {
		data.data.type = e
	}

	// 新增步骤
	function addStep() : void {
		data.data.step.push('')
	}





	onLoad((options) => {
		data.id = options.id
		data.menuFun = uniCloud.importObject('menu')
		data.menuFun.getDetail(data.id).then(res => {
			data.data = res.data
			if (!data.data.materialList) {
				data.data.materialList = [{ name: "", dosage: "" }]
			}
		})
	})
</script>

<style scoped>
	.box {
		padding: 46rpx 40rpx 0 40rpx;
	}

	.inputName {
		width: 100%;
		height: 92rpx;
		padding: 22rpx 40rpx 22rpx 28rpx;
		border: 2rpx solid rgba(36, 36, 36, 0.1);
		border-radius: 12rpx;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}

	.inputName input {
		font-size: 28rpx;
	}

	.materialList {
		margin-top: 20rpx;
		width: 100%;
		margin-bottom: 36rpx;
	}

	.material {
		margin-bottom: 20rpx;
		width: 100%;
		height: 112rpx;
		background: #FAFAFA;
		border-radius: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 40rpx 28rpx 28rpx;
	}

	.addIconBox {
		width: 112rpx;
		height: 112rpx;
		background: #FAFAFA;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.addIcon {
		width: 48rpx;
		height: 48rpx;
		border: 4rpx solid #242424;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit {
		width: calc(100vw - 80rpx);
		height: 112rpx;
		background: #C7E94E;
		border-radius: 24rpx;
		font-weight: 600;
		font-size: 28rpx;
		color: #242424;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 64rpx;
		border: 2rpx solid #242424;
		z-index: 9;
	}

	.imageStyles {
		height: 160rpx;
		width: 262rpx;
		object-fit: cover;
		background: url('@/static/addFoodCover.svg');
	}

	.upload>>>.uni-file-picker__lists {
		display: none;
	}

	.typeList {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 48rpx;
	}

	.selectType {
		padding: 16rpx 16rpx;
		background: #DDFF80;
		border: 2rpx solid #242424;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #242424;
		font-weight: 600;
	}

	.unselectType {
		padding: 16rpx 16rpx;
		background: #F5F5F5;
		border: 2rpx solid #F5F5F5;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: rgba(36, 36, 36, 0.3);
		font-weight: 600;
	}

	.materialName {
		width: 380rpx;
		padding: 28rpx 40rpx 28rpx 28rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
	}

	.materialDosage {
		width: 268rpx;
		padding: 28rpx 40rpx 28rpx 28rpx;
		background: #FAFAFA;
		border-radius: 16rpx;
	}

	.placeholder {
		font-weight: 500;
		font-size: 32rpx;
		color: rgba(36, 36, 36, 0.4);
	}

	.placeholder2 {
		font-weight: 500;
		font-size: 28rpx;
		color: rgba(36, 36, 36, 0.4);
	}

	.step {
		margin-bottom: 20rpx;
		width: 100%;
	}

	.stepTitle {
		text-align: center;
		font-weight: 700;
		font-size: 28rpx;
		color: #242424;
	}

	.stepDetail {
		padding: 28rpx 40rpx 28rpx 28rpx;
		width: 100%;
		background: #FAFAFA;
		border-radius: 16rpx;
		margin-top: 16rpx;
	}

	.stepBox {
		padding-bottom: 200rpx;
	}

	textarea {
		/* height: 40rpx; */
	}

	[contenteditable] {
		outline: 2rpx solid transparent;
		border: none;
		width: 100%;
	}

	[contenteditable]:focus {
		border: none;
		border-radius: 6rpx;
	}
</style>