const Database = require("@replit/database")
const db = new Database()

module.exports = function add(interaction) {
  db.get("encourage").then(value => {
    if(value.includes(interaction.options.getString('message'))){
      return interaction.reply('Message already exists!')
    }else{
      value.push(interaction.options.getString('message'))
      db.set("encourage", value).then();
      return interaction.reply(`Message added! Message added at index: ${value.length-1}`)
    }
  });
}