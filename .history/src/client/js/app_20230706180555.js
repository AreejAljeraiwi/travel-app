
/* Global Variables */
// const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
// const apiKey = '8e49ba477318f53fd081b9e1c72aee73';
// const apiKeyEnd = '&units=imperial'


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
const username = "aaljerawi";
const currentTimestamp = (Date.now()) / 1000;
const weatherbitAPIkey = "b717b1ce4cd64befb4cfe19662283582";
const pixabayAPIURL = "https://pixabay.com/api/?key=";
const pixabayAPIkey = "38103864-5c4f6dcec09966d81aae0094c";

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
      const weatherData = getWeather(cityLat, cityLong)
      return weatherData;
    })
    .then((weatherData) => {
      console.log("hi",weatherData);
      const daysLeft = Math.round((timestamp - currentTimestamp) / 86400);
      const userData = postData('http://localhost:3000/add', { leavingFromText, goingToText, depDateText, weather: weatherData.data[0].temp, summary: weatherData.data[0].weather.icon, daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}

export const getCityInfo = async (geoNamesURL, goingToText, username) => {
  // res equals to the result of fetch function
  const res = await fetch(geoNamesURL + goingToText + "&maxRows=10&" + "username=" + username);
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};

// function getWeather to get weather information from Dark Sky API 

export const getWeather = async (cityLat, cityLong) => {
 
  const req = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${cityLat}&lon=${cityLong}&key=${weatherbitAPIkey}`);
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
}

// Function postData to POST data to our local server
export const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      depCity: data.leavingFromText,
      arrCity: data.goingToText,
      depDate: data.depDateText,
      weather: data.weather,
      summary: data.summary,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

// Function update UI that reveals the results page with updated trip information including fetched image of the destination

export const updateUI = async (userData) => {
  result.classList.remove("invisible");
  result.scrollIntoView({ behavior: "smooth" });
  console.log("userData",userData);

  const res = await fetch(pixabayAPIURL + pixabayAPIkey + "&q=" + userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dateSplit = userData.depDate.split("-").reverse().join(" / ");
    document.querySelector("#city").innerHTML = userData.arrCity;
    document.querySelector("#date").innerHTML = dateSplit;
    document.querySelector("#days").innerHTML = userData.daysLeft;
    document.querySelector("#summary").innerHTML = userData.summary;
    document.querySelector("#temp").innerHTML = userData.weather;
    document.querySelector("#fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}

// document.getElementById('generate').addEventListener('click', performAction);

// function performAction(e) {
//   const zip = document.getElementById('zip').value;
//   const userResponse = document.getElementById('feelings').value
//   getWeather(baseURL, zip, apiKey)
//     .then(function (data) {
//       postData('/add', { temperature: data.main.temp, date: newDate, userResponse: userResponse })
//     }).then(function (data) {
//       updateUI()
//     })
// }

// // Async GET
// const getWeather = async (baseURL, zip, key) => {

//   const res = await fetch(`${baseURL}q=${zip}&appid=${key+apiKeyEnd}`)
//   try {

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log("error", error);
//     // appropriately handle the error
//   }
// }

// const updateUI = async () => {
//   const request = await fetch('/all');
//   try {
//     const allData = await request.json();
//     document.getElementById('date').innerHTML = allData.date;
//     document.getElementById('temp').innerHTML = Math.round(allData.temperature)+ ' degrees'
//     document.getElementById('content').innerHTML = allData.userResponse;

//   } catch (error) {
//     console.log("error", error);
//   }
// }
// // Async POST
// const postData = async (url = '', data = {}) => {
//   const response = await fetch(url, {
//     method: 'POST',
//     credentials: 'same-origin',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       temperature: data.temperature,
//       date: data.date,
//       userResponse: data.userResponse
//     }), // body data type must match "Content-Type" header        
//   });

//   try {
//     const newData = await response.json();
//     return newData;
//   } catch (error) {
//     console.log("error", error);
//   }
// };

// // Create a new date instance dynamically with JS
// let d = new Date();
// let newDate = ( d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();

// export { performAction }
export { addTripEvList }