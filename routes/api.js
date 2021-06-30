const express = require('express');
const fetch = require('node-fetch')
const path = require('path');
const qs = require('querystring')
const router = express.Router();
const mysql = require("mysql2");
const graphql = require('../graphql')

const config = require('../config')

router.get('/get-gyms', (req, res) => {
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
            `select * from gyms`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});
router.get('/get-gym/:location', (req, res) => {
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
            `select * from gym_ranking where location = ${req.params.location}`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});
router.get('/update-user/:commit_count/:location', (req, res) => {
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
        connection.query(
            `update users set commit_count = ${req.params.commit_count}, location = ${req.params.location} where id = ${req.session.user_id};`,
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
            `SELECT * FROM users where id = ${req.session.user_id};`,
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