module.exports = {
	shorten (number) {
		if(number / Math.pow(10, 3) < 1) return String(number)
  	if(number / Math.pow(10, 18) >= 1) return Math.round(number / Math.pow(10, 18)*100)/100+ 'Qt'
  	if(number / Math.pow(10, 15) >= 1) return Math.round(number / Math.pow(10, 15)*100)/100 + 'Qd'
  	if(number / Math.pow(10, 12) >= 1) return Math.round(number / Math.pow(10, 12)*100)/100 + 'T'
  	if(number / Math.pow(10, 9) >= 1) return Math.round(number / Math.pow(10, 9)*100)/100 + 'B'
  	if(number / Math.pow(10, 6) >= 1) return Math.round(number / Math.pow(10, 6)*100)/100 + 'M'
  	if(number / Math.pow(10, 3) >= 1) return Math.round(number / Math.pow(10, 3)*100)/100 + 'K'
	}
}