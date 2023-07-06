
/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
const apiKey = '8e49ba477318f53fd081b9e1c72aee73';
const apiKeyEnd = '&units=imperial'

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
  const zip = document.getElementById('zip').value;
  const userResponse = document.getElementById('feelings').value
  getWeather(baseURL, zip, apiKey)
    .then(function (data) {
      postData('/add', { temperature: data.main.temp, date: newDate, userResponse: userResponse })
    }).then(function (data) {
      updateUI()
    })
}

// Async GET
const getWeather = async (baseURL, zip, key) => {

  const res = await fetch(`${baseURL}q=${zip}&appid=${key+apiKeyEnd}`)
  try {

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
}

const updateUI = async () => {
  const request = await fetch('/all');
  try {
    const allData = await request.json();
    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('temp').innerHTML = Math.round(allData.temperature)+ ' degrees'
    document.getElementById('content').innerHTML = allData.userResponse;

  } catch (error) {
    console.log("error", error);
  }
}
// Async POST
const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      temperature: data.temperature,
      date: data.date,
      userResponse: data.userResponse
    }), // body data type must match "Content-Type" header        
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = ( d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

export { performAction }