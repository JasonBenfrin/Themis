const { sort } = require('../level/leaderboard.js')

module.exports = {
  name: 'ready',
  once: true,
  async execute(){
    const index = require('../index')
    
    index.updateCommands()
		index.client.list = new Map()

    index.db.get("encourage").then(value => {
      if(!value || value.length < 1){
        index.db.set("encourage",['Everything will be fine.','Don\'t be sad, everything will be fine.','You are a great person so don\'t feel like that.','Cheer up mate!','It can be tough sometimes but you have to endure.','Come talk to me. You\'ll be happy again!'])
      }
    })
		
		const level = await index.db.get('lvl')
		if(!level) await index.db.set('lvl',{})
		const wordle = await index.db.get('wordle')
		if(!wordle) await index.db.set('wordle',{})
		const tzfe = await index.db.get('2048')
		if(!tzfe) await index.db.set('2048',{})
		const rps = await index.db.get('rps')
		if(!rps) await index.db.set('rps',{})
		index.client.spamDetect = new Map()
		index.client.leaderBoard = await sort()
		index.client.wordle = new Map()
		index.client.user.setActivity('/help', {type: 'PLAYING'})
		console.log(`Logged in with ${index.client.user.tag} on ${index.client.guilds.cache.size} servers`)
  }
}