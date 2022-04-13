const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
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
	const embed = new MessageEmbed()
		.setTitle(word)
	  .setURL(url)
		.addFields([
			{name: 'Definition', value: def, inline: true},
			{name: 'Example', value: example, inline: true},
			{name: '\u200B', value: '\u200B', inline: false},
			{name: '\u200B', value: `👍: ${likes}`, inline: true},
			{name: '\u200B', value: `👎: ${dislikes}`, inline: true}
		])
		.setTimestamp(time)
		.setAuthor(author, '', `https://www.urbandictionary.com/author.php?author=${encodeURI(author)}`)
	return embed
}

function createButton(offset, length) {
	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
	      .setCustomId('back')
	      .setLabel('◀')
	      .setStyle('PRIMARY'),
	    new MessageButton()
	      .setCustomId('front')
	      .setLabel('▶')
	      .setStyle('PRIMARY')
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
	const interact = await interaction.followUp({ embeds: [embed], components: [row], fetchReply: true })
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
	const collected = await interact.awaitMessageComponent({ filter, time: 1200000, componentType: 'BUTTON', max: 1 })
	if(collected.customId == 'back') {
		offset--
	}else{
		offset++
	}
	const bundle = list[offset]
	const embed = createEmbed(bundle.word, bundle.permalink, bundle.definition, bundle.thumbs_up, bundle.thumbs_down, bundle.example, bundle.written_on, bundle.author)
	const buttons = createButton(offset, list.length)
	const interact2 = await interaction.editReply({embeds: [embed], components: [buttons], fetchReply: true})
	collect(interaction, interact2, list, offset)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('define')
		.setDescription('Defines a word')
		.addStringOption(option => {
			return option
				.setName('word')
				.setDescription('Word to be defined. (Urban dictionary)')
				.setRequired(true)
		}),
	async execute(interaction) {
		interaction.deferReply()
		urban(interaction, sendDefine)
	}
}