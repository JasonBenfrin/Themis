import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { ComponentType } from 'discord-api-types/v10'

function createButton(disable) {
	const row = new ActionRowBuilder()
	  .addComponents(
	    new ButtonBuilder()
	      .setCustomId('yes')
	      .setLabel('Confirm')
	      .setStyle(ButtonStyle.Danger)
				.setDisabled(disable),
	    new ButtonBuilder()
	      .setCustomId('no')
	      .setLabel('Cancel')
	      .setStyle(ButtonStyle.Success)
				.setDisabled(disable)
  	)
	return row
}

async function del(interaction) {
	const integer = interaction.options.getInteger('integer')
	if(integer <= 5) {
		return interaction.reply('Sorry, these are master messages. They cannot be deleted')
	}
	const redis = interaction.client.redis
	const msg = await redis.lIndex("encourage", integer)
	if(integer < 0 || msg === null) {
		return interaction.reply('The provided integer does not exist!\n *Please check *`/encourage list`* for correct index*')
	}
	const str = `Are you sure you want to delete ${integer}:${msg}?`
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
	const collector = interact.createMessageComponentCollector({filter, time: 60000, componentType: ComponentType.Button, max: 1 })
	collector.on('collect', async i => {
		if(i.customId == 'yes') {
			await redis.lRem("encourage", 0, msg)
			return interaction.editReply({content: 'Message Deleted!', components: [createButton(true)]})
		}else{
			return interaction.editReply({content: 'Cancelled!', components: [createButton(true)]})
		}
	})
}

export default del