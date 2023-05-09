const express = require('express')
const app = express()
const port = 8383

const mysql = require('mysql')

app.use(express.static('public'))

var connection = mysql.createConnection({multipleStatements: true});

var con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "database"
 });


app.get('/reservering', (req, res) => {
  res.status(200).json("Request OK")
})

app.get('/test', function(req, res) {
  res.status(200).json("Request OK")
});

app.listen(port, () => console.log(`Server started on port: ${port}`))