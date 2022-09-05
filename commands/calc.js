const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle } = require('discord.js')

function page1Rows() {
	const row1 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('pg2')
				.setLabel('2nd')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('pi')
				.setLabel('π')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('e')
				.setLabel('e')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('clear')
				.setLabel('C')
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()
				.setCustomId('back')
				.setEmoji('<:backspace:967783370232856586>')
				.setStyle(ButtonStyle.Danger)
		])
	const row2 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('square')
				.setLabel('𝑥²')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('7')
				.setLabel('7')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('8')
				.setLabel('8')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('9')
				.setLabel('9')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('divide')
				.setLabel('÷')
				.setStyle(ButtonStyle.Primary)
		])
	const row3 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('sqrt')
				.setLabel('√𝑥')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('4')
				.setLabel('4')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('5')
				.setLabel('5')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('6')
				.setLabel('6')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('multiply')
				.setLabel('×')
				.setStyle(ButtonStyle.Primary)
		])
	const row4 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('log')
				.setLabel('log')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('1')
				.setLabel('1')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('2')
				.setLabel('2')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('3')
				.setLabel('3')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('minus')
				.setLabel('-')
				.setStyle(ButtonStyle.Primary)
		])
	const row5 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('ln')
				.setLabel('ln')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('.')
				.setLabel('.')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('0')
				.setLabel('0')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('calc')
				.setLabel('=')
				.setStyle('SUCCESS'),
			new ButtonBuilder()
				.setCustomId('plus')
				.setLabel('+')
				.setStyle(ButtonStyle.Primary)
		])
	return [row1, row2, row3, row4, row5]
}

function page2Rows(rod) {
	let style = ''
	if(rod == 'Rad') style = 'SUCCESS'
	else style = ButtonStyle.Primary
	const row1 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('pg1')
				.setLabel('2nd')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId(rod)
				.setLabel(rod)
				.setStyle(style),
			new ButtonBuilder()
				.setCustomId('sin')
				.setLabel('sin')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('cos')
				.setLabel('cos')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('tan')
				.setLabel('tan')
				.setStyle(ButtonStyle.Secondary)
		])
	const row2 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('percent')
				.setLabel('%')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('fact')
				.setLabel('𝑥!')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('sini')
				.setLabel('sin⁻¹')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('cosi')
				.setLabel('cos⁻¹')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('tani')
				.setLabel('tan⁻¹')
				.setStyle(ButtonStyle.Secondary)
		])
	const row3 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('Mod')
				.setLabel('|𝑥|')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('pow')
				.setLabel('𝑥ʸ')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('modulo')
				.setLabel('Rema')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('rand')
				.setLabel('Rand')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('neg')
				.setLabel('Neg')
				.setStyle(ButtonStyle.Secondary)
		])
	const row4 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('lg')
				.setLabel('lg𝑥')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('root')
				.setLabel('ʸ√𝑥')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('inv')
				.setLabel('¹/𝑥')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('bo')
				.setLabel('(')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('bc')
				.setLabel(')')
				.setStyle(ButtonStyle.Secondary)
		])
	const row5 = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setCustomId('exp')
				.setLabel('eˣ')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('10pow')
				.setLabel('10ˣ')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('2pow')
				.setLabel('2ˣ')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('logyx')
				.setLabel('logᵧˣ')
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('sign')
				.setLabel('+/-')
				.setStyle(ButtonStyle.Secondary)
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