const express = require("express");
const mysql = require("mysql");
const app = express()

const connection = mysql.createConnection({
    //hostはmysqlのコンテナ名を指定する
    host: 'mysql-container',
    user: 'root',
    password: "root",
    database: 'project',
});

app.get("/", (req, res) => {
    connection.connect((err) => {
        if (err) {
            console.log('error connecting: ' + err.stack);
            res.send(err.stack);
            return;
        }
        console.log('success');
        connection.query(
            'SELECT * FROM users;',
            (error, results) => {
                console.log(results);
                res.send(results);
            }
        )
    });
})

app.listen(3000, () => console.log("start"))