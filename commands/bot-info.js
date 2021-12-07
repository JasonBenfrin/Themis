const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot-info')
		.setDescription('Sends a link to bot\'s code'),
	async execute(interaction) {
		return interaction.reply("Version: Release 1.0.0\n**Link to bot's code:\n** https://replit.com/@Bhone-MM/Encourage-Bot-js \n *Note: You can fork the repl to use it as your own code! Just make a secret variable for bot token.*");
	},
};