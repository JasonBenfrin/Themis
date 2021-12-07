module.exports = {
  name:'guildCreate',
  execute(){
    const index = require('../index')

    index.client.guilds.cache.forEach(guild => {
      index.updateCommands(guild.id)
    })
  }
}