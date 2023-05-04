// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const db = uniCloud.database();
const cat_flowing_water = db.collection('cat_flowing_water');
const dog_flowing_water = db.collection('dog_flowing_water');
const tabel = db.collection('tabel');
const dbCmd = db.command
// 时间转时间戳(获取清单时后端会先把时间戳转为0区的时间，这里再判断一下转为8区)
const changeDateGet = (e) => {
	if (new Date(e).getTimezoneOffset() == 0) {
		return new Date(new Date(e).getTime() + new Date(e).getTimezoneOffset() * 60 * 1000 - 8 * 60 *
			60 * 1000).valueOf()
	} else {
		return new Date(e).valueOf()
	}
}

// 时间转时间戳(把后端获取的前端传入的8区时间转为正常时间戳)
const changeDate = (e) => {
	return new Date(e).valueOf()
}
// 时间转换
const getDate = (day = 0, cut = 0, e = null) => {

	let mydate = e ? new Date(e) : new Date()
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
// 获取余额
const getBalance = async (e) => {
	let balance = null
	if (e === 'cat') {
		balance = await cat_flowing_water.get()
		return balance = balance.data[balance.data.length - 1].balance
	} else {
		balance = await dog_flowing_water.get()
		return balance = balance.data[balance.data.length - 1].balance
	}
}

// 获取星期数
const getWeek = (e) => {
	switch (e) {
		case 1:
			return "周一";
		case 2:
			return "周二";
		case 3:
			return "周三";
		case 4:
			return "周四";
		case 5:
			return "周五";
		case 6:
			return "周六";
		case 0:
			return "周日";
	}
}

module.exports = {
	_before: function() { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */

	async out(label, money, name, creater) {
		// 参数校验，如无参数则不需要
		if (!label) {
			return {
				errCode: 'LABEL_IS_NULL',
				errMsg: '标签不能为空'
			}
		}
		if (!money) {
			return {
				errCode: 'MONEY_IS_NULL',
				errMsg: '金额不能为空'
			}
		}
		if (!name) {
			return {
				errCode: 'NAME_IS_NULL',
				errMsg: '姓名不能为空'
			}
		}
		if (!creater) {
			return {
				errCode: 'CREATER_IS_NULL',
				errMsg: '创建人不能为空'
			}
		}

		// console.log(label, money, name, creater)
		// 获取余额
		let balanceCat = await getBalance('cat')
		let balanceDog = await getBalance('dog')
		money = parseFloat(money).toFixed(2)
		money = Number(money)
		if (creater === 'cat' && label === '643c0e9be766bb29750948b5') {
			cat_flowing_water.add({
				name: name,
				type: 1,
				money: money,
				balance: balanceCat - money,
				label: label,
				create_time: changeDate(Date.now())
			}).then(() => {
				dog_flowing_water.add({
					name: "转账",
					type: 2,
					money: money,
					balance: balanceDog + money,
					label: "643c0f0d819ce8bdcf7902ea",
					create_time: changeDate(Date.now())
				})
			})


		}
		if (creater === 'dog' && label === '643c0e9be766bb29750948b5') {
			dog_flowing_water.add({
				name: name,
				type: 1,
				money: money,
				balance: balanceDog - money,
				label: label,
				create_time: changeDate(Date.now())
			}).then(() => {
				cat_flowing_water.add({
					name: "转账",
					type: 2,
					money: money,
					balance: balanceCat + money,
					label: "643c0f0d819ce8bdcf7902ea",
					create_time: changeDate(Date.now())
				}).then(res => {
					console.log(res);
				})
			})
		}

		if (creater === 'dog' && label != '643c0e9be766bb29750948b5') {
			dog_flowing_water.add({
				name: name,
				type: 1,
				money: money,
				balance: balanceDog - money,
				label: label,
				create_time: changeDate(Date.now())
			})
		}

		if (creater === 'cat' && label != '643c0e9be766bb29750948b5') {
			cat_flowing_water.add({
				name: name,
				type: 1,
				money: money,
				balance: balanceCat - money,
				label: label,
				create_time: changeDate(Date.now())
			})
		}
		// 返回结果
		return {
			// data 
		}
	},

	async income(label, money, name, creater) {
		// 参数校验，如无参数则不需要
		if (!label) {
			return {
				errCode: 'LABEL_IS_NULL',
				errMsg: '标签不能为空'
			}
		}
		if (!money) {
			return {
				errCode: 'MONEY_IS_NULL',
				errMsg: '金额不能为空'
			}
		}
		if (!name) {
			return {
				errCode: 'NAME_IS_NULL',
				errMsg: '姓名不能为空'
			}
		}
		if (!creater) {
			return {
				errCode: 'CREATER_IS_NULL',
				errMsg: '创建人不能为空'
			}
		}

		money = parseFloat(money).toFixed(2)
		money = Number(money)
		// 获取余额
		let balanceCat = await getBalance('cat')
		let balanceDog = await getBalance('dog')
		if (creater === 'dog') {
			dog_flowing_water.add({
				name: name,
				type: 2,
				money: money,
				balance: balanceDog + money,
				label: label,
				create_time: changeDate(Date.now())
			})
		} else {
			cat_flowing_water.add({
				name: name,
				type: 2,
				money: money,
				balance: balanceCat + money,
				label: label,
				create_time: changeDate(Date.now())
			})
		}

	},

	async getWater(role, start, end) {
		if (!role) {
			return {
				errCode: 'ROLE_IS_NULL',
				errMsg: '角色不能为空'
			}
		}
		if (!start) {
			return {
				errCode: 'START_IS_NULL',
				errMsg: '开始时间不能为空'
			}
		}
		if (!end) {
			return {
				errCode: 'END_IS_NULL',
				errMsg: '结束时间不能为空'
			}
		}
		// 获取余额
		let water = null
		if (role === 'cat') {
			water = cat_flowing_water
		} else {
			water = dog_flowing_water
		}
		start = changeDateGet(start)
		end = changeDateGet(end)
		console.log(start, end);
		let data = await water.aggregate()
			.lookup({
				from: 'label',
				localField: 'label',
				foreignField: '_id',
				as: 'labelList',
			}).match({
				create_time: dbCmd.gt(start).and(dbCmd.lt(end))
			}).end()

		data = data.data

		// return
		let dateList = []
		for (let i = 0; i < data.length; i++) {
			data[i].type = data[i].labelList[0] //标签信息
			delete data[i].labelList
			data[i].create_time = getDate(0, 16, data[i].create_time) //创建时间转换
			data[i].week = getWeek(new Date(data[i].create_time).getDay()) //创建星期数
			dateList.push({
				date: data[i].create_time.slice(0, 10),
				week: data[i].week
			})
		}

		// 去掉重复的日期
		dateList = new Set(dateList.map(t => JSON.stringify(t)))
		dateList = [...dateList].map(s => JSON.parse(s))
		console.log(data, dateList);
		for (let i = 0; i < dateList.length; i++) {
			dateList[i].water = []
			dateList[i].outMoney = 0
			dateList[i].inMoney = 0
			dateList[i].outShow = true
			dateList[i].inShow = true
			for (let j = 0; j < data.length; j++) {
				if (dateList[i].date.slice(0, 10) === data[j].create_time.slice(0, 10)) {
					dateList[i].water.push(data[j])
					if (data[j].type.type === 1) {
						dateList[i].outMoney += data[j].money
					} else if (data[j].type.type === 2)
						dateList[i].inMoney += data[j].money
				}
			}
		}
		data = dateList


		return {
			data //请根据实际需要返回值
		}
	},

	async getTotal(role) {
		if (!role) {
			return {
				errCode: 'ROLE_IS_NULL',
				errMsg: '角色不能为空'
			}
		}
		let myDate = new Date()
		myDate = new Date(myDate.getTime() + myDate.getTimezoneOffset() * 60 * 1000 + 8 * 60 *
			60 * 1000)
		let y = myDate.getFullYear()
		let m = myDate.getMonth() + 1
		m = m < 10 ? "0" + m : m
		let start = y + "-" + m + "-" + "01 00:00:00"
		let nowNum = myDate.getDay()
		myDate.setMonth(m);
		myDate.setDate(0)
		let dayNum = myDate.getDate() //本月天数

		let end = y + "-" + m + "-" + dayNum + " 23:59:59"
		let water = null

		if (role === 'cat') {
			water = cat_flowing_water
		} else {
			water = dog_flowing_water
		}

		start = changeDateGet(start)
		end = changeDateGet(end)
		console.log(start, end);
		let data = await water.where({
			create_time: dbCmd.gt(start).and(dbCmd.lt(end))
		}).get()
		data = data.data

		let newData = {}
		newData.balance = data[data.length - 1].balance
		newData.outMoney = 0
		for (let i = 0; i < data.length; i++) {
			if (data[i].type === 1) {
				newData.outMoney += data[i].money
			}
		}
		newData.average = (newData.outMoney / nowNum).toFixed(2)

		data = newData
		return {
			data
		}
	}
}