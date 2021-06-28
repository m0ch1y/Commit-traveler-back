const express = require('express')
const fetch = require('node-fetch')
const qs = require('querystring')
const bodyParser = require('body-parser')
const session = require('express-session');

const config = require('./config');
const routeAuth = require('./routes/auth');

const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 } }))
//routing
app.use("/auth", routeAuth.router);


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
  console.log(req.session);

});
app.get('/userinfo', async (req, res) => {
  console.log(req.session)
  if (!req.session.access_token) {
    res.redirect('/auth');
  } else {
    res.send("vue.jsのページ")
  }
});

app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
})
app.get("/testvue", (req, res) => {
  res.sendFile(__dirname + "/testvue.html");
})

app.get("/testvue", (req, res) => {
  const pre_commit_count = 
  res.send();
})

app.listen(3000, () => console.log('listening on port 3000'))
