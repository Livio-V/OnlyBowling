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


app.get('/reservering/informatie', (req, res) => {
  res.status(200).json("Request OK")
})

app.post('/reservering/aanmaken', function(req,res) {
    
  var sql = `INSERT INTO 'reservations'( 'fullname', 'slot', 'people', 'lane', 'tel', 'mail', 'date') VALUES ('${fullname}','${slot}','${people}','${lane}', '${tel}', '${mail}', '${date}')`

    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
          if (err) throw err;
          res.status(200).json(`Gelukt! Je reserving staat op ${date}, om ${slot}`)
        });
      });
});

app.listen(port, () => console.log(`Server started on port: ${port}`))
