const express = require('express')
const fetch = require('node-fetch')
const qs = require('querystring')
const bodyParser = require('body-parser')
const session = require('express-session');

const config = require('./config');
const routeAuth = require('./routes/auth');
const routeApi = require('./routes/api');

const app = express()
const allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, access_token"
  );
  // intercept OPTIONS method
  if ("OPTIONS" === req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 30000000 } }))
app.use(express.static("dist"));

//routing
app.use("/auth", routeAuth.router);
app.use("/api", routeApi.router);


app.get('/test', async (req, res) => {
  if (req.query.type === "read") {
    res.send(req.session.test2);
  } else if (req.query.type === "store") {
    req.session.test2 = "abcde";
    req.session.save();
    res.send("stored");
  } else {
    res.send("nothing match");
  }

});
app.get('/userinfo', async (req, res) => {
  if (!req.session.access_token) {
    console.log("セッションなし")
    res.redirect('/auth');
  } else {
    console.log("access_token " + req.session.access_token);
    res.send("vue.jsのページ")
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");

})
app.get("/testvue", (req, res) => {
  res.sendFile(__dirname + "/testvue.html");
})

app.get("/api/map", (req, res) => {

})

app.listen(3000, () => console.log('listening on port 3000'))
