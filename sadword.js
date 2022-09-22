const sad_words = ['sad','depress','bad','down','angry','unhappy','miserable','hate','disappoint','lonely','alone']
const Database = require("@replit/database")
const db = new Database()

module.exports = {
	async detector(message){
		if (message.author.bot) return
		const users = await db.get('noDisturb_on')
		if(users.includes(message.author.id)) return
		for(i=0; i<sad_words.length; i++) {
			if(message.content.toLowerCase().includes(sad_words[i])) {
				const messages = await db.get('encourage')
message.reply(messages[Math.floor(Math.random()*messages.length)])
			}
		}
	}
}