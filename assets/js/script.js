//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// Wraps all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  //variable declarations
  var APIKey = "8842b0a63cc95a90d2cde5cc0a71cb7a";
  var initCity = "Denver";
  var weekEl = $("#week-content");
  var cityNameEl = $("#city-name");
  var citiesEl = $("#cities");
  var citiesArr = [];
  var today = dayjs();
  $("#currentDay").text(today.format("MMM D, YYYY"));
  var tempEl = $(".temp");
  var windEl = $(".wind");
  var humdEl = $(".humidity");

  //checking if there is any storage array yet, if not null creates the sidebar buttons with the data of the array stored at LocalStorage
  var storedCities = JSON.parse(localStorage.getItem("citySearch"));
  if (storedCities !== null) {
    citiesArr = storedCities;
    //console.log(citiesArr);

    for (var i = 0; i < citiesArr.length; i++) {
      var cityText = citiesArr[i];
      var cityBtnEl = document.createElement("button");
      cityBtnEl.classList.add("btn", "p-3", "btn-block-side", "w-100", "my-2");
      cityBtnEl.textContent = cityText;
      citiesEl.append(cityBtnEl);
    }
  }
  displayAPI(initCity); //starts with Denver city as default

  /////////////////////////////////////////////////////functions

  //displays current Weather from Open Weather API
  function displayAPI(city) {
    var queryURL =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey +
      "&units=imperial";

    //console.log(queryURL);

    // fetch query
    fetch(queryURL)
      .then(function (response) {
        //console.log(response);
        return response.json();
      })
      .then(function (data) {
        // console.log(data);
        //adds values from data to HTML elements
        tempEl.text(data.main.temp + " °F");
        windEl.text(data.wind.speed + " MPH");
        humdEl.text(data.main.humidity + " %");
        cityNameEl.text(data.name);

        //gets custom icons
        var iconKeyword = data.weather[0].main;
        var iconurl = "./assets/img/" + iconKeyword + ".png";
        $("#wicon").attr("src", iconurl);
        //gets icons from Open Weather
        // var iconcode = data.weather[0].icon;
        // //console.log(data.weather[0].icon);
        // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        // $("#wicon").attr("src", iconurl);

        //gets latitude and longitude
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        //console.log("lat=" + lat + "   and lon= " + lon);
        // var timezone = data.timezone;
        // console.log("timezone" + timezone);

        weekEl.empty(); //removes children of week container
        forecast(lat, lon); //calls forecast function with lat and lon as parameters
      });
  }

  //function declaration name forecast with two values as arguments
  function forecast(lat, lon) {
    //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

    var queryURL =
      "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      APIKey +
      "&units=imperial";

    //console.log(queryURL);
    // fetch query
    fetch(queryURL)
      .then(function (response) {
        //console.log(response);
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        //iterates the data.list array to display 5 days
        for (var i = 0; i < data.list.length; i = i + 8) {
          //creates elements
          var forecastDay = $("<div>");
          var fdateEl = $("<h3>");
          var ftempEl = $("<p>");
          var fwindEl = $("<p>");
          var fhumdEl = $("<p>");

          //gets icon url and is added to img src
          // var iconcode = data.list[i].weather[0].icon;
          // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          // var iconEl = $("<img>");
          // iconEl.attr("src", iconurl);

          //gets custom icons
          var iconKeyword = data.list[i].weather[0].main;
          console.log(iconKeyword);
          var iconurl = "./assets/img/" + iconKeyword + ".png";
          var iconEl = $("<img>");
          iconEl.attr("src", iconurl);

          /////////////playing with dates data

          // var fDay = Number(data.list[i].dt_txt.slice(8, 10));
          // var forecastMonth = Number(data.list[i].dt_txt.slice(5, 7));
          // var forecastYear = data.list[i].dt_txt.slice(0, 4);

          // console.log(fDay);
          // console.log(forecastMonth);
          // console.log(forecastYear);
          // console.log(data.list[i].dt);
          // console.log(timezone);
          var dayname = new Date(data.list[i].dt * 1000).toLocaleDateString(
            "en",
            {
              weekday: "long",
            }
          );
          //console.log(dayname);
          // console.log(
          //   "minus" + new Date(data.list[i].dt * 1000 - timezone * 1000)
          // ); // minus
          // console.log(
          //   "plus" + new Date(data.list[i].dt * 1000 + timezone * 1000)
          // ); // plus

          //adds values from data to HTML elements
          //fdateEl.text(data.list[i].dt_txt.slice(0, 10));
          fdateEl.text(dayname);
          //console.log(fdateEl.text(data.list[i].dt_txt.slice(0, 10)));
          ftempEl.text("Temp.: " + data.list[i].main.temp + " °F");
          fwindEl.text("Wind: " + data.list[i].wind.speed + " MPH");
          fhumdEl.text("Humidity: " + data.list[i].main.humidity + " %");

          //add elements to DOM
          forecastDay.append(iconEl, fdateEl, ftempEl, fwindEl, fhumdEl);
          forecastDay.addClass(
            "col-sm-12 col-md-4 col-lg-2 bg-main forecast-cards text-light text-center rounded-2 mx-2 mb-4"
          );
          // console.log(forecastDay);
          weekEl.append(forecastDay);
        }
      });
    $(".week-content div").addClass("col-md-2");
  }

  //creates and displays sidebar city buttons
  function displayBtns() {
    //iterates the array store in local storage to create city buttons in side bar
    for (var i = 0; i < citiesArr.length; i++) {
      var cityText = citiesArr[i];
      var cityBtnEl = document.createElement("button");
      cityBtnEl.classList.add("btn", "btn-block-side", "w-100", "my-2", "p-3");
      cityBtnEl.textContent = cityText;
    }
    citiesEl.append(cityBtnEl);
  }

  ////////////
  /////////////////////////////////////////////////////EvenListeners

  // search button event listener
  $(".btn-search").on("click", function (event) {
    event.preventDefault();
    var cityName = $(this).siblings("#search-input").val();
    // if the array dont have the input city value then push value to array and call function displayBtns
    if (!citiesArr.includes(cityName)) {
      citiesArr.push($(this).siblings("#search-input").val());
      displayBtns();
    }
    //store array in LocalStorage
    localStorage.setItem("citySearch", JSON.stringify(citiesArr));
    displayAPI(cityName); //calls function displayAPI with cityName as parameter
  });

  //sidebar city buttons eventListeners
  $("#cities").on("click", ".btn-block-side", function () {
    var cityName = $(this).text(); //clicked button text = city
    displayAPI(cityName); //calls function displayAPI with cityName as parameter
  });
});
