const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies with Hello!'),
	async execute(interaction) {
		return interaction.reply("Hello!");
	},
};