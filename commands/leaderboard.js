const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { sort } = require('../level/leaderboard.js')

function createButton(offset, length) {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
	      .setCustomId('back')
	      .setLabel('◀')
	      .setStyle('PRIMARY'),
	    new MessageButton()
	      .setCustomId('front')
	      .setLabel('▶')
	      .setStyle('PRIMARY')
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
	const embed = new MessageEmbed()
			.setColor('#FFB063')
			.setTitle('Leaderboard')
			.setDescription(`Leaderboard for ${name}`)
			.setTimestamp()
			.setFooter(`Bot Version: Release ${process.env.version}`, 'https://i.imgur.com/l3vDws1.png')
	users.forEach(user => {
		const thisUser = Object.values(user)[0]
		embed.addField(`${offset+1}. ${thisUser.name}`,`Level: **${thisUser.level}**`)
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
		const interact = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true})
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
	const collected = await interact.awaitMessageComponent({ filter, time: 1200000, componentType: 'BUTTON', max: 1 })
	if(collected.customId == 'back') {
		offset -= 5;
	}else{
		offset += 5;
	}
	const embed = createEmbed(leaderboard.slice(offset,offset+5), offset)
	const buttons = createButton(offset, leaderboard.length)
	const interact2 = await interaction.editReply({embeds: [embed], components: [buttons], fetchReply: true})
	collect(interaction, interact2, leaderboard, offset)
}