// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const dbCmd = db.command
const menu = db.collection('menu');
const plan = db.collection('menu_plan');
const getDate = (day = 0, cut = 0) => {

	let mydate = new Date()
	mydate = new Date(mydate.getTime() + mydate.getTimezoneOffset() * 60 * 1000 + 8 * 60 *
		60 * 1000)

	let y = mydate.getFullYear()
	let m = mydate.getMonth() + 1
	let d = mydate.getDate() + day
	let h = mydate.getHours()
	let min = mydate.getMinutes()
	let s = mydate.getSeconds()
	m = m < 10 ? "0" + m : m
	d = d < 10 ? "0" + d : d
	h = h < 10 ? "0" + h : h
	min = min < 10 ? "0" + min : min
	s = s < 10 ? "0" + s : s
	let date = `${y}-${m}-${d} ${h}:${min}:${s}`

	date = date.slice(0, cut)
	return date;
}

module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */

	// 创建菜单
	async createMenu(param) {

		// 业务逻辑
		console.log(param);
		let data = await menu.add(param)
		if (data) {
			return {
				data //请根据实际需要返回值
			}
		}
	},

	// 更新菜单
	async updateMenu(id, param) {
		let data = await menu.doc(id).update(param);
	},

	// 关键字模糊搜索获取列表
	async getList(keyWord, type, page, pageSize) {
		page = parseInt(page)
		pageSize = parseInt(pageSize)
		let data = null
		if (keyWord === '') {
			data = await menu.where({
					type: type
				}).orderBy("created_time", "desc").skip((page - 1) * pageSize) // 跳过前20条
				.limit(pageSize).get() // 获取20条.get()
		} else {
			data = await menu.where({
					name: new RegExp(keyWord),
					type: type
				}).orderBy("created_time", "desc").skip((page - 1) * pageSize) // 跳过前20条
				.limit(pageSize).get() // 获取20条.get()
		}
		data = data.data

		return {
			data
		}
	},

	// 获取菜谱详情
	async getDetail(id) {
		let data = await menu.where({
			_id: id
		}).limit(1).get()
		data = data.data[0]
		return {
			data
		}
	},

	// 获取饮食计划
	async getPlan() {
		let day1 = getDate(0, 10)
		let day2 = getDate(1, 10)
		let day3 = getDate(2, 10)
		console.log(day1, day2, day3)
		let data = await plan.where({
			date: dbCmd.or(dbCmd.eq(day1), dbCmd.eq(day2), dbCmd.eq(day3))
		}).get()

		data = data.data
		return {
			data
		}
	},

	// 清除全部数据
	clear() {
		menu.where({
			_id: dbCmd.exists(true)
		}).remove()
	},

	test() {
		menu.where({
			_id: dbCmd.exists(true)
		}).update({
			creater: "other"
		})
	}


}