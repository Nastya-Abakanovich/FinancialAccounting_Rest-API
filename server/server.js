const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser'); 
const mysql = require("mysql2");
const dbConfig = require("./config/db.config.js");

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
const urlencodedParser = express.urlencoded({extended: false});

const storage = multer.diskStorage ({
    destination: (req, file, cb) =>{
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/:filename', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/uploads/' + req.params.filename, (err, file) => {
        if (err) res.sendStatus(404);
        res.end(file);
      });
});

app.get("/api", function(req, res){      
    connection.query('SELECT * FROM Spending', function (err, result) {
        if (err) res.sendStatus(400);
        return res.status(200).json({"items": result});
    });
});

app.delete("/api/:id", function(req, res){       
    const id = req.params.id;
    connection.query('DELETE FROM Spending WHERE spending_id=' + id 
                        + ' AND user_id=1', function (err, result) {
        if (err) res.sendStatus(400);
        if (result.affectedRows === 0)
            res.status(404).send({ message: 'Unable delete item' })
        else
            res.status(200).send({ message: 'Deleted item with id=' + id })        
    });
});

app.post("/api", upload.single('fileToUpload'), urlencodedParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);     

    connection.query('INSERT Spending(user_id, sum, date, category, description, income, filename) VALUES (?,?,?,?,?,?,?)',
    [
    1,
    req.body.sum * 100,
    req.body.date,
    req.body.category,
    req.body.description,
    req.body.type === 'income',
    req.file ? req.file.originalname : null
    ], function (err, result) {
        if (err) throw err;
        res.status(200).json({"spending_id": result.insertId});
    }); 
});

app.put("/api", upload.single('fileToUpload'), urlencodedParser, function(req, res){
  
    if(!req.body) return res.sendStatus(400);
    
    console.log(req.body)
    if (req.file !== null) {
        connection.query('UPDATE Spending SET sum = ?, date = ?, category = ?, description = ?, income = ?, filename = ? WHERE spending_id = ?  AND user_id=1',
            [
                req.body.sum * 100,
                req.body.date,
                req.body.category,
                req.body.description,
                req.body.type === 'income',
                req.file ? req.file.originalname : null,
                req.body.spending_id
            ], function (err, result) {
                if (err) throw err;
                res.status(200).send({ message: 'Update item with id=' + req.body.spending_id });
            }); 
    } else {
        connection.query('UPDATE Spending SET sum = ?, date = ?, category = ?, description = ?, income = ? WHERE spending_id = ?  AND user_id=1',
        [
            req.body.sum * 100,
            req.body.date,
            req.body.category,
            req.body.description,
            req.body.type === 'income',
            req.body.spending_id
        ], function (err, result) {
            if (err) throw err;
            res.status(200).send({ message: 'Update item with id=' + req.body.spending_id});
        }); 
    }
});

app.put("/api/deleteFile", upload.single('fileToUpload'), urlencodedParser, function(req, res){
  
    if(!req.body) return res.sendStatus(400);
    console.log(req.body)

    connection.query('UPDATE Spending SET filename = null WHERE spending_id = ?  AND user_id=1',
        [
            req.body.spending_id
        ], function (err, result) {
            if (err) throw err;
            res.status(200).send({ message: 'File delete from item with id=' + req.body.spending_id});
        }); 

});

app.listen(port, () => {
 console.log('Listening on port ', port);
});