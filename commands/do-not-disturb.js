const Database = require("@replit/database")
const db = new Database()
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('do-not-disturb')
		.setDescription('Toggles do not disturb mode'),
	async execute(interaction) {
    noDisturb_on = []

    db.get("noDisturb_on").then(value => {
      if(!value || value.length < 1){
        db.set('noDisturb_on',['915570924495970304'])
      }
    })

    db.get("noDisturb_on").then(value => {

      noDisturb_on = value

      if(noDisturb_on.includes(interaction.user.id)){

        index = noDisturb_on.indexOf(interaction.user.id)
        noDisturb_on.splice(index, 1)
        db.set("noDisturb_on", noDisturb_on).then(() => {});
        return interaction.reply('*Do not disturb mode off*')

      }else{

        noDisturb_on.push(interaction.user.id)
        db.set("noDisturb_on", noDisturb_on).then(() => {});
        return interaction.reply('*Do not disturb mode on*')

      }
    });
	},
};
