const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Statistics of a User')
		.addStringOption(option => {
			return option
				.setName('type')
				.setDescription('Type of stats')
				.setRequired(true)
				.addChoice('Wordle','wordle')
		})
		.addUserOption(option => {
			return option
				.setName('user')
				.setDescription('User for stats')
		}),
	async execute(interaction) {
		const idUser = interaction.options.getUser('user') || interaction.user
		const user = await interaction.client.users.fetch(idUser.id, {force: true})
		const type = interaction.options.getString('type')
		const { execute } = require(`./stats/${type}.js`)
		execute(interaction, user)
	},
};