const sad_words = ['sad','depressed','bad','down','angry','unhappy','miserable','depressing','hate','disappoint']
const Database = require("@replit/database")
const db = new Database()

function sadWordsDetector(message){
  console.log('in detector')
  db.get("encourage").then(value => {
    const encouragement = value[Math.floor(Math.random()*value.length)]
    message.channel.send(encouragement)
  })

}

module.exports = {sadWordsDetector,sad_words}