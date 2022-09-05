const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const { sort } = require('../level/leaderboard.js')

function createButton(offset, length) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
	      .setCustomId('back')
	      .setEmoji('◀')
	      .setStyle(ButtonStyle.Primary),
	    new ButtonBuilder()
	      .setCustomId('front')
	      .setEmoji('▶')
	      .setStyle(ButtonStyle.Primary)
		)
	if(offset == 0){
		row.components[0].setDisabled(true)
		row.components[1].setDisabled(false)
	}else if(offset >= length-5){
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(true)
	}else{
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(false)
	}
	return row
}

function createEmbed(users, offset, name) {
	const embed = new EmbedBuilder()
			.setColor('#FFB063')
			.setTitle('Leaderboard')
			.setDescription(`Leaderboard for ${name}`)
			.setTimestamp()
			.setFooter({text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png'})
	users.forEach(user => {
		const thisUser = Object.values(user)[0]
		embed.addFields({name: `${offset+1}. ${thisUser.name}`, value: `Level: **${thisUser.level}**`})
		offset++
	})
	return embed
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Sends the leaderboard'),
	async execute(interaction) {
		const leaderboard = await sort()
		if (leaderboard.length < 5) {
			const embed = createEmbed(leaderboard, 0,interaction.guild.name)
			return interaction.reply({embeds: [embed]})
		}
		const embed = createEmbed(leaderboard.slice(0,5),0,interaction.guild.name)
		const buttons = createButton(0, leaderboard.length)
		let interact = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true})
		let offset = 0;
		collect(interaction, interact, leaderboard, offset)
	}
}

async function collect(interaction, interact, leaderboard, offset) {
	const filter = i => {
		i.deferUpdate()
		if(i.customId == 'back' || i.customId == 'front') {
			if (interaction.user.id == i.user.id) {
				return true
			}else{
				i.followUp({content: 'This button is not for you!', ephemeral: true})
				return false
			}
		}else{
			return false
		}
	}

	const collector = interact.createMessageComponentCollector({ filter, time: 600000 })
	
	collector.on('collect', async i => {
		if(i.customId == 'back') {
			offset -= 5
		}else{
			offset += 5
		}
		const embed = createEmbed(leaderboard.slice(offset, offset+5), offset,interaction.guild.name)
		const buttons = createButton(offset, leaderboard.length)
		interact = await interaction.editReply({ embeds: [embed], components: [buttons], fetchReply: true })
	})
	
	collector.on('end', () => {
		interact.components[0].components.forEach(button => {
			button.disabled = true
		})
		interaction.editReply({ embeds: interact.embeds, components: interact.components })
	})
}