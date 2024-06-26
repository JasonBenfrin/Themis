import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { ComponentType } from 'discord-api-types/v10';
import { registerFont, createCanvas as _createCanvas } from 'canvas';
import { createAI } from 'tictactoe-complex-ai';

registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto'});
registerFont('./fonts/Quicksand-Bold.ttf', {family: 'Quicksand'});
registerFont('./fonts/Bungee-Regular.ttf', {family: 'Bungee'});
registerFont('./fonts/Comfortaa-Bold.ttf', {family: 'Comfortaa'});
registerFont('./fonts/Arvo-Regular.ttf', {family: 'Arvo'});

const xOff = 50
const yOff = 50
const radius = 32	

function createRows(style, disabled=false) {
	return [
		new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('00')
					.setLabel('A1')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('01')
					.setLabel('A2')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('02')
					.setLabel('A3')
					.setStyle(style)
					.setDisabled(disabled)
			]),
		new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('10')
					.setLabel('B1')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('11')
					.setLabel('B2')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('12')
					.setLabel('B3')
					.setStyle(style)
					.setDisabled(disabled)
			]),
		new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('20')
					.setLabel('C1')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('21')
					.setLabel('C2')
					.setStyle(style)
					.setDisabled(disabled),
				new ButtonBuilder()
					.setCustomId('22')
					.setLabel('C3')
					.setStyle(style)
					.setDisabled(disabled)
			])
	]
}

function createEmbed(p1, p2, turn) {
	const embed = new EmbedBuilder()
		.setAuthor({name: `${p1.username} wants to challange ${p2.username}.`, iconURL: p1.displayAvatarURL()})
		.setColor('#9b84ec')
		.setThumbnail(p2.displayAvatarURL())
		.addFields({name: p1.username, value: '<:red:972113900109709362>', inline: true})
		.addFields({name: p2.username, value: '<:blue:972113900273291344>', inline: true})
		.setImage('attachment://ttt.png')
	if(turn == 'p1') embed.setDescription(`${p1.username}'s turn`)
	else embed.setDescription(`${p2.username}'s turn`)
	return embed
}

function createCanvas(game) {
	const canvas = _createCanvas(300, 300)
	const context = canvas.getContext('2d')
	context.lineWidth = 10
	context.strokeStyle = '#888888'

	for(let i=canvas.width/3;i<canvas.width;i+=canvas.width/3) {
	  context.moveTo(i,0)
	  context.lineTo(i,canvas.height)
	  context.stroke()
	}
	
	for(let i=canvas.width/3;i<canvas.width;i+=canvas.width/3) {
	  context.moveTo(0,i)
	  context.lineTo(canvas.width,i)
	  context.stroke()
	}
	
	let a = 0
	for(let j=canvas.height/6;j<canvas.height;j+=canvas.height/3) {
	  let b = 0
	  for(let i=canvas.width/6;i<canvas.width;i+=canvas.width/3) {
	    if(game[a][b] == 'O') circle(i, j, context)
	    else if(game[a][b] == 'X') cross(i, j, context)
	    b++ 
	  }
	  a++
	}
	const canvas2 = _createCanvas(330,330)
	const context2 = canvas2.getContext('2d')
	context2.drawImage(canvas, 30, 30)
	
	context2.font = '15px Roboto'
	context2.fillStyle = '#888888'
	context2.fillText('A', 5, 80)
	context2.fillText('B', 5, 190)
	context2.fillText('C', 5, 290)
	context2.fillText('1', 70, 15)
	context2.fillText('2', 180, 15)
	context2.fillText('3', 280, 15)
	
	return canvas2
}

function circle(x, y, context) {
  context.lineWidth = 10
  context.strokeStyle = '#f04747'
  context.beginPath()
  context.arc(x, y, radius, 0, 2*Math.PI)
  context.closePath()
  context.stroke()
}

function cross(x, y, context) {
  const offset = 20
  context.lineWidth = 10
  context.strokeStyle = '#5865f2'
  context.beginPath()
  context.moveTo(x-xOff+offset, y-yOff+offset)
  context.lineTo(x+xOff-offset, y+yOff-offset)
  context.closePath()
  context.stroke()
  context.beginPath()
  context.moveTo(x+xOff-offset, y-yOff+offset)
  context.lineTo(x-xOff+offset, y+xOff-offset)
  context.closePath()
  context.stroke()
}

function gameEnd(game) {
  const test1 = game[1][1]
  const test2 = game[0][0]
  const test3 = game[2][2]
  if(test1) {
    if(game[0][0] == test1 && game[2][2] == test1) return test1
    if(game[0][1] == test1 && game[2][1] == test1) return test1
    if(game[0][2] == test1 && game[2][0] == test1) return test1
    if(game[1][0] == test1 && game[1][2] == test1) return test1
  }
  if(test2) {
    if(game[0][1] == test2 && game[0][2] == test2) return test2
    if(game[1][0] == test2 && game[2][0] == test2) return test2
  }
  if(test3) {
    if(game[2][1] == test3 && game[2][0] == test3) return test3
    if(game[1][2] == test3 && game[0][2] == test3) return test3
  }
  return false
}

function aiToGame(pos) {
	return [Math.floor(pos/3), pos%3]
}

export const data = new SlashCommandBuilder()
	.setName('tictactoe')
	.setDescription('Play Tic Tac Toe')
	.addUserOption(option => {
		return option
			.setName('user')
			.setDescription('User to play with');
	});
export async function execute(interaction) {
	const user2 = interaction.options.getUser('user');
	if (user2) {
		if (user2.bot && user2.id != interaction.client.user.id) return interaction.reply('How are you going to play with a bot?');
		if (!interaction.guild.members.cache.get(user2.id)) return interaction.reply('The user is not in this server!');
		if (user2.id == interaction.user.id) return interaction.reply('You cannot play with yourself');
	}
	const p2 = interaction.options.getUser('user') || interaction.client.user;
	await interaction.deferReply();
	const p1 = interaction.user;
	const game = [['', '', ''], ['', '', ''], ['', '', '']];
	if (p2.bot) {
		let message = await interaction.followUp({
			embeds: [new EmbedBuilder().setTitle("Pick your difficulty").setColor('#9b84ec')], components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('difficulty')
					.setPlaceholder('None')
					.addOptions([
						{ label: 'Easy', description: 'Baby mode', value: 'easy' },
						{ label: 'Normal', description: 'Worthy opponent', value: 'normal' },
						{ label: 'Hard', description: 'Sweaty games', value: 'hard' },
						{ label: 'Expert', description: "Don't mess with this senator", value: 'expert' }
					])
			)], fetchReply: true
		});
		const filter = async (i) => {
			await i.deferUpdate();
			if (i.user.id != p1.id) {
				i.followUp({ content: 'This menu is not for you!', ephemeral: true });
				return false;
			}
			return true;
		};
		const collector = message.createMessageComponentCollector({ filter, max: 1, time: 600000, componentType: ComponentType.StringSelect });
		collector.on('collect', async (i) => {
			funGame(p1, p2, message, game, i.values[0]);
		});
		return;
	}
	const canvas = createCanvas(game);
	const image = new AttachmentBuilder(canvas.toBuffer(), { name: 'ttt.png' });
	let message = await interaction.followUp({ embeds: [createEmbed(p1, p2, 'p2')], components: createRows(ButtonStyle.Primary), files: [image], fetchReply: true });
	funGame(p1, p2, message, game);
}

async function funGame(p1, p2, message, game, difficulty) {
	let gameOver = false
	let turn = p2.id
	let aiInstance;
	if(difficulty) {
		aiInstance = createAI({level: difficulty, ai: 'X', player: 'O', empty: '', minResponseTime: 1000, maxResponseTime: 3000})
		const position = await aiInstance.play(game.flat())
		const [a, b] = aiToGame(position)
		game[a][b] = 'X'
		turn = p1.id
		message = await message.edit({embeds: [createEmbed(p1, p2, turn==p1.id ? 'p1' : 'p2')], files: [new AttachmentBuilder(createCanvas(game).toBuffer(), {name: 'ttt.png'})], fetchReply: true, components: createRows(ButtonStyle.Danger)})
	}
	const filter = async i => {
		await i.deferUpdate()
		if(i.user.id != p1.id && i.user.id != p2.id) {
			i.followUp({content: 'This button is not for you!', ephemeral: true})
			return false
		}
		if(turn == p1.id && i.user.id == p2.id) {
			i.followUp({content: `Wait for <@${p1.id}>'s turn`, ephemeral: true})
			return false
		}
		if(turn == p2.id && i.user.id == p1.id) {
			i.followUp({content: `Wait for <@${p2.id}>'s turn`, ephemeral: true})
			return false
		}
		if(game[parseInt(i.customId[0])][parseInt(i.customId[1])] != '') {
			i.followUp({content: 'Invalid Move', ephemeral: true})
			return false
		}
		return true
	}
	
	const collector = message.createMessageComponentCollector({ filter, max: 9, time: 600000 })
	collector.on('collect', async i => {
		if(turn == p1.id) {
			game[parseInt(i.customId[0])][parseInt(i.customId[1])] = 'O'
			turn = p2.id
		} else {
			game[parseInt(i.customId[0])][parseInt(i.customId[1])] = 'X'
			turn = p1.id
		}

		if(difficulty && !gameEnd(game)) {
			const position = await aiInstance.play(game.flat())
			const [a, b] = aiToGame(position)
			game[a][b] = 'X'
			turn = p1.id
		}
		
		if(!game.flat().includes('')) {
			gameOver = true
			return collector.stop()
		}

		message = await message.edit({embeds: [createEmbed(p1, p2, turn==p1.id ? 'p1' : 'p2')], files: [new AttachmentBuilder(createCanvas(game).toBuffer(), {name: 'ttt.png'})], components: createRows(turn==p1.id ? ButtonStyle.Danger : ButtonStyle.Primary), fetchReply: true})
		collector.resetTimer()
		if(gameEnd(game)) collector.stop()
	})
	
	collector.on('end', async () => {
		const end = gameEnd(game)
		const embed = [createEmbed(p1, p2, 'p2')]
		embed[0].data.description = end ? `${end == 'O' ? p1.username : p2.username} won!` : gameOver ? "DRAW!" : "Time's up!"
		message.edit({components: createRows(ButtonStyle.Secondary, true), embeds: embed, files: [new AttachmentBuilder(createCanvas(game).toBuffer(), {name: 'ttt.png'})]})
	})
}