<template>
	<view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content"><text class="text">{{props.title}}</text></view>
		</uni-popup>
	</view>
</template>

<script lang="ts" setup>
	import { onMounted, ref } from "vue";



	const props = defineProps({
		title: String
	})

	const popup = ref()


	onMounted(() => {
		popup.value.open('center')
	})
</script>

<style scoped>

</style>