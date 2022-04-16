const { MessageActionRow, MessageButton } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

function createButton(disable) {
	const row = new MessageActionRow()
	  .addComponents(
	    new MessageButton()
	      .setCustomId('yes')
	      .setLabel('Confirm')
	      .setStyle('DANGER')
				.setDisabled(disable),
	    new MessageButton()
	      .setCustomId('no')
	      .setLabel('Cancel')
	      .setStyle('SUCCESS')
				.setDisabled(disable)
  	)
	return row
}

async function del(interaction) {

  str = `Are you sure you want to delete ${interaction.options.getInteger('integer')}?`
	const encourage = await db.get('encourage')
	const integer = interaction.options.getInteger('integer')
	if(integer >= encourage.length || integer < 0) {
		return interaction.reply('The provided integer does not exist!\n *Please check *`/encourage list`* for correct index*')
	}
	if(integer <= 5) {
		return interaction.reply('Sorry, these are master messages. They cannot be deleted')
	}
	const interact = await interaction.reply({ components: [createButton(false)], content: str, fetchReply: true })
	const filter = i => {
		i.deferUpdate();
		if(i.customId === 'yes' || i.customId === 'no') {
			if (interaction.user.id === i.user.id) {
				return true
			} else {
				i.followUp({ content: 'This button is not for you!', ephemeral: true })
				return false
			}
		}else{
			return false
		}
	}
	const collector = interact.createMessageComponentCollector({filter, time: 60000, componentType: 'BUTTON', max: 1 })
	collector.on('collect', async i => {
		if(i.customId == 'yes') {
			encourage.splice(integer, 1)
			await db.set('encourage', encourage)
			return interaction.editReply({content: 'Message Deleted!', components: [createButton(true)]})
		}else{
			return interaction.editReply({content: 'Deletion cancelled!', components: [createButton(true)]})
		}
	})
}

module.exports = del