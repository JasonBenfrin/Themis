const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option => 
			option
				.setName('command')
				.setDescription("The command to be reloaded.")
				.setRequired(true)
		),
	guild: "925349183177756692",
	async execute(interaction) {
		if(interaction.user.id != "758939577511313429") return interaction.reply({content: 'Only <@758939577511313429> can use this command', ephemeral: true})
		try {
			const commandName = interaction.options.getString('command')
			delete require.cache[require.resolve(`./${commandName}.js`)];
			
			const command = require(`./${commandName}.js`)
			interaction.client.commands.set(command.data.name, command)
			
			return interaction.reply(`Successfully reloaded ${commandName}`)
		} catch (error) {
			console.log(error)
			return interaction.reply('No such command exist');
		}
	}
};