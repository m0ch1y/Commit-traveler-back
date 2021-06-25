var express = require("express");
var app = express();

var http = require("http").Server(app);
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("./googlemap.ejs");
})
http.listen("3000", () => {
    console.log("Application started");
});

