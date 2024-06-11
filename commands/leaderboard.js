import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import { sort } from '../utils/level/leaderboard.js'

function createButton(offset, length, disabled=false) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
	      .setCustomId('back')
	      .setEmoji('◀')
	      .setStyle(ButtonStyle.Primary)
				.setDisabled(disabled),
	    new ButtonBuilder()
	      .setCustomId('front')
	      .setEmoji('▶')
	      .setStyle(ButtonStyle.Primary)
				.setDisabled(disabled)
		)
	if(disabled) return row
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

export const data = new SlashCommandBuilder()
	.setName('leaderboard')
	.setDescription('Sends the leaderboard')
export async function execute(interaction) {
	const leaderboard = await sort(interaction.client.redis)
	if (leaderboard.length < 5) {
		const embed = createEmbed(leaderboard, 0, interaction.guild.name)
		return interaction.reply({ embeds: [embed] })
	}
	const embed = createEmbed(leaderboard.slice(0, 5), 0, interaction.guild.name)
	const buttons = createButton(0, leaderboard.length)
	let message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true })
	let offset = 0
	collect(interaction, message, leaderboard, offset)
}

async function collect(interaction, message, leaderboard, offset) {
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

	const collector = message.createMessageComponentCollector({ filter, time: 600000 })
	
	collector.on('collect', async i => {
		if(i.customId == 'back') {
			offset -= 5
		}else{
			offset += 5
		}
		const embed = createEmbed(leaderboard.slice(offset, offset+5), offset,interaction.guild.name)
		const buttons = createButton(offset, leaderboard.length)
		message = await interaction.editReply({ embeds: [embed], components: [buttons], fetchReply: true })
	})
	
	collector.on('end', () => {
		interaction.editReply({ embeds: message.embeds, components: [createButton(0, leaderboard.length, true)] })
	})
}