const Database = require("@replit/database")
const db = new Database()
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

//TODO export embed and list all, buttons to navigate multiple pages

const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('back')
            .setLabel('◀')
            .setStyle('PRIMARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('front')
            .setLabel('▶')
            .setStyle('PRIMARY')
        )

function lister(interaction){
    db.get('encourage').then(value => {
    function adder(offset) {
      const list = new MessageEmbed()
        .setColor('#9f7fbc')
        .setTitle('Encourage List')
        .setAuthor('Encourage Bot', 'https://i.imgur.com/l3vDws1.png')
        .setDescription('List of encouraging messages')
        .setTimestamp()
        .setFooter('Bot Version: Beta 1.0', 'https://i.imgur.com/l3vDws1.png')
      str = ''
      count = 0
      loop: for (const msg in value) {
        count++
        if(count > 10 || parseInt(msg) >= value.length-offset){
          break loop;
        }
        str = str.concat(`${offset+parseInt(msg)} - ${value[offset+parseInt(msg)]} \n\n`)
      }
      list.addField('\u200B',str)
        .setTitle(`Encourage List - Page ${offset/10+1}`)
      return list
    }

    if(value.length > 10){
      let offset = 0
      
      interaction.reply({ components: [row], embeds: [adder(offset)] }).then(() => {

      const filter = i => {
        i.deferUpdate();
        if (interaction.user.id === i.user.id) {
          return true
        } else {
          i.followUp({ content: 'This button is not for you!', ephemeral: true })
          return false
        }
      }
      
      const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000, max: 1 })

      collector.on('collect', async (collected) => {
        const id = collected.customId;
        
        if(id === 'back') {
          offset -= 10;
        }else if(id === 'front'){
          offset += 10;
        }

        if(offset === 0){
          row.components[0].setDisabled(true)
          row.components[1].setDisabled(false)
        }else if(offset === value.length-1){
          row.components[1].setDisabled(true)
          row.components[0].setDisabled(false)
        }else{
          row.components[0].setDisabled(false)
          row.components[1].setDisabled(false)
        }

        interaction.editReply({embeds: [adder(offset)], components: [row]})
      })

      // wait()
      // function wait() {
      //   interaction.channel.awaitMessageComponent({ filter, time: 1200000, componentType: 'BUTTON' })
      //     .then(async (collected) => {
      //       if (collected.customId === 'back') {
      //         offset -= 10;
      //       } else if(collected.customId === 'front'){
      //         offset += 10;
      //       }else{
      //         return;
      //       }
            
      //       if(offset === 0){
      //         row.components[0].setDisabled(true)
      //         row.components[1].setDisabled(false)
      //       }else if(offset === value.length-1){
      //         row.components[1].setDisabled(true)
      //         row.components[0].setDisabled(false)
      //       }else{
      //         row.components[0].setDisabled(false)
      //         row.components[1].setDisabled(false)
      //       }

      //       interaction.editReply({embeds: [adder(offset)], components: [row]})
      //       wait();

      //     })
      //     .catch(() => {
      //       return interaction.followUp('Button has expired! Please request a new command!')
      //     })
      //   }
      })
    }else{
      return interaction.reply({embeds: [adder(0)]})
    }
  })
}


module.exports = lister