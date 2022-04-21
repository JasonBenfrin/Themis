const { sort } = require('../level/leaderboard.js')
const { updateCommands } = require('../deploy-commands.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'ready',
  once: true,
  async execute(client){    
    updateCommands(client)
		client.list = new Map()

    db.get("encourage").then(value => {
      if(!value || value.length < 1){
        db.set("encourage",['Everything will be fine.','Don\'t be sad, everything will be fine.','You are a great person so don\'t feel like that.','Cheer up mate!','It can be tough sometimes but you have to endure.','Come talk to me. You\'ll be happy again!'])
      }
    })
		
		const level = await db.get('lvl')
		if(!level) await db.set('lvl',{})
		const wordle = await db.get('wordle')
		if(!wordle) await db.set('wordle',{})
		const tzfe = await db.get('2048')
		if(!tzfe) await db.set('2048',{})
		const rps = await db.get('rps')
		if(!rps) await db.set('rps',{})
		client.spamDetect = new Map()
		client.leaderBoard = await sort()
		client.wordle = new Map()
		client.user.setActivity('/help', {type: 'PLAYING'})
		console.log(`Logged in with ${client.user.tag} on ${client.guilds.cache.size} servers`)
  }
}