const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const Database = require('@replit/database')
const db = new Database()

Canvas.registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto'});
Canvas.registerFont('./fonts/Quicksand-Bold.ttf', {family: 'Quicksand'});
Canvas.registerFont('./fonts/Bungee-Regular.ttf', {family: 'Bungee'});
Canvas.registerFont('./fonts/Comfortaa-Bold.ttf', {family: 'Comfortaa'});
Canvas.registerFont('./fonts/Arvo-Regular.ttf', {family: 'Arvo'});

const radius = 10
const offset = 8

class User {
	constructor(number, incomplete, wins, highscore) {
		this.number = number
		this.incomplete = incomplete
		this.wins = wins
		this.lost = number - incomplete - wins
		this.highscore = highscore
	}
}

function createButton() {
	const row = new MessageActionRow()
		.addComponents(
			[
				new MessageButton()
					.setCustomId('left')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('up')
					.setEmoji('🔼')
					.setStyle('PRIMARY'),
			 	new MessageButton()
				 	.setCustomId('down')
				 	.setEmoji('🔽')
				 	.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('right')
					.setEmoji('▶️')
					.setStyle('PRIMARY')
			]
		)
	return row
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('2048')
		.setDescription('Play 2048.'),
	async execute(interaction) {
		const users = await db.get('2048')
		if(!users[interaction.user.id]) {
			users[interaction.user.id] = new User(1,1,0,0)
		}else{
			users[interaction.user.id].number++
			users[interaction.user.id].incomplete++
		}
		await db.set('2048',users)
		
		let triggered = false
		await interaction.deferReply()
		let array = []
		let score = 0
		let previous;
		for(a=0;a<4;a++) {
		  array[a] = Array(4).fill(0)
		}

		generate()
		generate(true)
		function generate(ignore) {
		  let go = false
		  for(let k=0;k<4;k++) {
		    if(array[k].includes(0)) {
		      go = true
		      break;
		    }
		  }
		  if(!go) return
		  if(JSON.stringify(array) === JSON.stringify(previous) && !ignore) return
		  const rowRan = Math.floor(Math.random()*4)
		  const ran = Math.floor(Math.random()*4)
		  if(array[rowRan][ran] == 0) {
		    const weight = Math.random()
		    if(weight<0.9) {
		      array[rowRan][ran] = 2
		    }else array[rowRan][ran] = 4
		  }else generate(ignore)
		  previous = JSON.parse(JSON.stringify(array))
		}

		function moveable() {
		  for(let k=0;k<4;k++) {
		    if(array[k].includes(0)) return true
		  }
		  let moves = 16
		  for(let k=0;k<4;k++) {
		    for(j=0;j<4;j++) {
		      let count = 0
		      const num = array[k][j]
		      if(array[k-1]) {
		        if(array[k-1][j] != num) count++
		      }
		      if(array[k+1]) {
		        if(array[k+1][j] != num) count++
		      }
		      if(array[k][j-1]) {
		        if(array[k][j-1] != num) count++
		      }
		      if(array[k][j+1]) {
		        if(array[k][j+1] != num) count++
		      }
		      if(k%3==0&&j%3==0) {
		        if(count >= 2) moves--
		      }else{
		        if(k*j%3==0) {
		          if(count >= 3) moves--
		        }else{
		          if(count >= 4) moves--
		        }
		      }
		    }
		  }
		  if(moves <= 0) return false
		  return true
		}

		function moveRight() {
		  for(i=0;i<4;i++) {
		    const values = array[i].filter(n => n > 0)
		    array[i] = Array(4-values.length).fill(0).concat(values)
		  }
		}
		
		function moveLeft() {
		  for(i=0;i<4;i++) {
		    const values = array[i].filter(n => n>0)
		    array[i] = values.concat(Array(4-values.length).fill(0))
		  }
		}
		
		function moveUp() {
		  let rotated = []
		  for(i=0;i<4;i++) {
		    const values = []
		    for(j=0;j<4;j++) {
		      if(array[j][i] > 0) values.push(array[j][i]) 
		    }
		    rotated.push(values.concat(Array(4-values.length).fill(0)))
		  }
		  array = resolveRotated(rotated)
		}
		
		function moveDown() {
		  let rotated = []
		  for(i=0;i<4;i++) {
		    const values = []
		    for(j=0;j<4;j++) {
		      if(array[j][i]>0) values.push(array[j][i])
		    }
		    rotated.push(Array(4-values.length).fill(0).concat(values))
		  }
		  array = resolveRotated(rotated)
		}

		function resolveRotated(rotated) {
		  const resolved = []
		  for(i=0;i<4;i++) {
		    resolved.push(Array(4))
		  }
		  for(i=0;i<4;i++) {
		    for(j=0;j<4;j++) {
		      resolved[i][j] = rotated[j][i]
		    }
		  }
		  return resolved
		}

		function addRight() {
		  for(i=0;i<4;i++) {
		    for(j=3;j>0;j--) {
		      if(array[i][j]==array[i][j-1]) {
		        array[i][j] *= 2
		        array[i][j-1] = 0
						score += array[i][j]
		      }
		    }
		  }
		}
		
		function addLeft() {
		  for(i=0;i<4;i++) {
		    for(j=0;j<3;j++) {
		      if(array[i][j]==array[i][j+1]) {
		        array[i][j] *= 2
		        array[i][j+1] = 0
						score += array[i][j]
		      }
		    }
		  }
		}
		
		function addUp() {
		  for(i=0;i<4;i++) {
		    for(j=0;j<3;j++) {
		      if(array[j][i]==array[j+1][i]) {
		        array[j][i] *= 2
		        array[j+1][i] = 0
						score += array[i][j]
		      }
		    }
		  }
		}
		
		function addDown() {
		  for(i=0;i<4;i++) {
		    for(j=3;j>0;j--) {
		      if(array[j][i]==array[j-1][i]) {
		        array[j][i] *= 2
		        array[j-1][i] = 0
						score += array[i][j]
		      }
		    }
		  }
		}

		function createCanvas() {
			const canvas = Canvas.createCanvas(600, 600)
			const context = canvas.getContext('2d')
			let row = 0;
		  for (i = 0; i < canvas.width; i += canvas.width / 4) {
		    let column = 0;
		    for (j = 0; j < canvas.height; j += canvas.height / 4) {
		      context.beginPath()
		      context.arc(i + offset + radius, j + offset + radius, radius, Math.PI, 3 * Math.PI / 2)
		      context.arc(i + canvas.width / 4 - offset - radius, j + offset + radius, radius, 3 * Math.PI / 2, 0)
		      context.arc(i + canvas.width / 4 - offset - radius, j + canvas.height / 4 - offset - radius, radius, 0, Math.PI / 2)
		      context.arc(i + offset + radius, j + canvas.height / 4 - offset - radius, radius, Math.PI / 2, Math.PI)
		      context.font = '60px Roboto'
		      const width = context.measureText(array[column][row]).width
		      if(array[column][row]>0) {
						switch (array[column][row]) {
							case 0:
								context.fillStyle = "rgba(0, 0, 0, 0)"
								break;
							case 2:
								context.fillStyle = "#eee4da"
								break;
							case 4:
								context.fillStyle = "#ede0c8"
								break;
							case 8:
								context.fillStyle = "#f2b179"
								break;
							case 16:
								context.fillStyle = "#f59563"
								break;
							case 32:
								context.fillStyle = "#f67c5f"
								break;
							case 64:
								context.fillStyle = "#f65e3b"
								break;
							case 128:
								context.fillStyle = "#edcf72"
								break;
							case 256:
								context.fillStyle = "#edcc61"
								break;
							case 512:
								context.fillStyle = "#edc850"
								break;
							case 1024:
								context.fillStyle = "#edc53f"
								break;
							case 2048:
								context.fillStyle = "#edc22e"
								break;
							default: context.fillStyle = "black"
						}
						context.fill()
						context.fillStyle = "#000000"
		        context.fillText(array[column][row],i+canvas.width/8-width/2,j+canvas.height/8+18)
		      }
		      context.closePath()
		      context.strokeStyle = 'gray'
					context.lineWidth = 3
		      context.stroke()
		      column++
		    }
		    row++
		  }
			return canvas
		}

		function createEmbed() {
			const embed = new MessageEmbed()
				.setDescription(`Score: ${score}`)
				.setColor('#ffd342')
				.setImage('attachment://2048.png')
				.setFooter({text: 'Get a tile to 2048!'})
				.setAuthor({name: `${interaction.user.username}'s game`, iconURL: interaction.user.displayAvatarURL()})
			return embed
		}

		function win() {
			for(i=0;i<4;i++) {
				if(array[i].includes(2048)) return true
			}
			return false
		}
		
		const canvas = createCanvas()
		const attachment = new MessageAttachment(canvas.toBuffer(), '2048.png')
		let interact = await interaction.followUp({embeds: [createEmbed()], components: [createButton()], files: [attachment], fetchReply: true})

		const filter = i => {
			i.deferUpdate()
			if(i.user.id != interaction.user.id) {
				i.followUp({content: 'This button is not for you!', ephemeral: true})
				return false
			}
			return true
		}
		const collector = await interact.createMessageComponentCollector({filter, time: 600000, componentType: 'BUTTON'})
		collector.on('collect', async i => {
			switch (i.customId) {
				case 'up':
					moveUp()
					addUp()
					moveUp()
					break;
				case 'down':
					moveDown()
					addDown()
					moveDown()
					break;
				case 'right':
					moveRight()
					addRight()
					moveRight()
					break;
				case 'left':
					moveLeft()
					addLeft()
					moveLeft()
					break;
				default: console.log('Impossible button')
			}
			collector.resetTimer()
			generate()
			const embed = createEmbed()
			if(!moveable()) {
				const user = await db.get('2048')
				user[interaction.user.id].lost++
				user[interaction.user.id].incomplete--
				await db.set('2048',users)
				return collector.stop('lose')
			}
			if(win()) {
				embed.setTitle('2048!')
				embed.setFooter({text: 'Continue if you love to do so.'})
				if(!triggered) {
					const user = await db.get('2048')
					user[interaction.user.id].wins++
					user[interaction.user.id].incomplete--
					await db.set('2048',user)
					triggered = true
				}
			}
			await interact.removeAttachments()
			interact = await interact.edit({embeds: [embed], components: [createButton()], files: [new MessageAttachment(createCanvas().toBuffer(), '2048.png')]})
		})

		collector.on('end', async (collected, reason) => {
			const members = await db.get('2048')
			if(score > members[interaction.user.id].highscore) {
				members[interaction.user.id].highscore = score
				db.set('2048',members)
			}
			const embed = createEmbed()
			embed.setTitle('Timeout!')
			if(reason == 'lose') embed.setTitle('Out of moves!')
			embed.description = 'This game is automatically closed\n'+embed.description
			interact.components[0].components.forEach(button => button.disabled = true)
			const rows = interact.components
			await interact.removeAttachments()
			await interact.edit({embeds: [embed], components: rows, files: [new MessageAttachment(createCanvas().toBuffer(),'2048.png')]})
		})
	}
}