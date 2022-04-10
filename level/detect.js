const fs = require('fs')
const Database = require('@replit/database')
const db = new Database()
const levels = JSON.parse(fs.readFileSync(__dirname + '/levelTotal.json'))

class User {
	constructor(name, level, exp, count) {
		this.name = name
		this.level = level
		this.exp = exp
		this.count = count
	}
}

class Recent {
	constructor(time, msg) {
		this.time = time
		this.msg = msg
	}
}

async function levelUp(message) {
	/*
		How is the level calculated?
		Each level has total experience (including previous levels)
		100 * (exp ^ sqrt(level))
		Then we round it to the nearest 5(s)
		The difference between each level is what it actually needs between each level
		What happened on Level 2?
		The difference between 2 and 1 is inconsistent compared to others.
		Thus we manually lowered it down to 125
		Go to last line of this script
	*/
	const length = message.content.length
	let lvl = await db.get('lvl')
	let user = lvl[message.author.id]
	if(!user) {
		user = new User(message.author.tag,0,calculateExp(length, 1, 0),1)
		lvl[message.author.id] = user
		return db.set('lvl', lvl)
	}
	user.name = message.author.tag
	user.count++;
	user.exp += calculateExp(length, user.count, user.level)
	user.level = updateLevel(user.exp, user.level, message)
	lvl[message.author.id] = user
	await db.set('lvl',lvl)
}

function calculateExp(length, count, lvl) {
	if (length > 15) length = 15
	if (lvl == 0) lvl = 1
	// Math.round(count/(lvl*Math.sqt(lvl))) = countBenefit
	// Math.ceil(length/2.5) = lengthBenefit
  return Math.round(count/(lvl*Math.sqrt(lvl))) + Math.ceil(length/2.5)
}

function updateLevel(exp, lvl, message) {
	const nextLevel = levels[lvl+1]
	const nextTwoLevel = levels[lvl+2]
	const currentLevel = levels[lvl]
	if(exp >= nextTwoLevel && exp < nextLevel) return lvl+1
	if(exp >= nextLevel) {
		const channel = message.client.channels.cache.get('961586482626322452')
		channel.send(`<@${message.author.id}> leveled up to level ${lvl+1}!`)
		return lvl+1
	}
	return lvl
}

module.exports = {
	detect(message) {
		if(message.author.bot) return
		if(message.guildId != '880856257991409704') return
		const client = message.client

		//Spam Detection
		const spam = client.spamDetect
		const recent = spam.get(message.author.id)
		if(!recent) {
			levelUp(message)
			return spam.set(message.author.id, new Recent(new Date(), message.content))
		}
		if(new Date() - recent.time > 10000 && recent.msg != message.content) {
			levelUp(message)
			return spam.set(message.author.id, new Recent(new Date(), message.content))
		}
		spam.set(message.author.id, new Recent(recent.time, message.content))
	}
}

/* From up there 
	const map = new Map()
	const level = 1000
	let i = 0
	while(i < level) {
	    let calc = Math.round(100 * Math.exp(Math.sqrt(i)))
	    if(calc%5 != 0) {
	        const digit = calc%10
	        if(digit < 5){
	            calc = Math.floor(calc/10)*10 + 5
	        }else{
	            calc = Math.floor(calc/10)*10 + 10
	        }
	    }
	    map[i+1] = calc
	    i++
	}
	
	console.log(map)
	
	const dif = new Map()
	
	let j = 2
	while(j<=level) {
	    dif[j] = map[j] - map[j-1]
	    j++
	}
	
	console.log(dif)
*/