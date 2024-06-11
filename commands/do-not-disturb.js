import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('do-not-disturb')
  .setDescription('Toggles do not disturb mode');
export async function execute(interaction) {

  const redis = interaction.client.redis
      
  if (await redis.sIsMember("noDisturb_on", interaction.user.id)) {
    await redis.sRem("noDisturb_on", interaction.user.id)
    return interaction.reply('*Do not disturb mode off*');
  } else {
    await redis.sAdd("noDisturb_on", interaction.user.id)
    return interaction.reply('*Do not disturb mode on*');
  }
}
