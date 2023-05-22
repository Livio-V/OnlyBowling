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
app.use(bodyParser.urlencoded({ extended: true }));

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


 app.post('/reservering/aanmaken', function(req,res){

  // Create a new Date object
  const currentDate = new Date();
  // Get the full date as a string
  var date_added = currentDate.toLocaleDateString();
  
  // Get the variables from the body
  var data = req.body
  var fullname = data.fullname;
  var email = data.email;
  var phone = data.phone;
  var people = data.people;
  var date_time_reservation = data.date_time_reservation; 

  let parts = date_time_reservation.split(' ');

  let time = parts[0];
  let time_reservation = parseInt(time.split(':')[0]);

  let date = parts[1];
  let dateParts = date.split('-');
  let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  console.log(`Time Reservation: ${time}`);          // Time
  console.log(`Hour Reservation: ${time_reservation}`);          // Hour
  console.log(`Date Reservation: ${formattedDate}`); // YYYY-MM-DD

  let slot; 
  if(time_reservation == 14){
    slot = "slot1"
  }
  else if(time_reservation == 15){
    slot = "slot2"
  }
  else if(time_reservation == 16){
    slot = "slot3"
  }
  else if(time_reservation == 17){
    slot = "slot4"
  }
  else if(time_reservation == 18){
    slot = "slot5"
  }
  else if(time_reservation == 20){
    slot = "slot6"
  }
  else if(time_reservation == 21){
    slot = "slot7"
  }
  else if(time_reservation == 22){
    slot = "slot8"
  }
  else {}

console.log(`Time slot reservation: ${slot}`)

    // Query the current lane
    var sql = "SELECT ?? FROM ?? WHERE ?? = 'open' AND DATE(date) = ?;";
    var lane = "lane1"
    var sqlParams = [slot, lane, slot, formattedDate];

    con.query(sql, sqlParams, function (err, result){
      if (err) throw err;
      
      // Assuming the query results are stored in the variable 'results'
     const slotStatus = result[0].slot1;
     console.log('Slot status:', slotStatus);






    });

   

  // Define the SQL params
 var sqlParams1 = [ fullname, email, phone, people, slot, date_time_reservation, date_added ]
 var sql1 = "INSERT INTO `reservations`(`fullname`, `email`, `phone`, `people`, `date_time_reservation`, `date_added`) VALUES ('?','?','?','?','?')"
    
   /* con.query(sql, sqlParams, function (err, result) {
          if (err) throw err;
          res.status(200).json(`Gelukt! Je reserving staat op ${date}, om ${slot}`)
        }); 
        */

   res.sendStatus(200)
}); 

app.listen(port, () => console.log(`Server started on port: ${port}`))
