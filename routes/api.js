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
router.get('/update-user/:commit_count/:node/:step', (req, res) => {
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
router.get('/get-commit', async (req, res) => {
    if (!req.session.access_token) {
        res.redirect('/auth');
        return;
    }
    const ans = { commit: await graphql.getCommitCount(req.session.access_token, req.session.user_name) };
    res.send(ans);
});
router.get('/get-user', (req, res) => {
    console.log(req);
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
            `SELECT * FROM users where user_id = ${req.session.user_id};`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
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