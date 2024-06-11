import { EmbedBuilder } from 'discord.js'

export async function execute(interaction, user) {
	if (user.bot) return interaction.reply('There is no data for bots.')
	const redis = interaction.client.redis
	if (!await redis.json.type("rps", user.id)) return interaction.reply('Wow! This user hasn\'t played a single Rock Paper Scissors!')
	const member = await redis.json.get("rps", {
		path: user.id
	})
	const embed = new EmbedBuilder()
		.setTitle(`RPS stats for ${user.tag}`)
		.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
		.setColor(user.hexAccentColor)
		.addFields([
			{ name: 'RPSs played', value: member.number.toString(), inline: true },
			{ name: 'Incomplete RPSs', value: member.incomplete.toString(), inline: true },
			{ name: '\u200B', value: '\u200B', inline: false },
			{ name: 'Wins', value: member.wins.toString(), inline: true },
			{ name: 'Losts', value: member.losts.toString(), inline: true },
			{ name: 'Draws', value: member.draws.toString(), inline: true }
		])
		.setTimestamp()
		.setFooter({ text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png' })
	return interaction.reply({ embeds: [embed] })
}