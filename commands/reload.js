import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('reload')
	.setDescription('Reloads a command.')
	.addStringOption(option => option
		.setName('command')
		.setDescription("The command to be reloaded.")
		.setRequired(true)
	);
export const guild = ["925349183177756692", '915904831263219752'];
export async function execute(interaction) {
	if (interaction.user.id != "758939577511313429" && interaction.user.id != "847677353407545354") return interaction.reply({ content: 'Only <@758939577511313429> and <@847677353407545354> can use this command', ephemeral: true });
	try {
		const commandName = interaction.options.getString('command');

		const command = await import(`./${commandName}.js?${Math.random()}=${Math.random()}`);
		interaction.client.commands.set(command.data.name, command);

		return interaction.reply(`Successfully reloaded ${commandName}`);
	} catch (error) {
		console.log(error);
		return interaction.reply('No such command exist');
	}
}