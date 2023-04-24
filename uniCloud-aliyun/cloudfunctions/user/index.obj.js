// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const user = db.collection('user');
module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */

	async login(userName = null, passWord = null) {

		// 参数校验，如无参数则不需要
		if (!userName) {
			return {
				errCode: 'USERNAME_IS_NULL',
				errMsg: '用户名不能为空'
			}
		}
		if (!passWord) {
			return {
				errCode: 'PASSWORD_IS_NULL',
				errMsg: '密码不能为空'
			}
		}
		// 业务逻辑
		let data = await user.where({
			user_name: userName,
			password: passWord
		}).get()

		data = data.data

		if (data.length == 0) {
			return {
				errCode: 'USER_IS_NULL',
				errMsg: '你不是该程序的用户，请联系帅哥添加'
			}
		} else {
			data = data[0]
			return {
				data
			}
		}


	}

}