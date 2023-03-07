const express = require('express');
const bodyParser = require('body-parser'); 
const mysql = require("mysql2");
const dbConfig = require("./config/db.config.js");

// const formidable = require('formidable');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');

const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password
});

connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");    
    }
}); 

const app = express();
const port = 5000;
// const urlencodedParser = express.urlencoded({extended: false});
// const sorting_info = ["spending_id", true]; 


app.use(bodyParser.json());
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + 'public/css'));
// app.use('/js', express.static(__dirname + 'public/js'));
// app.use('/img', express.static(__dirname + 'public/img'));
// app.use('/uploads', express.static(__dirname + 'public/uploads'));


app.get('/api', (req, res) => {
    connection.query('SELECT * FROM Spending', function (err, result) {
        if (err) throw err;
        res.json({"items": result});
    });
    
});

// app.get('/api/getRequest', (req, res) => {
//  //API logic
// });

// app.post('/api/postRequest', (req, res) => {
//  //API logic
// });

// app.get('*', (req,res) => {
//  res.sendFile(path.join(__dirname, 'build/index.html'));
// });

app.listen(port, () => {
 console.log('Listening on port ', port);
});

function get_all(response) {
    connection.query('SELECT * FROM Spending', function (err, result) {
        if (err) throw err;
        response.render('index', { fins: result, title: 'Трекер финансов', sorting_info:sorting_info, submitValue: "Добавить" });
    });
}