const vibrateShort = () => {
	uni.vibrateShort({
		success: function() {}
	});
}

const getDate = (day = 0, cut = 0) => {
	let mydate = new Date()
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

export {
	vibrateShort,
	getDate
}