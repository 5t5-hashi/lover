<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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
		src: url("https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/9d6f776a-1e86-4ddb-8edc-57044c67cfc9.ttf");
	}

	@font-face {
		font-family: "M";
		src: url("https://mp-cae3c1d7-74fb-4f52-84ba-3c33657821e3.cdn.bspapp.com/cloudstorage/a007e754-2772-4be7-b0eb-940816788978.ttf");
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

	.fs12 {
		font-size: 24rpx;
	}

	.fs16 {
		font-size: 32rpx;
	}

	.fs18 {
		font-size: 36rpx;
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

	.box {
		height: 100%;
		width: 100%;
		padding: 62rpx 0rpx 0rpx 0rpx;
	}
</style>