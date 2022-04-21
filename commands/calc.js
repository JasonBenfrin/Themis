const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

function page1Rows() {
	const row = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('')
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