const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// app.use(express.static(path.join(__dirname, 'build')));
 app.use(bodyParser.json());

app.get('/api', (req, res) => {
    res.json({"sums": ['10', '12', '158', '15', 100, 0, 200000]});
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

app.listen(5000, () => {
 console.log('Listening on port ', 5000);
});