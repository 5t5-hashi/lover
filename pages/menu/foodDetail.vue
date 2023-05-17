<template>
	<view>
		<view class="show">
			<image src="" mode=""></image>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		reactive,
		getCurrentInstance
	} from "vue";

	const options = getCurrentInstance()
	const data = reactive({
		menuFun: null
	})


	onMounted(() => {
		data.menuFun = uniCloud.importObject('menu')
		data.menuFun.getDetail(options.attrs.id)
		// console.log(options.attrs.id);
	})
</script>

<style scoped>
	.show {
		width: 100%;
		height: 249px;
	}
</style>