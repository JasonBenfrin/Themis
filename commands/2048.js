const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

function createButton() {
	const row = new MessageActionRow()
		.addComponents(
			[
				new MessageButton()
					.setCustomId('left')
					.setEmoji('◀️')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('up')
					.setEmoji('🔼')
					.setStyle('PRIMARY'),
			 	new MessageButton()
				 	.setCustomId('down')
				 	.setEmoji('🔽')
				 	.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('right')
					.setEmoji('▶️')
					.setStyle('PRIMARY')
			]
		)
	return row
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('2048')
		.setDescription('Play 2048.'),
	guild: "925349183177756692",
	async execute(interaction) {
		await interaction.deferReply()
		interaction.followUp({content: 'hello', components: [createButton()]})
	}
};