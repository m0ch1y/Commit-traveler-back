const express = require('express');
const fetch = require('node-fetch')
const path = require('path');
const qs = require('querystring')
const router = express.Router();
const mysql = require("mysql2");

const config = require('../config')
const connection = mysql.createConnection({
    //hostはmysqlのコンテナ名を指定する
    host: 'mysql-container',
    user: 'root',
    password: "root",
    database: 'project',
});


router.get('/', (req, res) => {
    const params = qs.stringify({
        client_id: config.CLIENT_ID,
        redirect_uri: config.REDIRECT_URI,
        response_type: 'code',
        scope: 'user',
        //state, 推測不能なランダムの文字列。 クロスサイトリクエストフォージェリ攻撃に対する保護として使われます。
    })
    res.redirect(302, `${config.AUTH_URI}?${params}`)
});
router.get('/callback', async (req, res) => {
    const seq = await fetch(config.TOKEN_URI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: qs.stringify({
            client_id: config.CLIENT_ID,
            client_secret: config.CLIENT_SECRET,
            code: req.query.code,
        })
    });
    const access_token = (await seq.json()).access_token;
    req.session.access_token = access_token;

    const seq2 = await fetch(config.USER_URI, {
        method: 'POST',
        headers: {
            Authorization: `token ${access_token}`
        },
    });
    const seq2_data = await seq2.json();
    console.log(seq2_data);
    //user登録処理
    const userId = seq2_data.id;
    connection.query(
        "SELECT * FROM users where user_id = ?", [userId],
        (error, results) => {
            if (!results.length) {
                console.log("初登録");
                connection.query('select node_id from nodes where type="start";',
                    (error, results) => {
                        console.log(results);
                        const node_id = results[Math.floor(Math.random() * results.length)];//ここ不安...
                        var registData = [userId, seq2_data.login, -1, node_id, 0];//-1は仕様
                        connection.query("insert into users(user_id, name, commit_count, node_id, step) values(?,?,?,?,?); ", registData);
                    });
            }
            else {
                console.log("登録済み");
            }
        }
    );
    const user_name = seq2_data.login;
    req.session.user_name = user_name;
    req.session.user_id = seq2_data.id;

    res.send(`認証されました。アプリケーションページに移動してください。 <br> access token: ${access_token} <br> user_name: ${user_name}`);
    //res.sendFile(__dirname + "/dist/index.html");
    //res.redirect('/')
});

exports.router = router;