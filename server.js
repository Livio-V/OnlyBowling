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

  var sql = "SELECT * FROM reservations WHERE date_reservation >= CURDATE();";

  con.query(sql, (err, result) => {
    if (err) throw err
    res.status(200).json(result)
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

  // Define the lane numbers
  const lanes = ["lane1", "lane2", "lane3", "lane4", "lane5", "lane6", "lane7", "lane8"];
  let open_lane;

  // Function to check the availability of each lane
  const checkLaneAvailability = (laneIndex) => {
    if (laneIndex >= lanes.length) {
      // No open lanes found
      return;
    }

    const lane = lanes[laneIndex];
    const sql = `SELECT ${slot} FROM ${lane} WHERE ${slot} = '' AND DATE(date) = ? LIMIT 1;`;
    const sqlParams = [formattedDate];

    con.query(sql, sqlParams, (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // Found an open slot in this lane
        const laneNumber = lane.replace("lane", "");
        console.log(`Lane ${laneNumber} has an open slot at the selected date and time.`);
        open_lane = "lane"+ laneNumber;

        var sql = "INSERT INTO `reservations`(`fullname`, `email`, `phone`, `people`, `slot`, `lane`, `date_reservation`) VALUES (?, ?, ?, ?, ?, ?, ?)"
        var sqlParams = [ fullname, email, phone, people, slot, open_lane, formattedDate ]

        con.query(sql, sqlParams, (err, results) => {
          if (err) throw err;
        })

        res.sendStatus(200).json( `Gelukt! De reservering staat om: ${time}. op ${formattedDate}.`)
      }

        else {
        // Slot not available in this lane, check the next one
        checkLaneAvailability(laneIndex + 1);
        }
    });
  };

  // Start checking the availability from the first lane
  checkLaneAvailability(0);

}); 

app.listen(port, () => console.log(`Server started on port: ${port}`))