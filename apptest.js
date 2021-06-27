const express = require("express");
const app = express()

app.use(express.static("dist"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
})
app.get("/testvue", (req, res) => {
    res.sendFile(__dirname + "/testvue.html");
})

app.listen(3000, () => console.log("start"))