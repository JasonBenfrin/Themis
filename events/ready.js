module.exports = {
  name: 'ready',
  once: true,
  execute(){
    const index = require('../index')
    
    index.updateCommands()

    index.db.get("encourage").then(value => {
      if(!value || value.length < 1){
        index.db.set("encourage",['Everything will be fine.','Don\'t be sad, everything will be fine.','You are a great person so don\'t feel like that.','Cheer up mate!','It can be tough sometimes but you have to endure.','Come talk to me. You\'ll be happy again!'])
      }
    })
  }
}