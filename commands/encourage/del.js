const { MessageActionRow, MessageButton } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('yes')
      .setLabel('Confirm')
      .setStyle('DANGER'),
    new MessageButton()
      .setCustomId('no')
      .setLabel('Cancel')
      .setStyle('SUCCESS')
  )

function del(interaction) {

  str = `Are you sure you want to delete ${interaction.options.getInteger('integer')}?`

  db.get('encourage').then(value => {
    const integer = interaction.options.getInteger('integer')
    if(integer >= value.length || integer < 0) {
      return interaction.reply('The provided integer does not exist!\n *Please check *`/encourage list`* for correct index*')
    }

    interaction.reply({ components: [row], content: str }).then(() => {

    const filter = i => {
      i.deferUpdate();
      if(i.customId === 'yes' || i.customId === 'no') {
        if (interaction.user.id === i.user.id) {
          return true
        } else {
          i.followUp({ content: 'This button is not for you!', ephemeral: true })
          return false
        }
      }else{
        return false
      }
    }

    interaction.channel.awaitMessageComponent({ filter, time: 60000, componenetType: 'BUTTON', max: 1 })
      .then(async (collected) => {

        if (collected.customId === 'yes') {
          db.get('encourage').then(value => {
            value.splice(interaction.options.getInteger('integer'), 1)
            db.set('encourage', value).then(() => {return collected.followUp('Message deleted!')})
          })
        } else if(collected.customId === 'no'){
          return collected.followUp('Deletion canceled!')
        }else if(collected.customId === 'yes' || collected.customId === 'no'){
          return;
        }
      })
      .catch(() => {
        return interaction.followUp('Command canceled! You took too long!')
      })
    })
  })
}

module.exports = del