import placeholderData from "../placeholder.js";
// GET API DATA FROM THE 7TIMER API
const getAPIData = async (lon, lat) => {
  const URL = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
  const response = await fetch(URL);
  const data = await response.json();
  console.log(data);
  return data;
};

// GET THE LIST OF COUNTRY FROM PLACEHOLDER
const countryList = document.querySelector("#country-list");
const loadCountry = () => {
  const newCountryList = [
    ...new Set(placeholderData.map((data) => data.country)),
  ];
  newCountryList.map((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.innerText = country;
    countryList.appendChild(option);
  });
};
loadCountry();

// GET THE LIST OF CITY AS PER COUNTRY FROM PLACEHOLDER
const cityList = document.querySelector("#city-list");
const loadCity = () => {
  cityList.innerText = "";
  const selectedCountry = countryList.value;
  const filteredData = placeholderData.filter(
    (data) => data.country === selectedCountry
  );
  filteredData.map((data) => {
    const option = document.createElement("option");
    option.value = data.city;
    option.innerText = data.city;
    cityList.appendChild(option);
  });
};
countryList.addEventListener("change", loadCity);

// ADD EVENT LISTENER ON THE SHOW WEATHER BUTTON
const showWeatherBtn = document.querySelector("#show-weather");
const resultDivider = document.querySelector("#warning-paragraph");

// GET LONGITUDE AND LATITUDE FOR THE LOADING THE WEATHER
const getWeather = () => {
  const country = countryList.value;
  const city = cityList.value;
  const selectedData = placeholderData.find(
    (data) => data.country === country && data.city === city
  );

  if (selectedData) {
    resultDivider.classList.remove("error");
    resultDivider.innerText = "Loading...";
    const lon = selectedData.lon;
    const lat = selectedData.lat;
    getAPIData(lon, lat).then((response) => {
      resultDivider.innerText = "";
      if (response) {
        response.dataseries.forEach((data) => {
          loadWeather(
            data.timepoint,
            data.cloudcover,
            data.lifted_index,
            data.prec_type,
            data.prec_amount,
            data.rh2m,
            data.temp2m,
            data.weather,
            data.wind10m
          );
        });
      }
    });
  } else {
    resultDivider.classList.add("error");
    resultDivider.innerText = "Cannot find the place data";
  }
};
// LOAD THE WEATHER BELOW INSIDE THE DIVIDER
const loadWeather = (
  timepoint,
  cloudcover,
  lifted_index,
  prec_type,
  prec_amount,
  rh2m,
  temp2m,
  weather,
  wind10m
) => {
  // CREATE ELEMENTS FOR EACH WEATHER PROPERTY
  const weatherComponent = document.createElement("div");
  const timepointElement = document.createElement("h3");
  const cloudcoverElement = document.createElement("p");
  const liftedIndexElement = document.createElement("p");
  const precTypeElement = document.createElement("p");
  const precAmountElement = document.createElement("p");
  const rh2mElement = document.createElement("p");
  const temp2mElement = document.createElement("p");
  const weatherElement = document.createElement("img");
  const wind10mElement = document.createElement("p");

  //CODE REQUIRED THING FOR KEEPING INSIDE THE ELEMENTS
  // DATE FOR THE TIMEPOINT
  const date = new Date();
  date.setHours(date.getHours() + timepoint);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = date.toLocaleDateString(undefined, options);

  // LOAD IMAGES ACCORDING TO THE WEATHER
  const weatherImages = {
    clearday: "../images/clear.png",
    clearnight: "../images/clear.png",
    pcloudyday: "../images/pcloudy.png",
    pcloudynight: "../images/pcloudy.png",
    mcloudyday: "../images/mcloudy.png",
    mcloudynight: "../images/mcloudy.png",
    cloudyday: "../images/cloudy.png",
    cloudynight: "../images/cloudy.png",
    humidday: "../images/humid.png",
    humidnight: "../images/humid.png",
    lightrainday: "../images/lightrain.png",
    lightrainnight: "../images/lightrain.png",
    oshowerday: "../images/oshower.png",
    oshowernight: "../images/oshower.png",
    ishowerday: "../images/ishower.png",
    ishowernight: "../images/ishower.png",
    lightsnowday: "../images/lightsnow.png",
    lightsnownight: "../images/lightsnow.png",
    rainday: "../images/rain.png",
    rainnight: "../images/rain.png",
    snowday: "../images/snow.png",
    snownight: "../images/snow.png",
    rainsnowday: "../images/rainsnow.png",
    rainsnownight: "../images/rainsnow.png",
  };
  if (weather in weatherImages) {
    const imageURL = weatherImages[weather];
    weatherElement.src = imageURL;
  }
  // Set text content for each element
  timepointElement.innerText = `Timepoint: ${formattedDate} ${dayOfWeek}`;
  cloudcoverElement.innerText = `Cloudcover: ${cloudcover}`;
  liftedIndexElement.innerText = `Lifted Index: ${lifted_index}`;
  precTypeElement.innerText = `Precipitation Type: ${prec_type}`;
  precAmountElement.innerText = `Precipitation Amount: ${prec_amount}`;
  rh2mElement.innerText = `Relative Humidity at 2m: ${rh2m}`;
  temp2mElement.innerText = `Temperature at 2m: ${temp2m}`;
  wind10mElement.innerText = `Wind at 10m: Direction ${wind10m.direction}, Speed ${wind10m.speed}`;

  // APPEND THE ELEMENTS TO THE RESULT DIVIDER
  resultDivider.appendChild(weatherComponent);
  weatherComponent.appendChild(timepointElement);
  weatherComponent.appendChild(cloudcoverElement);
  weatherComponent.appendChild(liftedIndexElement);
  weatherComponent.appendChild(precTypeElement);
  weatherComponent.appendChild(precAmountElement);
  weatherComponent.appendChild(rh2mElement);
  weatherComponent.appendChild(temp2mElement);
  weatherComponent.appendChild(weatherElement);
  weatherComponent.appendChild(wind10mElement);
};

showWeatherBtn.addEventListener("click", getWeather);
console.log(placeholderData);
