const { SlashCommandBuilder } = require('@discordjs/builders');
const help = require('./encourage/help')
const add = require('./encourage/add')
const list = require('./encourage/list')
const del = require('./encourage/del')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('encourage')
    .setDescription('Encouragement Commands')

    .addSubcommand(subcommand => 
      subcommand
        .setName('help')
        .setDescription('Shows a list of command for encouraging function!')
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('list')
        .setDescription('Shows a list of added encouraging messages')
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('add')
        .setDescription('Add an encouraging message!')
        .addStringOption(option => 
          option
            .setName('message')
            .setDescription('Message to be added')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => 
      subcommand
        .setName('del')
        .setDescription('Message to be deleted')
        .addIntegerOption(option =>
          option
            .setName('integer')
            .setDescription('Integer of the message to be deleted')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    
    if(interaction.options.getSubcommand()==='help'){
      return interaction.reply({embeds: [help]})
    }else if(interaction.options.getSubcommand()==='list'){
      return list(interaction)
    }else if(interaction.options.getSubcommand()==='add'){
      return add(interaction)
    }else if(interaction.options.getSubcommand()==='del') {
      return del(interaction)
    }else{
      return interaction.reply("ERROR: Command doesn't exist")
    }
  },
};