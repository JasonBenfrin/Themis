const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')

const help = new MessageEmbed()
  .setColor('#a4cfef')
  .setTitle('Help')
  .setAuthor('Encourage Bot', 'https://i.imgur.com/l3vDws1.png')
  .setDescription('Available Help Commands')
  .addFields(
    {name:"/do not disturb",value:"Toggles the do not disturb option",inline:true},
    {name:"\u200B", value:"(Toggles the sad word detector)", inline:true},
    {name:"/encourage help",value:"Shows a list of text collected"},
    {name:"/hello",value:"Replies with Hello!"},
    {name:"/help",value:"Shows this command"},
    {name:"/quote",value:"Sends a random quote"},
    {name:"/bot info",value:"Sends a link to bot\'s code"}
  )
  .setTimestamp()
  .setFooter(`Bot Version: Release ${process.env.version}`, 'https://i.imgur.com/l3vDws1.png');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Returns the available commands'),
	async execute(interaction) {
		return interaction.reply({ embeds: [help] });
	},
};