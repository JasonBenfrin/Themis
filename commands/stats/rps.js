const Database = require('@replit/database')
const db = new Database()
const { MessageEmbed } = require('discord.js')

module.exports = {
	async execute(interaction, user) {
		if(user.bot) return interaction.reply('There is no data for bots.')
		const users = await db.get('rps')
		const member = users[user.id]
		if(!member) return interaction.reply('Wow! This user hasn\'t played a single Rock Paper Scissors!')
		const embed = new MessageEmbed()
			.setTitle(`RPS stats for ${user.tag}`)
			.setAuthor({name: user.username,iconURL: user.displayAvatarURL()})
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
	  	.setFooter({text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png'})
		return interaction.reply({ embeds: [embed] })
	}
}