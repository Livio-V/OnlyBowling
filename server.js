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
    console.log("sending results..")
  });

});

app.post('/reservering/aanmaken', function(req, res) {
  // Get the variables from the body
  var data = req.body;
  var fullname = data.fullname;
  var email = data.email;
  var phone = data.phone;
  var people = data.people;
  var time_reservation = data.time_reservation
  var date_reservation = data.date_reservation
  console.log(req.body)

  let slot;
  if (time_reservation == 14) {
    slot = "slot1";
  } else if (time_reservation == 15) {
    slot = "slot2";
  } else if (time_reservation == 16) {
    slot = "slot3";
  } else if (time_reservation == 17) {
    slot = "slot4";
  } else if (time_reservation == 18) {
    slot = "slot5";
  } else if (time_reservation == 20) {
    slot = "slot6";
  } else if (time_reservation == 21) {
    slot = "slot7";
  } else if (time_reservation == 22) {
    slot = "slot8";
  } else {
    slot = null; // Assign a default value if none of the conditions match
  }

  console.log(`Time slot reservation: ${slot}`);

  // Define the lane numbers
  const lanes = ["lane1", "lane2", "lane3", "lane4", "lane5", "lane6", "lane7", "lane8"];
  let open_lane;

  // Function to check the availability of each lane
  const checkLaneAvailability = (laneIndex) => {
    if (laneIndex >= lanes.length) {
      // No open lanes found
      res.status(404).json('Error. No open slot found');
      return;
    }

    const lane = lanes[laneIndex];
    const sql = `SELECT ${slot} FROM ${lane} WHERE ${slot} = '' AND DATE(date) = ? LIMIT 1;`;
    const sqlParams = [date_reservation];

    con.query(sql, sqlParams, (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        // Found an open slot in this lane
        const laneNumber = lane.replace("lane", "");
        console.log(`Lane ${laneNumber} has an open slot at the selected date and time.`);
        open_lane = laneNumber;
        lane_full = "lane"+ laneNumber;

        var sql = "INSERT INTO `reservations`(`fullname`, `email`, `phone`, `people`, `slot`, `lane`, `date_reservation`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var sqlParams = [fullname, email, phone, people, slot, open_lane, date_reservation];

        con.query(sql, sqlParams, (err, results) => {
          if (err) throw err;
          res.status(200).json(`Gelukt! De reservering staat om: ${time_reservation}. op ${date_reservation}.`);
          return;
        });


        var sql2 = "UPDATE ?? SET ?? = ? WHERE date = ?;"
        var sqlParams2 = [ lane_full, slot, fullname, date_reservation ]
        con.query(sql2, sqlParams2, (err) => {
          if (err) throw err;
        });

      } else {
        // Slot not available in this lane, check the next one
        checkLaneAvailability(laneIndex + 1);
      }
    });
  };

  // Start checking the availability from the first lane
  checkLaneAvailability(0);


  // This endpoint takes in the post data. Check which lanes are available and assigns the customer a lane. 
  // if there are no available lanes for the selected time and date. The endpoint returns a 404. 
  // The frontend can then play into this and let the customer know that everything is full for the selected date and time.

});

app.post('/reservering/verwijderen', function(req, res) {
  // Using bodyparser get the ID from body
  
  var data = req.body
  var id = data.id;

  let slot;
  let lane;
  let name;

  // Get information about the reservation
  var sql = "SELECT * FROM `reservations` WHERE id = ?;"
  var sqlParams = [ id ]

  con.query(sql, sqlParams, (err, result) => {
    if (err) throw err;
  
    if (result.length > 0) {
      const row = result[0];
  
      let slot = row.slot;
      let lane = "lane"+ row.lane
      let name = row.fullname

    } else {
      // Send error if no reservations is found with provided ID
      res.status(404).json('Error. No reservation found with the provided ID');
      return
    }
  });


  // Delete the reservation from the table reservations
  var sql1 = "DELETE FROM `reservations` WHERE `id` = ?;"
  var sqlParams1 = [ id ]

  con.query(sql1, sqlParams1, (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      console.log('Deleted reservation from table "reservations" ')
    }

    else{
      console.error('Error. No affected rows, something went wrong.')
    }

  });


  var sql2 = "UPDATE ?? SET ?? = '' WHERE ?? = ?;"
  var sqlParams2 = [ lane, slot  ]

  con.query(sql2, sqlParams2)


  
})



app.listen(port, () => console.log(`Server started on port: ${port}`))