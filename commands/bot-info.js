const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot-info')
		.setDescription('Sends a link to bot\'s code'),
	async execute(interaction) {
		return interaction.reply(`Version: Release 1.0.1
		\n**Link to bot's code:**
		\n[**Github - JasonBenfrin - Encourage-Bot**](<https://github.com/JasonBenfrin/Encourage-Bot> "Github")
		\n[**Replit - JasonBenfin - Encourage-Bot**](<https://replit.com/@Bhone-MM/Encourage-Bot-js> "Replit")
		\n *Note: You can fork the repl to use it as your own code! Just make a secret variable for bot token.*`);
	},
};