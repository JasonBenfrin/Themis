const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Database = require('@replit/database')
const db = new Database()
const Canvas = require('canvas')
const fs = require('fs')

Canvas.registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto'});
Canvas.registerFont('./fonts/Quicksand-Bold.ttf', {family: 'Quicksand'});
Canvas.registerFont('./fonts/Bungee-Regular.ttf', {family: 'Bungee'});
Canvas.registerFont('./fonts/Comfortaa-Bold.ttf', {family: 'Comfortaa'});
Canvas.registerFont('./fonts/Arvo-Regular.ttf', {family: 'Arvo'});

const wordle = JSON.parse(fs.readFileSync(__dirname+'/wordle/wordle.json'))

const yellow = '#c9b458'
const green = '#6aaa64'
const gray = '#787c7e'

const offset = 10
const offset2 = 5
const radius = 8
const rows = [['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']]

class Wordle {
	constructor(number, incomplete, wins, one, two, three, four, five, six) {
		this.number = number
		this.incomplete = incomplete
		this.wins = wins
		this.lost = number-incomplete-wins
		this.one = one
		this.two = two
		this.three = three
		this.four = four
		this.five = five
		this.six = six
	}
}

function createEmbed(win, word) {
	const embed = new MessageEmbed()
		.setColor('#ffffff')
		.setImage('attachment://wordle.png')
		.setFooter(`Guess a 5 letter word.\nThe game will end after 10 minutes of inactivity.`)
	if(win === true) {
		embed.setTitle('Brilliant!')
	}else if(win === false){
		embed.setTitle('Try again.')
		embed.setDescription(`The correct word was **${word.charAt(0).toUpperCase()+word.slice(1)}**.`)
	}else{
		embed.setTitle('Guess...')
	}
	return embed
}

function createCanvas(guesses) {
	const canvas = Canvas.createCanvas( 1000, 600 )
	const context = canvas.getContext('2d')
	let word = 0;
	for(j=0; j < canvas.height; j+=canvas.height/6) {
	  let letter = 0;
	  for(i=0; i < canvas.width/2; i+=canvas.width/10) {
			context.strokeStyle = '#999999'
			context.lineWidth = 3
			context.beginPath()
			context.arc(i+offset+radius, j+offset+radius, radius, 3*Math.PI/2, Math.PI, true)
			context.arc(i+offset+radius, j+(canvas.height-10)/6-radius, radius, Math.PI, Math.PI/2, true)
			context.arc(i+canvas.width/10-radius, j+(canvas.height-10)/6-radius, radius, Math.PI/2, 0, true)
			context.arc(i+canvas.width/10-radius, j+offset+radius, radius, 0, 3*Math.PI/2, true)
			context.closePath()
			context.stroke()
			if(guesses[word] && guesses[word][letter]) {
	      context.font = '60px Roboto'
	      context.fillStyle = guesses[word][letter].color
	      context.fill()
	      context.fillStyle = 'white'
				const length = context.measureText(guesses[word][letter].letter).width
	      context.fillText(guesses[word][letter].letter, i+offset+(canvas.width/10-offset)/2-length/2, j+offset+(canvas.height/6-offset)/2+18)
	    }
			letter++
		}
	word++
	}
	context.drawImage(keyboardCanvas(guesses),canvas.width/2+25,canvas.height/2-(175/2),450,157.5)
	return canvas
}

function keyboardCanvas(guesses) {
	const map = new Map()
	guesses.forEach(word => {
	  word.forEach(letter => {
			if(letter.color == green) {
				map.set(letter.letter, letter.color)
			}else if(letter.letter == yellow) {
				if(map.get(letter.letter) == gray) map.set(letter.letter, letter.color)
			}else{
				if(map.get(letter.letter) != green && map.get(letter.letter) != yellow) map.set(letter.letter, letter.color)
			}
	  })
	})
	const canvas = Canvas.createCanvas( 1000, 350 )
	const context = canvas.getContext('2d')
	let count = 0;
	for(j=0; j < canvas.height; j += canvas.height/3){
	  const rowOffset = canvas.width/10*count/2
	  let arrayCount = 0;
	  for(i=0; i < canvas.width/10*(10-count); i += canvas.width/10){
	    if(count == 2 && arrayCount == 7) break
	    context.beginPath()
	    context.arc(i+radius+rowOffset+offset2,j+radius+offset2,radius,Math.PI,3*Math.PI/2)
	    context.arc(i+canvas.width/10-radius+rowOffset-offset2,j+radius+offset2,radius,3*Math.PI/2,0)
	    context.arc(i+canvas.width/10-radius+rowOffset-offset2,j+canvas.height/3-radius-offset2,radius,0,Math.PI/2)
	    context.arc(i+radius+rowOffset+offset2,j+canvas.height/3-radius-offset2,radius,Math.PI/2,Math.PI)
	    context.closePath()
	    context.fillStyle = map.get(rows[count][arrayCount]) || '#222222'
	    context.fill()
	    context.fillStyle = '#ffffff'
	    context.font = '60px Roboto'
	    const width = context.measureText(rows[count][arrayCount]).width
	    context.fillText(rows[count][arrayCount],i+offset2+(canvas.width/10-offset2)/2-width/2+(count*canvas.width/20)-3,j+offset2+(canvas.height/3-offset2)/2+16)
	    arrayCount++
	  }
	  count++
	}
	return canvas
}

async function collect(interaction, word) {
	let state;
	const filter = m => {
		m.content = m.content.toLowerCase()
		if(m.author.id != interaction.user.id) return false
		if(m.content.length != 5) {
			(async () => {
				const reply = await m.reply('Not a 5 letter word')
				setTimeout(() => {
					reply.delete()
				}, 5000)
			})()
			return false
		}
		if(!wordle.words.includes(m.content) && !wordle.valid.includes(m.content)) {
			(async () => {
				const reply = await m.reply('Not a valid word')
				setTimeout(() => {
					if(m.channel.type != 'DM') {
						m.delete()
					}
					reply.delete()
				}, 5000)
			})()
			return false
		}
		return true
	}
	const guesses = []
	let channel = interaction.channel
	if(!channel) channel = await interaction.client.users.cache.get(interaction.user.id).createDM()
	const collector = await channel.createMessageCollector({ filter, time: 60000, max: 6 })
	const initialCanvas = createCanvas([])
	const initialAttachment = new MessageAttachment(initialCanvas.toBuffer(), "wordle.png")
	const initialEmbed = createEmbed()
	let interact = await interaction.followUp({ embeds: [initialEmbed], files: [initialAttachment], fetchReply: true })
	
	collector.on('collect', async m => {
		m.content = m.content.toLowerCase()
		guesses.push(makeArray(m.content, word))
		let embed;
		if(m.content == word) {
			state = true
			embed = createEmbed(true)
			collector.stop()
		}else if(collector.collected.size >= 6) {
			state = false
			embed = createEmbed(false, word)
			collector.stop()
		}else{
			embed = createEmbed()
		}
		const canvas = createCanvas(guesses)
		const attachment = new MessageAttachment(canvas.toBuffer(), 'wordle.png')
		await interact.removeAttachments()
		interact = await interaction.editReply({ embeds: [embed], files: [attachment], fetchReply: true })
		if(m.channel.type != 'DM') {
			m.delete()
		}
		collector.resetTimer()
	})
	
	collector.on('end', async (collected, reason) => {
		interaction.client.wordle.set(interaction.user.id,false)
		const users = await db.get('wordle')
		if(state === true) {
			users[interaction.user.id].wins++
			switch (collected.size) {
				case 1:
					users[interaction.user.id].one++
					break;
				case 2:
					users[interaction.user.id].two++
					break;
				case 3:
					users[interaction.user.id].three++
					break;
				case 4:
					users[interaction.user.id].four++
					break;
				case 5:
					users[interaction.user.id].five++
					break;
				case 6:
					users[interaction.user.id].six++
					break;
				default: console.log(collected.size)
			}
		}else if(state === false) {
			users[interaction.user.id].lost++
		}
		users[interaction.user.id].incomplete--
		db.set('wordle', users)
		if(reason == 'time') {
			interact.embeds[0].title = 'Timeout!'
			interact.embeds[0].description = `The correct word was ${word}`
			const m = await interaction.editReply({ embeds: interact.embeds, files: interact.attachments })
			m.removeAttachments()
		}
	})
}

function makeArray(word, answer) {
	const array = []
	const letterWord = word.toUpperCase().split('')
	const letterAnswer = answer.toUpperCase().split('')
	for(i=0; i<5; i++) {
		const obj = { letter: letterWord[i] }
		if(letterWord[i] == letterAnswer[i]) {
			obj.color = green
		}else if(letterAnswer.includes(letterWord[i])){
			obj.color = yellow
		}else{
			obj.color = gray
		}
		array.push(obj)
	}
	return array
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Play wordle!'),
	async execute(interaction) {
		if(interaction.client.wordle.get(interaction.user.id)) return interaction.reply({ content: 'You are already playing a Wordle. Please finish it first', ephemeral: true })
		await interaction.deferReply()
		const word = wordle.words[Math.floor(Math.random()*wordle.words.length)]
		const users = await db.get('wordle')
		if(!users[interaction.user.id]) {
			users[interaction.user.id] = new Wordle(1,1,0,0,0,0,0,0,0)
		}else{
			users[interaction.user.id].number++
			users[interaction.user.id].incomplete++
		}
		db.set('wordle',users)
		interaction.client.wordle.set(interaction.user.id, true)
		collect(interaction, word)
	},
};