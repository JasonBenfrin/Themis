import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('stats')
	.setDescription('Statistics of a User')
	.addStringOption(option => {
		return option
			.setName('type')
			.setDescription('Type of stats')
			.addChoices(
				{ name: 'Wordle', value: 'wordle' },
				{ name: '2048', value: '2048' },
				{ name: 'Rock Paper Scissors', value: 'rps' }
			)
			.setRequired(true);
	})
	.addUserOption(option => {
		return option
			.setName('user')
			.setDescription('User for stats');
	});
export async function execute(interaction) {
	const idUser = interaction.options.getUser('user') || interaction.user;
	const user = await interaction.client.users.fetch(idUser.id, { force: true });
	const type = interaction.options.getString('type');
	const { execute } = await import(`./stats/${type}.js`);
	execute(interaction, user);
}