module.exports = {
  name: "interactionCreate",
  async execute(interaction){
    const index = require('../index')

    if(interaction.isCommand()) {
      const command = index.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  return
  }
}