const express = require('express')
const fetch = require('node-fetch')
const qs = require('querystring')
const config = require('./config')
const bodyParser = require('body-parser')
const session = require('express-session');

const client_id = config.client_id;
const client_secret = config.client_secret;
const redirect_uri = 'http://localhost:3000/authed';
const response_type = 'code'
const scope = ''

const auth_uri = 'https://github.com/login/oauth/authorize';
const token_uri = 'https://github.com/login/oauth/access_token';

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//app.set('trust proxy', 1) // trust first proxy //ハマったらここだよ
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

const init = async () => {

  app.get('/auth', (req, res) => {
    const params = qs.stringify({
      client_id,
      redirect_uri,
      response_type,
      scope,
      //state, 推測不能なランダムの文字列。 クロスサイトリクエストフォージェリ攻撃に対する保護として使われます。
    })
    res.redirect(302, `${auth_uri}?${params}`)
  })
  app.get('/test', async (req, res) => {
    if (req.query.type === "read") {
      res.send(req.session.test2);
    }else if (req.query.type === "store") {
      req.session.test2= "abcde";
      req.session.save();
      res.send("stored");
    } else {
      res.send("nothing match");
    }
    console.log(req.session);

    /*
    console.log(req.session);
    console.log(req.session.access_token);
    if (req.session.access_token) {
      res.send(req.session.access_token);
      return;
    } else {
      res.send('not stores');
      return;
    }*/
  });
  app.get('/authed', async (req, res) => {
    const seq = await fetch(token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: qs.stringify({
        client_id,
        client_secret,
        code: req.query.code,
        redirect_uri,
      })
    });
    //res.send(qs.parse(await seq1.text()));
    const access_token = (await seq.json()).access_token;
    console.log(access_token);
    req.session.access_token = access_token;
    req.session.save();


    const user_uri = 'https://api.github.com/user';

    const seq2 = await fetch(user_uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': "token " + access_token
      },
    });
    res.send(await seq2.text())
  })
  app.listen(3000, () => console.log('listening on port 3000'))
}

  init();
