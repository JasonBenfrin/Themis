const { detector: sadword } = require('../sadword')
const { detect: level } = require('../level/detect.js')
const {execute: ping} = require('../commands/help.js')

module.exports = {
  name:'messageCreate',
  execute(message){
		console.log(message.content)
		if(message.mentions.has(message.client.user,{ignoreRoles: true, ignoreEveryone: true})) ping(message)
		sadword(message)
		level(message)
  }
}