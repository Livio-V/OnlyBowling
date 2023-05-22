function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("res-table");
  switching = true;

  var sortBy = document.getElementById("sort-select").value;

  while (switching) {
    switching = false;
    rows = Array.from(table.getElementsByTagName("tr"));

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[getIndex(sortBy)];
      y = rows[i + 1].getElementsByTagName("td")[getIndex(sortBy)];

      if (sortBy === "date-first") {
        if (convertDate(x.innerHTML) > convertDate(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (sortBy === "date-high") {
        if (convertDate(x.innerHTML) < convertDate(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (sortBy === "people") {
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function convertDate(dateString) {
  var dateParts = dateString.split("-");
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

function getIndex(sortBy) {
  if (sortBy === "date-first" || sortBy === "date-high") {
    return 1;
  } else if (sortBy === "people") {
    return 3;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var table = document.querySelector(".first-row");
  var rows = table.querySelectorAll("tr");

  // Function to update the numbering in the table
  function updateNumbering() {
    var currentNumber = 1;

    rows.forEach(function (row) {
      var numberCell = row.querySelector(".number");
      if (numberCell) {
        var rowNumber = parseInt(numberCell.textContent);
        if (rowNumber !== currentNumber) {
          numberCell.textContent = currentNumber;
        }
        currentNumber++;
      }
    });
  }

  // Example usage: Call the updateNumbering function
  // whenever you want to update the numbering in the table
  updateNumbering();
});
function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return day + "-" + month + "-" + year;
}

function updateCurrentDate() {
  var currentDate = new Date();
  var formattedDate = formatDate(currentDate);

  var adminContainer = document.querySelector(".container-datum");
  adminContainer.textContent = formattedDate;
}

window.onload = function () {
  updateCurrentDate();
};

// ADD RESERVATION PAGE
function openReservationForm() {
  document.getElementById("reservation-modal").style.display = "block";
}

function closeReservationForm() {
  document.getElementById("reservation-modal").style.display = "none";
}

function addReservation(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get form input values
  const rawDate = document.getElementById("date").value;
  const date = formatDate(rawDate); // Format the date as day-month-year
  const name = document.getElementById("name").value;
  const people = document.getElementById("people").value;
  const lane = document.getElementById("lane").value;
  const time = document.getElementById("time").value;
  const phone = document.getElementById("phone").value;

  // Create a new row in the table
  const table = document.getElementById("res-table");
  const newRow = table.insertRow(-1);
  newRow.innerHTML = `
    <td class="number">${table.rows.length - 2}</td>
    <td class="date">${date}</td>
    <td class="name">${name}</td>
    <td class="people">${people}</td>
    <td class="lane">${lane}</td>
    <td class="time">${time}</td>
    <td class="phone">${phone}</td>
    <td><button onclick="editReservation(this)">Edit</button></td>
  `;

  closeReservationForm(); // Close the reservation form modal
}

function formatDate(date) {
  if (date) {
    const parts = date.split("-");
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    return `${day}-${month}-${year}`;
  }
  return ""; // Return an empty string if date is undefined
}

// GEEN MAANDAG EN ZONDAG
var datePicker = document.getElementById("date");
datePicker.addEventListener("input", function () {
  var day = new Date(this.value).getUTCDay();
  if ([0, 1].includes(day)) {
    this.setCustomValidity(
      "Selecteer alsublieft een dag tussen dinsdag en zaterdag."
    );
  } else {
    this.setCustomValidity("");
  }
});

// EDIT

// function editReservation(button) {
//   var row = button.parentNode.parentNode; // Get the parent row of the clicked button
//   var cells = row.getElementsByTagName("td"); // Get all the <td> elements in the row

//   // Loop through each <td> element (except the first and last ones) and replace its content with an appropriate input element
//   for (var i = 1; i < cells.length - 1; i++) {
//     var cell = cells[i];
//     var currentValue = cell.innerText;
//     var input;

//     // Check the class name of the <td> element to determine the type of input element to create
//     if (cell.classList.contains("date")) {
//       // Create a date picker input element
//       input = document.createElement("input");
//       input.type = "date";
//       input.value = formatDate(currentValue); // Format the date value if necessary
//     } else if (cell.classList.contains("time")) {
//       // Create a dropdown menu for time selection
//       input = document.createElement("select");
//       var times = [
//         "14:00",
//         "15:00",
//         "16:00",
//         "17:00",
//         "18:00",
//         "19:00",
//         "20:00",
//         "21:00",
//         "22:00",
//       ]; // Example time options

//       // Create option elements for each time and append them to the select element
//       for (var j = 0; j < times.length; j++) {
//         var option = document.createElement("option");
//         option.text = times[j];
//         option.value = times[j];
//         if (times[j] === currentValue) {
//           option.selected = true; // Set the selected option to the current value
//         }
//         input.appendChild(option);
//       }
//     } else {
//       // Create a text input element for other fields
//       input = document.createElement("input");
//       input.type = "text";
//       input.value = currentValue;
//     }

//     // Replace the <td> element with the input element
//     cell.innerHTML = "";
//     cell.appendChild(input);
//   }

//   // Change the button text to "Save" and update the onclick event
//   button.style.display = "none"; // Hide the "Edit" button
//   var saveButton = document.createElement("button"); // Create the "Save" button
//   saveButton.innerText = "Save";
//   saveButton.onclick = function () {
//     saveReservation(this);
//   };
//   row.lastElementChild.appendChild(saveButton); // Append the "Save" button to the last <td> in the row
// }

// function saveReservation(button) {
//   var row = button.parentNode.parentNode; // Get the parent row of the clicked button
//   var cells = row.getElementsByTagName("td"); // Get all the <td> elements in the row

//   // Loop through each <td> element (except the first and last ones) and replace the input element with its value
//   for (var i = 1; i < cells.length - 1; i++) {
//     var cell = cells[i];
//     var input = cell.firstChild;

//     // Replace the input element with the new value
//     cell.innerHTML = input.value;
//   }

//   // Remove the "Save" button and show the "Edit" button
//   row.lastElementChild.removeChild(button);
//   var editButton = row.lastElementChild.firstChild;
//   editButton.style.display = "inline-block";
// }

// // Utility function to format the date value to YYYY-MM-DD format for the input element
// function formatDate(dateString) {
//   var parts = dateString.split("-");
//   if (parts.length === 3) {
//     return parts[2] + "-" + parts[1] + "-" + parts[0];
//   }
//   return dateString;
// }

function editReservation(button) {
  var row = button.parentNode.parentNode; // Get the parent row of the clicked button
  var cells = row.getElementsByTagName("td"); // Get all the <td> elements in the row

  // Loop through each <td> element (except the first and last ones) and replace its content with an appropriate input element
  for (var i = 1; i < cells.length - 1; i++) {
    var cell = cells[i];
    var currentValue = cell.innerText;
    var input;

    // Check the class name of the <td> element to determine the type of input element to create
    if (cell.classList.contains("date")) {
      // Create a date picker input element
      input = document.createElement("input");
      input.type = "date";
      input.value = formatDate(currentValue); // Format the date value if necessary

      // Disable selecting Mondays and Sundays
      input.addEventListener("input", function () {
        var selectedDate = new Date(this.value);
        var dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 1) {
          this.value = ""; // Clear the input value
          alert("Selecteer aub een andere dag dan Maandag en Zondag.");
        }
      });
    } else if (cell.classList.contains("time")) {
      // Create a dropdown menu for time selection
      input = document.createElement("select");
      var times = [
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
      ]; // Example time options

      // Create option elements for each time and append them to the select element
      for (var j = 0; j < times.length; j++) {
        var option = document.createElement("option");
        option.text = times[j];
        option.value = times[j];
        if (times[j] === currentValue) {
          option.selected = true; // Set the selected option to the current value
        }
        input.appendChild(option);
      }
    } else {
      // Create a text input element for other fields
      input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
    }

    // Replace the <td> element with the input element
    cell.innerHTML = "";
    cell.appendChild(input);
  }

  // Change the button text to "Save" and update the onclick event
  button.style.display = "none"; // Hide the "Edit" button
  var saveButton = document.createElement("button"); // Create the "Save" button
  saveButton.innerText = "Save";
  saveButton.onclick = function () {
    saveReservation(this);
  };
  row.lastElementChild.appendChild(saveButton); // Append the "Save" button to the last <td> in the row
}

function saveReservation(button) {
  var row = button.parentNode.parentNode; // Get the parent row of the clicked button
  var cells = row.getElementsByTagName("td"); // Get all the <td> elements in the row

  // Loop through each <td> element (except the first and last ones) and replace the input element with its value
  for (var i = 1; i < cells.length - 1; i++) {
    var cell = cells[i];
    var input = cell.firstChild;

    // Replace the input element with the new value
    cell.innerHTML = input.value;
  }

  // Remove the "Save" button and show the "Edit" button
  row.lastElementChild.removeChild(button);
  var editButton = row.lastElementChild.firstChild;
  editButton.style.display = "inline-block";
}

function formatDate(dateString) {
  var parts = dateString.split("-");
  if (parts.length === 3) {
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  }
  return dateString;
}
