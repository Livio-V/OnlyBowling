document.getElementById('reservation-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent the default form submission

  const form = event.target;
  const data = new URLSearchParams();

  // Iterate through form elements and add their name-value pairs to the URLSearchParams object
  for (const pair of new FormData(form)) {
    data.append(pair[0], pair[1]);
  }

  fetch('http://localhost:8383/reservering/aanmaken', {  // Endpoint URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  })
    .then(response => {
      if (response.ok) {
        reservation_success();
        return response.json();
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(responseData => {
      console.log('Reservation created:', responseData);
      // Handle the response data as needed
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error appropriately
    });
});

function reservation_success(){
  // show the success message
  var element = document.getElementById('success-div')
  element.style.display = 'block'

  people = document.getElementById('people')
  phone = document.getElementById('phone')
  email = document.getElementById('email')
  fullname = document.getElementById('fullname')
  

  // Clear the values

  people.value = 0;
  phone.value = "";
  email.value = "";
  fullname.value = "";

}
  
  