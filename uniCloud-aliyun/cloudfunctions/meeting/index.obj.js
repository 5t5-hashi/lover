// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const meeting = db.collection('meeting');
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	async getMeeting(type, keyWord) {
		// 参数校验，如无参数则不需要

		let data = await meeting.where({
			type: type,
			name: new RegExp(keyWord, 'g')
		}).get()
		// 业务逻辑
		data = data.data

		// 返回结果
		return {
			data //请根据实际需要返回值
		}
	},

	// 创建展览等
	async createMeeting(cover, name, address, date, time, remark, type, day) {
		let data = await meeting.add({
			cover: cover,
			name: name,
			address: address,
			date: date,
			time: time,
			remark: remark,
			type: type,
			day: day,
		})
	}
}