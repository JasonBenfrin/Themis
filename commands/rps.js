import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, ButtonStyle } from 'discord.js'
import { ComponentType } from 'discord-api-types/v10'

const botChoices = ['rock','paper','scissors']

class User {
	constructor (number, incomplete, wins, losts, draws) {
		this.number = number
		this.incomplete = incomplete
		this.wins = wins
		this.losts = losts
		this.draws = draws
	}
}

class Player {
	constructor (user, wins, choice) {
		this.user = user
		this.wins = wins
		this.choice = choice
	}
}

function createRow(p1name, p2name, p1disabled, p2disabled, bot) {
	if(!p1disabled) p1disabled = false
	if(!p2disabled) p2disabled = false
	const row1 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('p1')
				.setLabel(p1name)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('p1rock')
				.setEmoji('✊')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(p1disabled),
			new ButtonBuilder()
				.setCustomId('p1paper')
				.setEmoji('🖐️')
				.setStyle(ButtonStyle.Success)
				.setDisabled(p1disabled),
			new ButtonBuilder()
				.setCustomId('p1scissors')
				.setEmoji('✌️')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(p1disabled)
		])
	if(!bot) {
		const row2 = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('p2')
					.setLabel(p2name)
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true),
				new ButtonBuilder()
					.setCustomId('p2rock')
					.setEmoji('✊')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(p2disabled),
				new ButtonBuilder()
					.setCustomId('p2paper')
					.setEmoji('🖐️')
					.setStyle(ButtonStyle.Success)
					.setDisabled(p2disabled),
				new ButtonBuilder()
					.setCustomId('p2scissors')
					.setEmoji('✌️')
					.setStyle(ButtonStyle.Danger)
					.setDisabled(p2disabled)
			])
		return [row1, row2]
	}
	return [row1]
}

function createEmbed(p1, p2, round, state) {
	const embed = new EmbedBuilder()
		.setAuthor({name: p1.user.username+' is challenging '+p2.user.username,iconURL: p1.user.displayAvatarURL()})
		.setThumbnail(p2.user.displayAvatarURL())
		.setTitle(`Round ${round}`)
		.setColor('#6dedc0')
		.addFields(
			{name: p1.user.username, value: p1.wins.toString(), inline: true},
			{name: p2.user.username, value: p2.wins.toString(), inline: true}
		)
	if(state == 'win') {
		switch (p1.choice) {
			case 'rock': 
				embed.setImage('https://i.imgur.com/7DQ1rI4.gif')
				break;
			case 'paper':
				embed.setImage('https://i.imgur.com/54doz3O.gif')
				break;
			case 'scissors':
				embed.setImage('https://i.imgur.com/d2ZMZxv.gif')
				break;
		}
		embed.setDescription(p1.user.username+' wins!')
	}else if(state == 'lose'){
		switch (p1.choice) {
			case 'rock': 
				embed.setImage('https://i.imgur.com/ZSCwuYI.gif')
				break;
			case 'paper':
				embed.setImage('https://i.imgur.com/9dQEpaH.gif')
				break;
			case 'scissors':
				embed.setImage('https://i.imgur.com/bGsnUxY.gif')
				break;
		}
		embed.setDescription(p2.user.username+' wins!')
	}else if(state == 'draw'){
		switch (p1.choice) {
			case 'rock': 
				embed.setImage('https://i.imgur.com/qKyKMFm.gif')
				break;
			case 'paper':
				embed.setImage('https://i.imgur.com/RPpzSCf.gif')
				break;
			case 'scissors':
				embed.setImage('https://i.imgur.com/pZfjeoz.gif')
				break;
		}
		embed.setDescription('Draw!')
	}else{
		embed.setImage('https://i.imgur.com/wiTvVep.gif')
	}
	return embed
	/*
		waiting: https://i.imgur.com/wiTvVep.gif
		r vs r: https://i.imgur.com/qKyKMFm.gif | draw
		r vs p: https://i.imgur.com/ZSCwuYI.gif | lose
		r vs s: https://i.imgur.com/7DQ1rI4.gif | win
		p vs r: https://i.imgur.com/54doz3O.gif | win
		p vs p: https://i.imgur.com/RPpzSCf.gif | draw
		p vs s: https://i.imgur.com/9dQEpaH.gif | lose
		s vs r: https://i.imgur.com/bGsnUxY.gif | lose
		s vs p: https://i.imgur.com/d2ZMZxv.gif | win
		s vs s: https://i.imgur.com/pZfjeoz.gif | draw
	*/
}

async function collect(interact, p1, p2, rounds) {
	const redis = interact.client.redis
	let nowPlaying = 1
	let started = false
	const filter = i => {
		i.deferUpdate()
		if(i.user.id != p1.user.id && i.user.id != p2.user.id) {
			i.followUp({content: 'This button is not for you!', ephemeral: true})
			return false
		}
		if(i.customId.startsWith('p1') && i.user.id != p1.user.id) {
			i.followUp({content: `This button is for <@${p1.user.id}>`, ephemeral: true})
			return false
		}
		if(i.customId.startsWith('p2') && i.user.id != p2.user.id){
			i.followUp({content: `This button is for <@${p2.user.id}>`, ephemeral: true})
			return false
		}
		return true
	}
	const collector = interact.createMessageComponentCollector({filter, time: 600000, componentType: ComponentType.Button})
	if(!p2.user.bot) {
		setTimeout( async () => {
			if(!started) {
				const dmChannel = await p2.user.createDM()
				await dmChannel.send({content: `<@${p1.user.id}> wants to challange you at Rock Paper Scissors!\nYou have 5 minutes to accept it.`, components: [new ActionRowBuilder().addComponents([new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('To Battle').setURL(interact.url)])]})
			}
		}, 10000)
	}
	let p1click = false
	let p2click = false
	collector.on('collect', async i => {
		let rows = []
		if(i.customId.startsWith('p2')) {
			started = true
			p2click = true
			rows = createRow(p1.user.username, p2.user.username, p1click, p2click, p2.user.bot)
		}else{
			p1click = true
			rows = createRow(p1.user.username, p2.user.username, p1click, p2click, p2.user.bot)
		}
		if(p2.user.bot) {
			p2.choice = botChoices[Math.floor(Math.random()*3)]
			p2click = true
			started = true
		}
		switch (i.customId) {
			case 'p1rock':
				p1.choice = 'rock'
				break;
			case 'p1paper':
				p1.choice = 'paper'
				break;
			case 'p1scissors':
				p1.choice = 'scissors'
				break;
			case 'p2rock':
				p2.choice = 'rock'
				break;
			case 'p2paper':
				p2.choice = 'paper'
				break;
			case 'p2scissors':
				p2.choice = 'scissors'
				break;
		}
		if(p1click && p2click) {
			let state = ''
			if(p1.choice == 'rock' && p2.choice == 'rock' || p1.choice == 'paper' && p2.choice == 'paper' || p1.choice == 'scissors' && p2.choice == 'scissors') state = 'draw'
			if(p1.choice == 'rock' && p2.choice == 'scissors' || p1.choice == 'paper' && p2.choice == 'rock' || p1.choice == 'scissors' && p2.choice == 'paper') state = 'win'
			if(p1.choice == 'rock' && p2.choice == 'paper' || p1.choice == 'paper' && p2.choice == 'scissors' || p1.choice == 'scissors' && p2.choice == 'rock') state = 'lose'
			interact = await interact.edit({embeds: [createEmbed(p1, p2, nowPlaying, state)], components: rows})
			nowPlaying++
			p1click = p2click = false
			if(state == 'win'){
				p1.wins++
			}else if(state == 'lose'){
				p2.wins++
			}
			if(nowPlaying <= rounds) {
				setTimeout( async () => {
					interact = await interact.edit({embeds: [createEmbed(p1, p2, nowPlaying, null)], components: createRow(p1.user.username, p2.user.username, p1click, p2click, p2.user.bot)})
				},2000)
			}else{
				setTimeout( async () => {
					interact = await interact.edit({embeds: [createEmbed(p1, p2, nowPlaying-1, state)], components: createRow(p1.user.username, p2.user.username, true, true, p2.user.bot)})
					collector.stop('ends')
				},2000)
			}
		}else{
			interact = await interact.edit({embeds: interact.embeds, components: rows})
		}
		collector.resetTimer()
	})

	collector.on('end', async (c, reason) => {
		const user1 = await redis.json.get("rps", {
			path: p1.user.id
		})
		const user2 = await redis.json.get("rps", {
			path: p2.user.id
		})
		if(!started) {
			interact.embeds[0].description = 'Your opponent did not accept your challange!'
		}else if(reason == 'ends') {
			let winner = '';
			if(p1.wins > p2.wins){
				winner = p1.user.username
				user1.wins++
				user2.losts++
			}else{
				winner = p2.user.username
				user1.losts++
				user2.wins++
			}
		 	interact.embeds[0].data.description = `**${winner}** is the Final Winner!`
			if(p1.wins == p2.wins) {
				interact.embeds[0].data.description = 'What a Draw!'
				user1.draws++
				user2.draws++
			}
		}else {
			interact.embeds[0].data.description = 'Timeout!'
			user1.incomplete++
			user2.incomplete++
		}
		user1.incomplete--
		user2.incomplete--
		await redis.json.set("rps", p1.user.id, user1)
		await redis.json.set("rps", p2.user.id, user2)
		await interact.edit({embeds: interact.embeds, components: createRow(p1.user.username, p2.user.username, true, true, p2.user.bot)})
	})
}

export const data = new SlashCommandBuilder()
	.setName('rock-paper-scissors')
	.setDescription('Play Rock Paper Scissors')
	.addUserOption(option => {
		return option
			.setName('user')
			.setDescription('User to play with')
	})
	.addIntegerOption(option => {
		return option
			.setName('rounds')
			.setDescription('Number of rounds to play.')
			.setMinValue(1)
			.setMaxValue(10)
	})
export async function execute(interaction) {
	if (interaction.options.getUser('user') && interaction.options.getUser('user').bot && interaction.options.getUser('user').id != interaction.client.user.id) return interaction.reply('How are you going to play with a bot?')
	if (interaction.options.getUser('user') && !interaction.guild.members.cache.get(interaction.options.getUser('user').id)) return interaction.reply('The user is not in this server!')
	const rounds = interaction.options.getInteger('rounds') || 3
	const opponent = interaction.options.getUser('user') || interaction.client.user
	const p1 = new Player(interaction.user, 0, null)
	const p2 = new Player(opponent, 0, null)
	if (p1.user.id == p2.user.id) return interaction.reply('You cannot play with yourself!')
	const redis = interaction.client.redis

	let user1
	let user2
	if (!(await redis.json.type("rps", p1.user.id))) user1 = new User(0, 0, 0, 0, 0)
	else user1 = await redis.json.get("rps", {
		path: p1.user.id
	})
	if (!(await redis.json.type("rps", p2.user.id))) user2 = new User(0, 0, 0, 0, 0)
	else user2 = await redis.json.get("rps", {
		path: p2.user.id
	})

	user1.number++
	user2.number++
	user1.incomplete++
	user2.incomplete++
	await redis.json.set("rps", p1.user.id, user1)
	await redis.json.set("rps", p2.user.id, user2)

	let interact = await interaction.reply({ embeds: [createEmbed(p1, p2, 1, 'waiting')], components: createRow(p1.user.username, p2.user.username, false, false, p2.user.bot), fetchReply: true })
	collect(interact, p1, p2, rounds)
}