const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js')

function page1Rows() {
	const row1 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('pg2')
				.setLabel('2nd')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('pi')
				.setLabel('π')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('e')
				.setLabel('e')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('clear')
				.setLabel('C')
				.setStyle('DANGER'),
			new MessageButton()
				.setCustomId('back')
				.setEmoji('<:backspace:967783370232856586>')
				.setStyle('DANGER')
		])
	const row2 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('square')
				.setLabel('𝑥²')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('7')
				.setLabel('7')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('8')
				.setLabel('8')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('9')
				.setLabel('9')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('divide')
				.setLabel('÷')
				.setStyle('PRIMARY')
		])
	const row3 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('sqrt')
				.setLabel('√𝑥')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('4')
				.setLabel('4')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('5')
				.setLabel('5')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('6')
				.setLabel('6')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('multiply')
				.setLabel('×')
				.setStyle('PRIMARY')
		])
	const row4 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('log')
				.setLabel('log')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('1')
				.setLabel('1')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('2')
				.setLabel('2')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('3')
				.setLabel('3')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('minus')
				.setLabel('-')
				.setStyle('PRIMARY')
		])
	const row5 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('ln')
				.setLabel('ln')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('.')
				.setLabel('.')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('0')
				.setLabel('0')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('calc')
				.setLabel('=')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId('plus')
				.setLabel('+')
				.setStyle('PRIMARY')
		])
	return [row1, row2, row3, row4, row5]
}

function page2Rows(rod) {
	let style = ''
	if(rod == 'Rad') style = 'SUCCESS'
	else style = 'PRIMARY'
	const row1 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('pg1')
				.setLabel('2nd')
				.setStyle('SUCCESS'),
			new MessageButton()
				.setCustomId(rod)
				.setLabel(rod)
				.setStyle(style),
			new MessageButton()
				.setCustomId('sin')
				.setLabel('sin')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('cos')
				.setLabel('cos')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('tan')
				.setLabel('tan')
				.setStyle('SECONDARY')
		])
	const row2 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('percent')
				.setLabel('%')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('fact')
				.setLabel('𝑥!')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('sini')
				.setLabel('sin⁻¹')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('cosi')
				.setLabel('cos⁻¹')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('tani')
				.setLabel('tan⁻¹')
				.setStyle('SECONDARY')
		])
	const row3 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('Mod')
				.setLabel('|𝑥|')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('pow')
				.setLabel('𝑥ʸ')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('modulo')
				.setLabel('Rema')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('rand')
				.setLabel('Rand')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('neg')
				.setLabel('Neg')
				.setStyle('SECONDARY')
		])
	const row4 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('lg')
				.setLabel('lg𝑥')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('root')
				.setLabel('ʸ√𝑥')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('inv')
				.setLabel('¹/𝑥')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('bo')
				.setLabel('(')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('bc')
				.setLabel(')')
				.setStyle('SECONDARY')
		])
	const row5 = new MessageActionRow()
		.addComponents([
			new MessageButton()
				.setCustomId('exp')
				.setLabel('eˣ')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('10pow')
				.setLabel('10ˣ')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('2pow')
				.setLabel('2ˣ')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('logyx')
				.setLabel('logᵧˣ')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('sign')
				.setLabel('+/-')
				.setStyle('SECONDARY')
		])
	return [row1, row2, row3, row4, row5]
}

async function collect(interact, interaction) {
	let type = 'Deg';
	const filter = i => {
		i.deferUpdate()
		if(interaction.user.id != i.user.id) {
			i.followUp({ content: 'This button is not for you', ephemeral: true })
			return false
		}
		return true
	}
	const collector = await interact.createMessageComponentCollector({ filter, time: 600000 })
	collector.on('collect', async i => {
		switch (i.customId) {
			case 'pg2': interact.edit({content: interact.content, components: page2Rows(type)}); break;
			case 'pg1': interact.edit({content: interact.content, components: page1Rows()}); break;
			case 'Deg': type = 'Rad'; interact.edit({content: interact.content, components: page2Rows(type)}); break;
			case 'Rad': type = 'Deg'; interact.edit({content: interact.content, components: page2Rows(type)}); break;
		}
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calc')
		.setDescription('Opens calculator'),
	guild: ['925349183177756692'],
	async execute(interaction) {
		const interact = await interaction.reply({content: "``` ```", components: page1Rows(), fetchReply: true})
		collect(interact, interaction)
	}
}