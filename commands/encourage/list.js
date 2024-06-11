import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } from 'discord.js';
import { ComponentType } from 'discord-api-types/v10';

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
	}else if(offset >= length-10){
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(true)
	}else{
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(false)
	}
	return row
}

function createEmbed(msgToTen, offset) {
	const embed = new EmbedBuilder()
		.setColor('#9f7fbc')
		.setTitle('Encourage List')
		.setAuthor({name: 'Encourage Bot', iconURL: 'https://i.imgur.com/l3vDws1.png'})
		.setDescription('List of encouraging messages')
		.setTimestamp()
		.setFooter({text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png'})
	msgToTen.forEach(msg => {
		if(msg.length >= 256) msg = msg.substring(0,253)+'...'
		embed.addFields([{name: `${offset}.  ${msg}`, value: '\u200B'}])
		offset++
	})
	return embed
}

export default async function list(interaction) {
	const redis = interaction.client.redis
	const messages = await redis.lRange("encourage", 0, -1)
	if (messages.length < 10) {
		const embed = createEmbed(messages, 0)
		return interaction.reply({embeds: [embed]})
	}
	const embed = createEmbed(messages.slice(0,10),0)
	const buttons = createButton(0, messages.length)
	let message = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true})
	let offset = 0;
	collect(interaction, message, messages, offset)
}

async function collect(interaction, message, messages, offset) {
	const filter = i => {
		i.deferUpdate();
		if(i.customId == 'back' || i.customId == 'front') {
			if (interaction.user.id == i.user.id) {
				return true
			} else {
				i.followUp({ content: 'This button is not for you!', ephemeral: true })
				return false
			}
		}else{
			return false
		}
	}

	const collector = message.createMessageComponentCollector({ filter, time: 600000, componentType: ComponentType.Button })
	collector.on('collect', async i => {
		if (i.customId == 'back') {
			offset -= 10;
		}else{
			offset += 10;
		}
		const embed = createEmbed(messages.slice(offset,offset+10), offset)
		const buttons = createButton(offset, messages.length)
		message = await interaction.editReply({embeds: [embed], components: [buttons], fetchReply: true})
	})

	collector.on('end', () => {
		interaction.editReply({embeds: message.embeds, components: [createButton(0, messages.length, true)]})
	})
}