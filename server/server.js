const express = require('express');
const bodyParser = require('body-parser'); 
const mysql = require("mysql2");
const multer = require('multer');
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
const urlencodedParser = express.urlencoded({extended: false});

const storage = multer.diskStorage ({
    destination: (req, file, cb) =>{
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage})


app.use(bodyParser.json());
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + 'public/css'));
// app.use('/js', express.static(__dirname + 'public/js'));
// app.use('/img', express.static(__dirname + 'public/img'));
// app.use('/uploads', express.static(__dirname + 'public/uploads'));


// app.get('/api', (req, res) => {
//     connection.query('SELECT * FROM Spending', function (err, result) {
//         if (err) throw err;
//         res.json({"items": result});
//     });
    
// });

app.get('/api/:filename', (req, res) => {

    res.status(200).sendFile(__dirname + '/public/uploads/' + req.params.filename, (err, file) => {
        if (err) res.sendStatus(400);
        res.end(file);
      });
});

app.get("/api", function(req, res){      
    connection.query('SELECT * FROM Spending', function (err, result) {
        if (err) throw err;
        return res.status(200).json({"items": result});
    });
});

// удаление пользователя по id
app.delete("/api/:id", function(req, res){
       
    const id = req.params.id;
    connection.query('DELETE FROM Spending WHERE spending_id=' + id 
                        + ' AND user_id=1', function (err, result) {
        if (err) throw err;
        if (result.affectedRows === 0)
            res.status(404).send({ message: 'Unable delete item.' })
        else
            res.status(200).send({ message: 'Item deleted.' })        
    });
});

app.post("/api", upload.single('fileToUpload'), urlencodedParser, function (req, res) {
      
    console.log(req.body);
    console.log(req);
    if(!req.body) return res.sendStatus(400);
      

    connection.query('INSERT Spending(user_id, sum, date, category, description, income, filename) VALUES (?,?,?,?,?,?,?)',
    [
    1,
    req.body.sum * 100,
    req.body.date,
    req.body.category,
    req.body.description,
    req.body.type == 'income',
    req.file ? req.file.originalname : null
    ], function (err, result) {
        if (err) throw err;
        res.status(200).json({"spending_id": result.insertId});
    }); 
});

// app
//   .route('/api')
//   .get((req, res) => {
//     // if (req.query.id) {
//     //   if (req.users.hasOwnProperty(req.query.id))
//     //     return res
//     //       .status(200)
//     //       .send({ data: req.users[req.query.id] })
//     //   else
//     //     return res
//     //       .status(404)
//     //       .send({ message: 'User not found.' })
//     // } else if (!req.users)
//     //   return res
//     //     .status(404)
//     //     .send({ message: 'Users not found.' })

//     connection.query('SELECT * FROM Spending', function (err, result) {
//         if (err) throw err;
//         return res.status(200).json({"items": result});
//     });

//     // return res.status(200).send({ data: req.users })
//   })
//   .post((req, res) => {
//     if (req.body.user && req.body.user.id) {
//       if (req.users.hasOwnProperty(req.body.user.id))
//         return res
//           .status(409)
//           .send({ message: 'User already exists.' })

//       req.users[req.body.user.id] = req.body.user

//       fs.writeFile(
//         file,
//         JSON.stringify(req.users),
//         (err, response) => {
//           if (err)
//             return res
//               .status(500)
//               .send({ message: 'Unable create user.' })

//           return res
//             .status(200)
//             .send({ message: 'User created.' })
//         }
//       )
//     } else
//       return res
//         .status(400)
//         .send({ message: 'Bad request.' })
//   })
//   .put((req, res) => {
//     if (req.body.user && req.body.user.id) {
//       if (!req.users.hasOwnProperty(req.body.user.id))
//         return res
//           .status(404)
//           .send({ message: 'User not found.' })

//       req.users[req.body.user.id] = req.body.user

//       fs.writeFile(
//         file,
//         JSON.stringify(req.users),
//         (err, response) => {
//           if (err)
//             return res
//               .status(500)
//               .send({ message: 'Unable update user.' })

//           return res
//             .status(200)
//             .send({ message: 'User updated.' })
//         }
//       )
//     } else
//       return res
//         .status(400)
//         .send({ message: 'Bad request.' })
//   })
//   .delete((req, res) => {
//     console.log(req);
//     // if (req.query.id) {
//     //   if (req.users.hasOwnProperty(req.query.id)) {
//     //     delete req.users[req.query.id]

//     //     fs.writeFile(
//     //       file,
//     //       JSON.stringify(req.users),
//     //       (err, response) => {
//     //         if (err)
//     //           return res
//     //             .status(500)
//     //             .send({ message: 'Unable delete user.' })

//     //         return res
//     //           .status(200)
//     //           .send({ message: 'User deleted.' })
//     //       }
//     //     )
//     //   } else
//     //     return res
//     //       .status(404)
//     //       .send({ message: 'User not found.' })
//     // } else
//       return res
//         .status(400)
//         .send({ message: 'Bad request.' })
//   })


app.listen(port, () => {
 console.log('Listening on port ', port);
});

function get_all(response) {
    connection.query('SELECT * FROM Spending', function (err, result) {
        if (err) throw err;
        response.render('index', { fins: result, title: 'Трекер финансов', sorting_info:sorting_info, submitValue: "Добавить" });
    });
}