const vibrateShort = () => {
	uni.vibrateShort({
		success: function() {}
	});
}

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


const textareaToHtml = (str) => {
	if (str == null) {
		return "";
	} else if (str.length == 0) {
		return "";
	}
	str = str.replace(/\r\n/g, "<br>")
	str = str.replace(/\n/g, "<br>");
	str = str.replace(/\r/g, "<br>");
	str = str.replace(/( )/g, "&nbsp;")
	return str;
}



export {
	vibrateShort,
	getDate,
	textareaToHtml
}