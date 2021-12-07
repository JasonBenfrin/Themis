const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


function getQuote() {
  return fetch("https://zenquotes.io/api/random")
  .then(res => {
    return res.json()
  })
  .then(data => {
    dat = [data[0]['q'],data[0]['a']]
    return dat
  })
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quote')
		.setDescription('Sends a random quote'),
	async execute(interaction) {
    const quote = new MessageEmbed()
    .setColor('#4af7aa')
    getQuote().then(get => {
      quote.addField(get[0],`- ${get[1]}`)
      return interaction.reply({ embeds: [quote] })
    })
	},
};