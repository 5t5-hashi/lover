// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const goal = db.collection('goal');
const goalDetail = db.collection('goal_detail');
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} role  角色
	 * @returns {object} 返回值描述
	 */
	async getGoal(role) {
		// 参数校验，如无参数则不需要

		// 业务逻辑
		let data = await goal.aggregate()
			.lookup({
				from: 'goal_detail',
				localField: '_id',
				foreignField: 'goal_id',
				as: 'goalDetail',
			}).match({
				status: "doing",
				role: role
			}).end()
		data = data.data

		// let res = await goal.where({
		// 	status: "doing"
		// }).get()

		// 返回结果
		return {
			data //请根据实际需要返回值
		}
	},

	// 删除目标
	async deleteGoal(id) {
		let data = await goal.doc(id).remove();
	},

	// 完成子项
	async finishGoalDetail(id) {
		let data = await goalDetail.doc(id).update({
			status: "done",
		});
	},

	// 完成目标
	async finishGoal(id) {
		let data = await goal.doc(id).update({
			status: "done",
		})
	},

	// 修改目标子标题
	async editGoalItem(id, name) {
		let data = await goalDetail.doc(id).update({
			name: name,
		})
	},

	// 修改目标结束时间
	async editGoalEnd(id, end) {
		let data = await goal.doc(id).update({
			end: end,
		})
	},

	// 创建目标子项
	async createGoalItem(id, name) {
		let data = await goalDetail.add({
			goal_id: id,
			name: name,
			status: "doing"
		})
	},

	// 获取目标详情
	async getDetail(id) {
		let data = await goal.aggregate()
			.lookup({
				from: 'goal_detail',
				localField: '_id',
				foreignField: 'goal_id',
				as: 'goalDetail',
			}).match({
				_id: id,
			}).end()
		data = data.data[0]
		return {
			data //请根据实际需要返回值
		}
	},
}