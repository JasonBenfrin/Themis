const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js')
const http = require("https");

function urlAdd(message) {
	return message.replaceAll(/\[(.*?)\]/g, match => {
		return match += `(<https://urbandictionary.com/define.php?term=${encodeURI(match.replace(/\[|\]/g,''))}>)`
	})
}

function urban(interaction, callback) {
	const uri = encodeURI(interaction.options.getString('word'))
	const option = {
		"method": "GET",
		"hostname": "api.urbandictionary.com",
		"path": `/v0/define?term=${uri}`
	}

	const req = http.request(option, function (res) {
		const chunks = []
		if(res.statusCode >= 300) {
			interaction.followUp('Error while requesting.')
			callback(null, interaction)
		}
		
		res.on("data", function (chunk) {
			chunks.push(chunk)
		})
	
		res.on("end", function () {
			callback(JSON.parse(Buffer.concat(chunks)).list, interaction)
		})
	})

	req.on('error', () => {
		interaction.followUp('No such word found!')
		callback(null, interaction)
	})
	
	req.end()
}

function createEmbed(word, url, def, likes, dislikes, example, time, author) {
	if(!example) example = 'No example.'
	def = urlAdd(def)
	example = urlAdd(example)
	if(word.length >= 256) word = word.substring(0, 253)+'...'
	if(def.length >= 1024) def = def.substring(0, 1021)+'...'
	if(example.length >= 1024) example = example.substring(0, 1021)+'...'
	if(author.length >= 256) author = author.substring(0, 253)+'...'
	const embed = new EmbedBuilder()
		.setTitle(word)
	  .setURL(url)
		.addFields([
			{name: 'Definition', value: def, inline: true},
			{name: 'Example', value: example, inline: true},
			{name: '\u200B', value: '\u200B', inline: false},
			{name: '\u200B', value: `👍: ${likes}`, inline: true},
			{name: '\u200B', value: `👎: ${dislikes}`, inline: true}
		])
		.setTimestamp(new Date(time))
		.setAuthor({name: author, url: `https://www.urbandictionary.com/author.php?author=${encodeURI(author)}`})
	return embed
}

function createButton(offset, length) {
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
	      .setCustomId('back')
	      .setEmoji('◀')
	      .setStyle(ButtonStyle.Primary),
	    new ButtonBuilder()
	      .setCustomId('front')
	      .setEmoji('▶')
	      .setStyle(ButtonStyle.Primary)
		)
	if(offset == 0){
		row.components[0].setDisabled(true)
		row.components[1].setDisabled(false)
	}else if(offset >= length-1){
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(true)
	}else{
		row.components[0].setDisabled(false)
		row.components[1].setDisabled(false)
	}
	return row
}

async function sendDefine(list, interaction) {
	if(!list) return
	if(list.length <= 0) return interaction.followUp('No such word exist!')
	const bundle = list[0]
	const embed = createEmbed(bundle.word, bundle.permalink, bundle.definition, bundle.thumbs_up, bundle.thumbs_down, bundle.example, bundle.written_on, bundle.author)
	if(list.length == 1) return interaction.followUp({embeds: [embed]})
	const row = createButton(0, list.length)
	let interact = await interaction.followUp({ embeds: [embed], components: [row], fetchReply: true })
	collect(interaction, interact, list, 0)
}

async function collect(interaction, interact, list, offset) {
	const filter = i => {
		i.deferUpdate()
		if(i.customId == 'back' || i.customId == 'front') {
			if (interaction.user.id == i.user.id) {
				return true
			}else{
				i.followUp({content: 'This button is not for you!', ephemeral: true})
				return false
			}
		}else{
			return false
		}
	}
	const collector = interact.createMessageComponentCollector({filter, time: 600000})
	collector.on('collect', async i => {
		if(i.customId == 'back') {
			offset--
		}else{
			offset++
		}
		const bundle = list[offset]
		const embed = createEmbed(bundle.word, bundle.permalink, bundle.definition, bundle.thumbs_up, bundle.thumbs_down, bundle.example, bundle.written_on, bundle.author)
		const buttons = createButton(offset, list.length)
		interact = await interaction.editReply({embeds: [embed], components: [buttons], fetchReply: true})
		collector.resetTimer()
	})
	
	collector.on('end', () => {
		interact.components[0].components.forEach(button => {
			button.disabled = true
		})
		interaction.editReply({ embeds: interact.embeds, components: interact.components})
	})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('define')
		.setDescription('Defines a word. (Urban dictionary)')
		.addStringOption(option => {
			return option
				.setName('word')
				.setDescription('Word to be defined. (Urban dictionary)')
				.setRequired(true)
		}),
	async execute(interaction) {
		await interaction.deferReply()
		urban(interaction, sendDefine)
	}
}