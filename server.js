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

 


app.get('/reservering/status', (req, res) => {

  const currentDate = new Date();

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  var time = currentHour + ":" + currentMinute;

    if(time = "09:00"){
      var current_timeslot = "slot-1"
    }

    if (time > "10:00"){
      var current_timeslot = "slot-2"
    }

    else{
      var current_timeslot = "slot-3"
    }
  
  var sql = "SELECT * FROM `reservations` WHERE date = '2023-05-09' & slot = 'slot-1'"
  con.connect(function(err) {
    if (err) throw err;
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json(result)
    });
  });
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
