import { SlashCommandBuilder } from 'discord.js';
import help from './encourage/help.js';
import add from './encourage/add.js';
import list from './encourage/list.js';
import del from './encourage/del.js';

export const data = new SlashCommandBuilder()
  .setName('encourage')
  .setDescription('Encouragement Commands')
  .addSubcommand(subcommand => subcommand
    .setName('help')
    .setDescription('Shows a list of command for encouraging function!')
  )
  .addSubcommand(subcommand => subcommand
    .setName('list')
    .setDescription('Shows a list of added encouraging messages')
  )
  .addSubcommand(subcommand => subcommand
    .setName('add')
    .setDescription('Add an encouraging message!')
    .addStringOption(option => option
      .setName('message')
      .setDescription('Message to be added')
      .setRequired(true)
    )
  )
  .addSubcommand(subcommand => subcommand
    .setName('del')
    .setDescription('Message to be deleted')
    .addIntegerOption(option => option
      .setName('integer')
      .setDescription('Integer of the message to be deleted')
      .setRequired(true)
    )
  );
export async function execute(interaction) {

  if (interaction.options.getSubcommand() === 'help') {
    interaction.reply({ embeds: [help] });
  } else if (interaction.options.getSubcommand() === 'list') {
    list(interaction);
  } else if (interaction.options.getSubcommand() === 'add') {
    add(interaction);
  } else if (interaction.options.getSubcommand() === 'del') {
    del(interaction);
  } else {
    interaction.reply("ERROR: Command doesn't exist");
  }
}