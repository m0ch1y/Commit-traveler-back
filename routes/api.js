const express = require('express');
const fetch = require('node-fetch')
const path = require('path');
const qs = require('querystring')
const router = express.Router();
const mysql = require("mysql2");

const config = require('../config')

router.get('/gym/:position', (req, res) => {
    console.log(req.session)
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
            `select * from gym_ranking where id = ${req.query.position}`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});
router.get('/gym/:position', (req, res) => {
    console.log(req.session)
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
router.get('/new-location', (req, res) => {
    console.log(req.session)
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
            `update users set get_commit_count = 0, user_location = 0 where id = ${req.session.id};`,
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
});
router.get('/map', (req, res) => {
    console.log(req.session)
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
            `SELECT * FROM users where id = ${req.session.id};`,
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