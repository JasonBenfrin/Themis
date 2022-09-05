const Database = require('@replit/database')
const db = new Database()
const { EmbedBuilder } = require('discord.js')

module.exports = {
	async execute(interaction, user) {
		if(user.bot) return interaction.reply('There is no data for bots.')
		const users = await db.get('wordle')
		const member = users[user.id]
		if(!member) return interaction.reply('Wow! This user hasn\'t played a single Wordle!')
		const embed = new EmbedBuilder()
			.setTitle(`Wordle stats for ${user.tag}`)
			.setAuthor({name: user.username,iconURL: user.displayAvatarURL()})
			.setColor(user.hexAccentColor)
			.addFields([
				{ name: 'Wordles played', value: member.number.toString(), inline: true },
				{ name: 'Incomplete Wordles', value: member.incomplete.toString(), inline: true },
				{ name: '\u200B', value: '\u200B', inline: false },
				{ name: 'Wins', value: member.wins.toString(), inline: true },
				{ name: 'Losts', value: member.lost.toString(), inline: true },
				{ name: '\u200B', value: 'Guesses before winning', inline: false },
				{ name: 'One', value: member.one.toString(), inline: true },
				{ name: 'Two', value: member.two.toString(), inline: true },
				{ name: 'Three', value: member.three.toString(), inline: true },
				{ name: 'Four', value: member.four.toString(), inline: true },
				{ name: 'Five', value: member.five.toString(), inline: true },
				{ name: 'Six', value: member.six.toString(), inline: true }
			])
			.setTimestamp()
	  	.setFooter({text: `Bot Version: Release ${process.env.version}`,iconURL: 'https://i.imgur.com/l3vDws1.png'})
		return interaction.reply({ embeds: [embed] })
	}
}