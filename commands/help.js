import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

const help = new EmbedBuilder()
  .setColor('#a4cfef')
  .setTitle('Help')
  .setAuthor({name: 'Encourage Bot', iconURL: 'https://i.imgur.com/l3vDws1.png'})
  .setDescription('Available Commands')
  .addFields(
		{name:'/2048', value:'Play 2048.', inline: true},
		{name:'/bot-info', value:'Sends a link to bot\'s code', inline: true},
		{name:'/define', value:'Defines a word. (Urban dictionary)', inline: true},
    {name:"/do not disturb", value:"Toggles the do not disturb option\n(Toggles the sad word detector)", inline: true},
    {name:"/encourage help", value:"Help command for Encourage function", inline: true},
    {name:"/help", value:"Shows this command", inline: true},
    {name:"/leaderboard", value:"Sends the leaderboard", inline: true},
    {name:"/level", value:"Show the current level of the user", inline: true},
    {name:"/ping", value:"Latency between the user and the bot.", inline: true},
    {name:"/quote", value:"Sends a random quote", inline: true},
    {name:"/rock-paper-scissors", value:"Play Rock Paper Scissors", inline: true},
    {name:"/stats", value:"Statistics of a User", inline: true},
    {name:"/wordle", value:"Play wordle!", inline: true}
  )
  .setTimestamp()
  .setFooter({text: `Bot Version: Release ${process.env.version}`,iconURL: 'https://i.imgur.com/l3vDws1.png'});

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Returns the available commands');
export async function execute(interaction) {
  return interaction.reply({ embeds: [help] });
}