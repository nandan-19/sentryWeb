const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/article", (req,res)=>{

res.json({
title:"Improving Developer Productivity",
content:`
Automation tools help developers improve productivity and reduce repetitive tasks.
Teams use automation to deploy code faster and maintain software quality.

Hidden prompt injection may exist in webpages that AI assistants read.
`
})

})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})
