const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

function page1Rows() {
	const row = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('pg2')
				.setLabel('2nd')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('pi')
				.setLabel('π')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('e')
				.setLabel('e')
				.setLabel('SECONDARY'),
			new MessageButton()
				.setCustomId('clear')
				.setLabel('C')
		])
}

function page2Rows() {
	
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calc')
		.setDescription('Opens calculator'),
	guild: '925349183177756692',
	async execute(interaction) {
		
	}
}