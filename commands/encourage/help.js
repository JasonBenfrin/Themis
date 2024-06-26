import { EmbedBuilder } from 'discord.js';

export default new EmbedBuilder()
  .setColor('#EB7556')
  .setTitle('Encourage Help')
  .setAuthor({name: 'Encourage Bot', iconURL: 'https://i.imgur.com/l3vDws1.png'})
  .setDescription('Available Encourage Help Commands')
  .addFields(
    {name:'/encourage add `message`',value:'Adds an encouraging message to be sent'},
    {name:'/encourage del `index`',value:'Deletes a message at the given index \n (*Please make sure that you check* `/encourage list` *first to make sure that you are deleting the correct message*)'},
    {name:'/encourage help',value:'Shows this message'},
    {name:'/encourage list',value:'Shows a list of messages gathered'}
  )
  .setTimestamp()
  .setFooter({text: `Bot Version: Release ${process.env.version}`, iconURL: 'https://i.imgur.com/l3vDws1.png'})