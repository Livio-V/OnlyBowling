const express = require('express')
const app = express()
const port = 8383
const bodyParser = require('body-parser');

const mysql = require('mysql')

app.use(express.static('public'))

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'Livio Media')
  next()
})
app.use(bodyParser.json());

var con = mysql.createConnection({
  host: "localhost",
  user: "api",
  password: "nVIh)!Gv3-UO2F5i",
  database: "onlybowling",
  multipleStatements: true
 });

 con.connect(function(err) {
  if (err) throw err;})
 
// Get the status of reservations for current timeslot and date

app.get('/reservering/status', (req, res) => {

  var currentTime = new Date().getHours(); 
  let slot; 
  if (currentTime == 14){
    slot = 2
  }
  else if (currentTime == 15){
    slot = 3
  }
  else if (currentTime == 16){
    slot = 4
  }
  else if (currentTime == 17){
    slot = 5
  }
  else if (currentTime == 17){
    slot = 6
  }
  else if (currentTime == 18){
    slot = 7
  }
  else if (currentTime == 19){
    slot = 8
  }
  else{
    slot = 1
  }
  

  console.log(`Time Slot: ${slot}`);
  console.log(`The Current time: ${currentTime}:00`)

  sqlParams = [ slot ]
  var sql = "SELECT * FROM `reservations` WHERE `slot` = ?;"
  
    con.query(sql, sqlParams, function (err, result) {
      if (err) throw err;
      
      if (result[0] == undefined){
        result = `Geen reservaties voor tijd slot: ${slot}` 
      }

      res.status(200).json(result)
      console.log("Request OK")
    });
  });


  // Reservation creation route
app.post('/reservering/aanmaken', function(req,res) {
   

  // var sqlParams = [ fullname, email, phone, slot, date_time_reservation, date_added ]
  var sql = "INSERT INTO `reservations`(`fullname`, `email`, `phone`, `date_time_reservation`, `date_added`) VALUES ('?','?','?','?','?')"

  console.log(req.body)

  res.sendStatus(200);
    
       /* con.query(sql, sqlParams, function (err, result) {
          if (err) throw err;
          res.status(200).json(`Gelukt! Je reserving staat op ${date}, om ${slot}`)
        }); */
}); 

app.listen(port, () => console.log(`Server started on port: ${port}`))
