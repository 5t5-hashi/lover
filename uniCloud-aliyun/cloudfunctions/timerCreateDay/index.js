'use strict';


exports.main = async (event, context) => {
	const db = uniCloud.database();
	const dbCmd = db.command;
	const plan_date = db.collection('menu_plan_date');

	let mydate = new Date()
	mydate = new Date(mydate.getTime() + mydate.getTimezoneOffset() * 60 * 1000 + 8 * 60 *
		60 * 1000)

	let y = mydate.getFullYear()
	let m = mydate.getMonth() + 1
	let d = mydate.getDate() + 2
	let h = mydate.getHours()
	let min = mydate.getMinutes()
	let s = mydate.getSeconds()
	m = m < 10 ? "0" + m : m
	d = d < 10 ? "0" + d : d
	h = h < 10 ? "0" + h : h
	min = min < 10 ? "0" + min : min
	s = s < 10 ? "0" + s : s
	let newDate = `${y}-${m}-${d}`

	await plan_date.add({
		date: newDate,
		breakfast: [],
		lunch: [],
		dinner: []
	})
	//返回数据给客户端
};