import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Latency between the user and the bot.');
export async function execute(interaction) {
	return interaction.reply(`Ping: ${new Date() - interaction.createdTimestamp}ms.`);
}