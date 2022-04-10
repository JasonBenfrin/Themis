const Database = require('@replit/database')
const db = new Database()
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

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
	const embed = new MessageEmbed()
		.setColor('#9f7fbc')
		.setTitle('Encourage List')
		.setAuthor('Encourage Bot', 'https://i.imgur.com/l3vDws1.png')
		.setDescription('List of encouraging messages')
		.setTimestamp()
		.setFooter(`Bot Version: Release ${process.env.version}`, 'https://i.imgur.com/l3vDws1.png')
	msgToTen.forEach(msg => {
		embed.addField(`${offset}.  ${msg}`,'\u200B')
		offset++
	})
	return embed
}

module.exports = async function list(interaction) {
	const messages = await db.get('encourage')
	if (messages.length < 10) {
		const embed = createEmbed(messages, 0)
		return interaction.reply({embeds: [embed]})
	}
	const embed = createEmbed(messages.slice(0,10),0)
	const buttons = createButton(0, messages.length)
	const interact = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true})
	let offset = 0;
	collect(interaction, interact, messages, offset)
}

async function collect(interaction, interact, messages, offset) {
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
	const collected = await interact.awaitMessageComponent({ filter, time: 1200000, componentType: 'BUTTON', max: 1 })
	if (collected.customId == 'back') {
		offset -= 10;
	}else{
		offset += 10;
	}
	const embed = createEmbed(messages.slice(offset,offset+10), offset)
	const buttons = createButton(offset, messages.length)
	const interact2 = await interaction.editReply({embeds: [embed], components: [buttons], fetchReply: true})
	collect(interaction, interact2, messages, offset)
}