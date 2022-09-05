const Database = require('@replit/database')
const db = new Database()
const { EmbedBuilder } = require('discord.js')

module.exports = {
	async execute(interaction, user) {
		if(user.bot) return interaction.reply('There is no data for bots.')
		const users = await db.get('2048')
		const member = users[user.id]
		if(!member) return interaction.reply('Wow! This user hasn\'t played a single 2048!')
		const embed = new EmbedBuilder()
			.setTitle(`2048 stats for ${user.tag}`)
			.setAuthor({name: user.username,iconURL: user.displayAvatarURL()})
			.setColor(user.hexAccentColor)
			.addFields([
				{name: '2048s played', value: member.number.toString(), inline: true},
				{name: 'Incomplete 2048s', value: member.incomplete.toString(), inline: true},
				{name: '\u200B', value: '\u200B', inline: false},
				{name: 'Wins', value: member.wins.toString(), inline: true},
				{name: 'Losts', value: member.lost.toString(), inline: true},
				{name: 'Highscore', value: member.highscore.toString(), inline: false},
			])
			.setTimestamp()
  		.setFooter({text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png'})
		return interaction.reply({ embeds: [embed] })
	}
}