const { detector: sadword } = require('../sadword')
const { detect: level } = require('../level/detect.js')

module.exports = {
  name:'messageCreate',
  execute(message){
		sadword(message)
		level(message)
  }
}