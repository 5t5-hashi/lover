<template>
	<view class="box">
		<!-- 返回图片 -->
		<image src="@/static/back.svg" mode="aspectFill"
			style="margin-bottom: 43px;width: 20px;height: 14px;margin-top: 30px;" @click="back"></image>
		<!-- 添加图片 -->
		<view style="margin-bottom: 20px" @click="uploadImg">
			<image v-if="data.data.url===''" src="@/static/addFoodCover.svg" mode="aspectFill"
				style="height: 80px;width: 131px;" @click="select">
			</image>

			<image v-else :src="data.data.url" mode="aspectFill" style="height: 80px;width: 131px;" @click="select">
			</image>

		</view>

		<view class="fs16 c24 fw6">
			菜谱名
		</view>

		<view class="inputName">
			<input type="text" v-model="data.data.name">
		</view>

		<view class="fs16 c24 fw6">
			所需食材
		</view>

		<view class="materialList">
			<view class="material c24 fs16" v-for="(item,index) in data.data.material_list" :key="index">
				<view class="fw5">
					<input type="text" v-model="item.name">
				</view>
				<view class="fw4">
					<input type="text" v-model="item.dosage" style="text-align: right;">
				</view>
			</view>

			<view class="addIconBox" @click="addMaterial">
				<view class="addIcon">
					+
				</view>
			</view>

			<view class="submit" @click="submit">
				<view class="fs18">
					+
				</view>
				&nbsp;
				<view>
					上传
				</view>
			</view>

			<message v-if="data.showMessage" :title="data.title" />
		</view>
	</view>

</template>

<script setup lang="ts">
	import { onMounted, reactive } from "vue";
	import message from "@/components/message.vue"

	const data = reactive({
		data: {
			name: "红烧猪蹄",
			// url: "https://qn.antdv.com/vue.png",
			url: "",
			type: "1",
			material_list: [
				{
					name: "猪蹄",
					dosage: "2斤"
				},
				{
					name: "大蒜",
					dosage: "半个"
				}
			]
		},
		showMessage: false,
		title: "",
		menu_fun: null
	})

	// 上传图片
	function uploadImg() : void {

	}

	// 新增食材列表项
	function addMaterial() : void {
		data.data.material_list.push({ name: "", dosage: "" })
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
			data.data.material_list.forEach(e => {
				if (e.name === '' || e.dosage === '') {
					data.title = `"${e.name}${e.dosage}"这一栏还缺少东西哟！`
					data.showMessage = true
					throw new Error('1')
				} else if (e.name === '' && e.dosage === '') {
				} else {
					list.push(e)
				}
			})
			data.data.material_list = list
		} catch (e) {
			// 退出整个函数
			if (e.message === '1') {
				return
			}
		}

		let file = await upload()
		console.log(file.fileID);
		data.menu_fun.createMenu({
			name: data.data.name,
			url: file.fileID,
			type: data.data.type,
			material_list: data.data.material_list
		}).then(res => {
			data.title = "已创建！"
			data.showMessage = true
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

	onMounted(() => {
		data.menu_fun = uniCloud.importObject('menu')
	})
</script>

<style scoped>
	.box {
		padding: 23px 20px 0 20px;
	}

	.inputName {
		width: 100%;
		height: 46px;
		padding: 11px 20px 11px 14px;
		border: 1px solid rgba(36, 36, 36, 0.1);
		border-radius: 6px;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	.inputName input {
		font-size: 14px;
	}

	.materialList {
		margin-top: 10px;
		width: 100%;
	}

	.material {
		margin-bottom: 10px;
		width: 100%;
		height: 56px;
		background: #FAFAFA;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 20px 14px 14px;
	}

	.addIconBox {
		width: 56px;
		height: 56px;
		background: #FAFAFA;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.addIcon {
		width: 24px;
		height: 24px;
		border: 2px solid #242424;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.submit {
		width: calc(100vw - 40px);
		height: 56px;
		background: #C7E94E;
		border-radius: 12px;
		font-weight: 600;
		font-size: 14px;
		color: #242424;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 32px;
	}

	.imageStyles {
		height: 80px;
		width: 131px;
		object-fit: cover;
		background: url('@/static/addFoodCover.svg');
	}

	.upload>>>.uni-file-picker__lists {
		display: none;
	}
</style>