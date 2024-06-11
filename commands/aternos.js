import { SlashCommandBuilder } from 'discord.js';
import list from './aternos/list.js';
import start from './aternos/start.js';
import detail from './aternos/detail.js';

export const data = new SlashCommandBuilder()
	.setName('aternos')
	.setDescription('Manage aternos servers')
  .addSubcommand(command => 
    command
      .setName('list')
      .setDescription('List available servers')
  )
  .addSubcommand(command =>
    command
      .setName('start')
      .setDescription('Start a server')
  )
  .addSubcommand(command =>
    command
      .setName('detail')
      .setDescription('Details of a server')
  );
export async function execute(interaction) {
  const subcommand = interaction.options.getSubcommand()
  switch (subcommand) {
    case "list":
      list(interaction)
      break;
    case "start":
      start(interaction)
      break;
    case "detail":
      detail(interaction)
      break;
    default:
      interaction.reply("No command")
      break;
  }
}