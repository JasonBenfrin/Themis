const express = require("express")
const server = express()

server.all("/",(req,res)=>{
  res.send("I'm alive")
} );

function keepAlive(){
  server.listen(3000,()=>{
    console.log("Alive")
  })
}

module.exports=keepAlive