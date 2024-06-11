import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('default-profile')
	.setDescription('Generates the default profile of a user.')
	.addUserOption(option => {
		return option
			.setName('user')
			.setDescription('User to generate for')
	})
export async function execute(interaction) {
	const user = interaction.options.getUser('user') || interaction.user
	const embed = new EmbedBuilder()
		.setColor('#e83c56')
		.setTitle(user.tag)
		.setDescription(`Default profile picture for ${user.username}`)
		.setThumbnail(user.defaultAvatarURL)
	return interaction.reply({ embeds: [embed] })
}