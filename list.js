const Database = require("@replit/database")
const db = new Database()
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const iterate = 3;

function constructButton() {
	const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('back')
      .setLabel('◀')
      .setStyle('PRIMARY')
      .setDisabled(true),
    new MessageButton()
      .setCustomId('front')
      .setLabel('▶')
      .setStyle('PRIMARY')
  )
	return row
}

function constructEmbed(){
	const embed = new MessageEmbed()
	.setColor('#9f7fbc')
	.setTitle('Encourage List')
	.setAuthor('Encourage Bot', 'https://i.imgur.com/l3vDws1.png')
	.setDescription('List of encouraging messages')
	.setTimestamp()
	.setFooter('Bot Version: Release 1.0.1', 'https://i.imgur.com/l3vDws1.png')
	return embed
}

async function sendPage(interaction) {
	let newRow = constructButton()
	let newEmbed = constructEmbed()
	let list = await db.get('encourage')
	if(list.length <= iterate){
		
		for (const num in list) {
			newEmbed.addField('\u200B', `${num} - ${list[num]}`)
		}
		if(interaction.replied || interaction.deferred) return interaction.editReply({embeds: [newEmbed]})
		return interaction.reply({embeds: [newEmbed]})
	}else{
		
		let index = interaction.client.list.get(interaction.id)
		if(!index) index = 0;
		let i = index
		let bound = index + iterate
		
		while (i < bound) {
			newEmbed.addField('\u200B', `${i} - ${list[i]}`)
			i++
			if(i == list.length) break;
		}
		interaction.client.list.set(interaction.id, index)

		if(i == iterate){
			newRow.components[0].setDisabled(true)
			newRow.components[1].setDisabled(false)
		}else if(i >= list.length){
			newRow.components[0].setDisabled(false)
			newRow.components[1].setDisabled(true)
		}else{
			newRow.components[0].setDisabled(false)
			newRow.components[1].setDisabled(false)
		}
		
		if(interaction.replied || interaction.deferred) {
			interaction.editReply({embeds: [newEmbed], components: [newRow]})
		}else{
			interaction.reply({embeds: [newEmbed], components: [newRow]})
		}
		waitInput(interaction, newRow, newEmbed)
	}
}

function waitInput(interaction, newRow, newEmbed) {
	const filter = i => {
		// i.deferUpdate();
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
	const collector = interaction.channel.createMessageComponentCollector({filter, time: 300000, componentType: "BUTTON"})
	.then(button => {
		let index = interaction.client.list.get(interaction.id)
		if (button.customId == "back") {
			index -= index % iterate
			index -= iterate
		}else{
			index += iterate
		}
		interaction.client.list.set(interaction.id, index)
		sendPage(interaction)
	})
	.catch(err => {
		newRow.components[0].setDisabled(true)
		newRow.components[1].setDisabled(true)
		interaction.client.list.delete(interaction.id)
		interaction.editReply({embeds: [newEmbed], components: [newRow]})
	})
}
module.exports = sendPage