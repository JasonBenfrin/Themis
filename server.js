const express = require("express")
const server = express()

server.all("/",(req,res)=>{
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
} );

function keepAlive(){
  server.listen(3000,()=>{
    console.log("Alive")
  })
}

module.exports=keepAlive