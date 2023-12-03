// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj


// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const schedule = db.collection('schedule');
const dbCmd = db.command
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} role 角色
	 * @param {string} date 时间
	 * @returns {object} 返回值描述
	 */

	async getSchedule(role, date) {
		// 参数校验，如无参数则不需要
		console.log(role, date);
		// 业务逻辑
		let data = await schedule.where({
			created: date,
			role: role
		}).get()
		// 返回结果
		data = data.data
		return {
			data //请根据实际需要返回值
		}
	},

	async updateSchedule(id, status) {
		// 参数校验，如无参数则不需要
		// 业务逻辑
		let data = await schedule.doc(id).update({
			status: status,
		})
		// 返回结果
		data = data.data
		return {}
	},

	async createSchedule(name, role, created) {
		// 参数校验，如无参数则不需要
		// 业务逻辑
		let data = await schedule.add({
			name: name,
			role: role,
			status: "doing",
			created: created
		})
		// 返回结果
		return {}
	}
}