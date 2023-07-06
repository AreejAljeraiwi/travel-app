
/* Global Variables */
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
const apiKey = '8e49ba477318f53fd081b9e1c72aee73';
const apiKeyEnd = '&units=imperial'
//
const result = document.querySelector("#result");
const planner = document.querySelector("#planner");
const addTripButton = document.querySelector(".map__link");
const printButton = document.querySelector("#save");
const deleteButton = document.querySelector("#delete");
const form = document.querySelector("#form");
const leavingFrom = document.querySelector('input[name="from"]');
const goingTo = document.querySelector('input[name="to"]');
const depDate = document.querySelector('input[name="date"]');
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "timetotravel";
const timestampNow = (Date.now()) / 1000;
const darkAPIURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
const darkAPIkey = "841a9888f38f0d5458c1f32b892d2d1b";
const pixabayAPIURL = "https://pixabay.com/api/?key=";
const pixabayAPIkey = "13947861-82731bd440ece605a78d76de8";

// EVENT LISTENERS

// add trip button
const addTripEvList = addTripButton.addEventListener('click', function (e) {
  e.preventDefault();
  planner.scrollIntoView({ behavior: 'smooth' });
})
// form submit
form.addEventListener('submit', addTrip);
// print button
printButton.addEventListener('click', function (e) {
  window.print();
  location.reload();
});
// delete button
deleteButton.addEventListener('click', function (e) {
  form.reset();
  result.classList.add("invisible");
  location.reload();
})

// Function called when form is submitted
export function addTrip(e) {
  e.preventDefault();
  //Acquiring and storing user trip data
  const leavingFromText = leavingFrom.value;
  const goingToText = goingTo.value;
  const depDateText = depDate.value;
  const timestamp = (new Date(depDateText).getTime()) / 1000;

  // function checkInput to validate input 
  Client.checkInput(leavingFromText, goingToText);

  getCityInfo(geoNamesURL, goingToText, username)
    .then((cityData) => {
      const cityLat = cityData.geonames[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName;
      const weatherData = getWeather(cityLat, cityLong, country, timestamp)
      return weatherData;
    })
    .then((weatherData) => {
      const daysLeft = Math.round((timestamp - timestampNow) / 86400);
      const userData = postData('http://localhost:3000/add', { leavingFromText, goingToText, depDateText, weather: weatherData.currently.temperature, summary: weatherData.currently.summary, daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}

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
export { addTripEvList }