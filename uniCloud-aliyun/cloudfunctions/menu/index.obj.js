// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const menu = db.collection('menu');
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */

	async createMenu(param) {

		// 业务逻辑
		console.log(param);
		let data = await menu.add(param)
		if (data) {
			return {
				data //请根据实际需要返回值
			}
		}


	}

}