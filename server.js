import express from 'express'
const app = express()

app.all("/",(req,res)=>{
  // TODO: Make dashboard?
  res.send("hi")
});

export default function keepAlive(){
  app.listen(3000,()=>{
    console.log("Alive")
  })
}