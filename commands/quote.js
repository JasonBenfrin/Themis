import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

async function getQuote() {
  const res = await fetch("https://zenquotes.io/api/random");
  const data = await res.json();
  let dat = [data[0]['q'], data[0]['a']];
  return dat;
}

export const data = new SlashCommandBuilder()
  .setName('quote')
  .setDescription('Sends a random quote');
export async function execute(interaction) {
  const quote = new EmbedBuilder()
    .setColor('#4af7aa');
  getQuote().then(get => {
    quote.addFields({ name: get[0], value: `\\- ${get[1]}` });
    return interaction.reply({ embeds: [quote] });
  });
}