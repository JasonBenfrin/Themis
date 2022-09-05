const { execute: ping } = require('../commands/help.js')
const { InteractionType } = require('discord-api-types/v10')

module.exports = {
  name: "interactionCreate",
  async execute(interaction){
    if(interaction.type == InteractionType.ApplicationCommand) {
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
}