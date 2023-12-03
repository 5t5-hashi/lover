<template>
	<view class="nav">
		<image src="@/static/back.svg" mode="aspectFill" @click="back" style="height: 10px;width: 10px;">
		</image>
		<view class="title">
			{{props.title}}
		</view>

	</view>
</template>

<script setup lang="ts">
	import {
		onMounted,
		reactive,
		ref,
	} from "vue";

	const props = defineProps({
		title: String
	})

	function back() {
		console.log(1);
		uni.navigateBack()
	}
</script>

<style scoped>
	.nav {
		width: 100%;
		height: 64px;
		text-align: center;
		padding-top: 28px;
		position: fixed;
		top: 0px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding-left: 32px;
		text-align: center;
		z-index: 9;
		background-color: #fff;
	}

	.title {
		margin-left: 50%;
		transform: translateX(-80%);
	}
</style>