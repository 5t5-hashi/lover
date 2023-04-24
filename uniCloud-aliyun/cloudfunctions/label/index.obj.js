// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const label = db.collection('label');
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	async getLabel(type) {
		// 参数校验，如无参数则不需要
		if (!type) {
			return {
				errCode: 'TYPE_IS_NULL',
				errMsg: '类型不能为空'
			}
		}
		// 业务逻辑
		let data = await label.where({
			type: type,
		}).get()

		data = data.data
		// 返回结果
		return {
			data //请根据实际需要返回值
		}
	}


}