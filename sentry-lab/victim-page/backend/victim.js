const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/session", (req,res)=>{
    res.json({
        session:"USER_SESSION_TOKEN_123"
    });
});

app.listen(5000,()=>{
    console.log("Victim backend running on 5000");
});
