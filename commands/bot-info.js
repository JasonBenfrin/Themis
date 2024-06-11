import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('bot-info')
	.setDescription('Sends a link to bot\'s code');
export async function execute(interaction) {
	return interaction.reply(`Version: Release ${process.env.version}

**Link to bot's code:**
[**Github - JasonBenfrin - Encourage-Bot**](<https://github.com/JasonBenfrin/Encourage-Bot> "Github")
[**Replit - JasonBenfin - Encourage-Bot**](<https://replit.com/@Bhone-MM/Encourage-Bot-js> "Replit")
*Note: You can fork the repl to use it as your own code! Just make a secret variable for bot token.*`);
}