const express = require('express');
const fetch = require('node-fetch')
const path = require('path');
const qs = require('querystring')
const router = express.Router();
const mysql = require("mysql2");
const graphql = require('../graphql')

const config = require('../config')


router.get('/get-nodes', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        connection.query(
            `select * from nodes`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});
router.get('/get-checkpoint/:node_id', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        connection.query(
            `select * from checkpoint_ranking where node_id= ?`, [req.params.node_id],
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});

router.get('/visit-checkpoint/:node_id/:commit_count/:comment', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    console.log(req.params);
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        console.log(req.session.user_id);
        const registData = [
            req.session.user_id,
            req.params.node_id,
            req.session.user_name,
            req.params.commit_count,
            req.params.comment,
        ];
        connection.query(
            'insert into checkpoint_ranking(user_id,node_id,user_name,commit_count,comment) values(?,?,?,?,?);', registData,
            (error, results) => {
                console.log(error);
                res.send(results);
            }
        )
    });
});

router.get('/update-user/:commit_count/:node/:step', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    console.log(req.params);
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        console.log(req.session.user_id);
        const registData = [req.params.commit_count, req.params.node, req.params.step, req.session.user_id];
        connection.query(
            `update users set commit_count = ?, node_id = ?, step = ? where user_id = ?;`, registData,
            (error, results) => {
                console.log(error);
                res.send(results);
            }
        )
    });
});
router.get('/get-langs', async (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    res.send(await graphql.getCommitLanguage(req.session.access_token, req.session.user_name));
});
router.get('/get-commit', async (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    const ans = { all_commit: await graphql.getCommitCount(req.session.access_token, req.session.user_name) };
    connection.query(
        "select commit_count from users where user_id='?'", [req.session.user_id],
        (error, results) => {
            console.log(results);
            if (results[0] == -1) {
                connection.query("update users set commit_count=? where user_id=?", [ans.all_commit, req.session.user_id]);
                ans.new_commit = 5;
            }
            else {
                //connection.query("update users set commit_count=? where user_id=?", [ans.all_commit, req.session.user_id]);
                ans.commit = ans.all_commit - parseInt(results[0].commit_count);
                ans.table_commit = parseInt(results[0].commit_count);
            }
            res.send(ans);
        }
    )
});
router.post('/set-reversi', (req, res) => {
    let json = Array.from(new Array(8), () => new Array(8));
    for (let i = 0; i < req.body.length; i++) {
        for (let j = 0; j < req.body[i].length; j++){
            json[i][j] = { name: req.body[i][j].name, color: req.body[i][j].color };
        }
    }
    connection.query("update reversi set data = ? where id = ?", [JSON.stringify(json), 1]);
    res.send("ok");
});
router.get('/get-reversi', (req, res) => {
    connection.query("select * from reversi", (e,v) => {
        res.send(JSON.parse(v[0].data));
    });
});
router.get('/make-reversi', (req, res) => {
    connection.query("drop table if exists reversi;");
    connection.query("create table reversi (id int, data text);");
    let grid = Array.from(new Array(8), () => new Array(8));
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            grid[i][j] = { name: "blank", "color": "#ffffff" };
        }
    }
    grid[3][3] = { "name": "JavaScript", "color": "#f1e05a" };
    grid[3][4] = { "name": "HTML", "color": "#e34c26" };
    grid[4][3] = { "name": "C#", "color": "#178600" };
    grid[4][4] = { "name": "C", "color": "#555555" };
    connection.query("INSERT INTO reversi(id, data) values(?, ?);", [1, JSON.stringify(grid)]);
    res.send("ok");
});
router.get('/get-user', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        connection.query(
            `select * from users where user_id = ${req.session.user_id};`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});

//本番環境では使わない。
router.post('/update-map', (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    connection.query("DELETE FROM nodes;");
    req.body.forEach(function (node) {
        const mapdata = [node.id, node.type, node.type];
        connection.query("INSERT INTO nodes VALUES(?,?,?);", mapdata);
    });
});
const connection = mysql.createConnection({
    //hostはmysqlのコンテナ名を指定する
    host: 'mysql-container',
    user: 'root',
    password: "root",
    database: 'project',
});
exports.router = router;