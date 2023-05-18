<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.getStorage({
				key: '_id'
			}).then((res) => {
				uni.switchTab({
					url: "./pages/index/index"
				})
			}).catch(err => {
				uni.redirectTo({
					url: "./pages/login"
				})
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@font-face {
		font-family: "F";
		src: url("@/static/ZiZhiQuXiMaiTi-2.ttf");
	}

	@font-face {
		font-family: "M";
		src: url("@/static/MiSans-Regular.ttf");
	}

	html,
	body {
		font-family: "M";
		color: #242424;
	}

	view {
		box-sizing: border-box;
	}

	.flex {
		display: flex;
		align-items: center;
	}

	.c {
		color: rgba(36, 36, 36, 1);
	}

	.c04 {
		color: rgba(36, 36, 36, 0.4);
	}

	.c24 {
		color: #242424;
	}

	.fs12 {
		font-size: 24rpx;
	}

	.fs14 {
		font-size: 28rpx;
	}

	.fs16 {
		font-size: 32rpx;
	}

	.fs18 {
		font-size: 36rpx;
	}

	.fs20 {
		font-size: 40rpx;
	}

	.fw7 {
		font-weight: 700;
	}

	.fw6 {
		font-weight: 600;
	}

	.fw5 {
		font-weight: 500;
	}

	.fw4 {
		font-weight: 400;
	}

	.fw3 {
		font-weight: 300;
	}

	.box {
		height: 100%;
		width: 100%;
		padding: 62rpx 0rpx 0rpx 0rpx;
		position: relative;
	}
</style>