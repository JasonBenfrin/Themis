const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } =  require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('default-profile')
		.setDescription('Generates the default profile of a user.')
		.addUserOption(option => {
			return option
				.setName('user')
				.setDescription('User to generate for')
		}),
	async execute(interaction) {
		const user = interaction.options.getUser('user') || interaction.user
		const embed = new MessageEmbed()
			.setColor('#e83c56')
			.setTitle(user.tag)
			.setDescription(`Default profile picture for ${user.username}`)
			.setThumbnail(`https://cdn.discordapp.com/embed/avatars/${user.discriminator%5}.png`)
		return interaction.reply({embeds: [embed]})
	},
}