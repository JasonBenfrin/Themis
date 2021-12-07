const sadword = require('../sadword')

module.exports = {
  name:'messageCreate',
  execute(message){
    const index = require('../index')

    index.db.get("noDisturb_on").then( async (value) => {
      if (sadword.sad_words.some(word => message.content.includes(word)) && !message.author.bot && !value.includes(message.author.id)){
        sadword.sadWordsDetector(message)
      }
    });
  }
}