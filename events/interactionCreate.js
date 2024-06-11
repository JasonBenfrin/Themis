import { InteractionType } from 'discord-api-types/v10';

export const name = "interactionCreate";
export async function execute(interaction) {
  if (interaction.type == InteractionType.ApplicationCommand) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}