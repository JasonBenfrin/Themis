const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Latency between the user and the bot.'),
	async execute(interaction) {
		return interaction.reply(`Ping: ${new Date() - interaction.createdTimestamp}ms.`)
	},
};