const username = 'weishanyang33';
const darkskykey = 'b8519f2dce006c5143d9eb1e567ad8ae';
const pixabaykey = '15285794-42e8a95e71f4d973ba5e5e65a';
const defaultImage = "https://image.shutterstock.com/z/stock-photo-commercial-airplane-flying-above-clouds-in-dramatic-sunset-light-very-high-resolution-of-image-553131187.jpg";

function formHandler(){
  const startDate = new Date(document.getElementById('departure_date').value);
  const returnDate = new Date(document.getElementById('return_date').value)
  const place = document.getElementById('destination').value;
  if(startDate == "Invalid Date" || returnDate == "Invalid Date" || !place){
    alert("Please input right travel info!");
  }
  else if(startDate < new Date()){
    alert("Start date has to be in the future!");
  }
  else if(startDate > returnDate){
    alert("Start date must be earlier than returnDate!");
  }
  else {
    const tripLength = Math.floor((returnDate - startDate)/ 86400000);
    _fetchGeoNames(place).then(response => {
      const data = {}
      data.place = response[3] + "," + response[2];
      data.place = place;
      data.tripLength = tripLength;
      data.startDate = startDate;
      console.log("data is " + data);
      Promise.all([
        _darkSky(response[0], response[1], new Date(startDate).getTime() / 1000).then(
          response => {
            data['weather'] =  `${response.temperatureLow} to ${response.temperatureHigh}`;
            console.log("weather response" + data['weather'] );
          }
        ).catch(
          error => console.log(error)
        ),
        _pixabay(response[3]).then(
          response => {
            console.log("img is " + response);
            data.img = response;
          }
        ).catch(
          error => console.log(error)
        )]
      ).then(
        _ => {
          if(!data.img) data.img = defaultImage;
          console.log("my data is" + JSON.stringify(data));
          document.getElementById('trip_list').appendChild(_oneTripDisplay(data));
          _postData(data);
          document.getElementById("add_trip_section").style.display = 'none';
          document.getElementById('no_trip').style.display = 'none';
        }
      )
    })
  }
}

function _oneTripDisplay(a) {
  const currentDate = new Date()
  const sDate = new Date(a.startDate);
  const countDown = Math.floor((sDate - currentDate)/ 86400000);
  const li_element = document.createElement('li');
  var html_text=  `<div class = 'outerbox_row'><div><img src=${a.img} width="400" height="200"></div>`;
  html_text = html_text + `<div><p class="place" >${a.place} is ${countDown} days away</p>`;
  html_text = html_text + `<p class="trip_length" >Trip_length: ${a.tripLength}</p>`;
  html_text = html_text + `<p class="weather" >Weather: ${a.weather}F</p>`;
  html_text = html_text + "<button class = 'removebutton' id = '123' type='button'>Remove Trip</button></div></div>";
  li_element.innerHTML = html_text;
  return li_element;
}

const _getData = async () => {
    const response = await fetch('/getData', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },        
    });
    try {
      if (response.ok) {
        const newData = await response.json();
        console.log(newData);
        return newData["trips"];
      }
    } catch(error) {
      console.log("error code " + response);
      return "";
    }
  }

  /* Function to POST data */
const _postData = async (data) => {
  const response = await fetch("/addData", {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },        
    body: JSON.stringify(data),
  });
  try {
    if (response.ok) {
      console.log(await response.json());
    }
  } catch(error) {
    console.log("error code " + response);
  }
}

const removeData = async (index) => {
  const data = {}
  data.index = index;
  const response = await fetch('/deleteData', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)    
  });
  try {
    if (response.ok) {
      console.log("Delete the trip successfully");
      const data = await response.json();
      if(data.tripLength == 0) {
        document.getElementById('no_trip').style.display = 'block';
      }
    }
  } catch(error) {
    console.log("Fail to delete the trip due to " + response);
  }
}

function refreshDisplay() {
  _getData().then(response => {
    console.log(response);
    if(response.length == 0) {
      document.getElementById('no_trip').style.display = 'block';
    }
    else {
      document.getElementById('no_trip').style.display = 'none';
      for(var i = 0; i < response.length; i++) {
        const a = response[i];
        document.getElementById('trip_list').appendChild(_oneTripDisplay(a));
      }
    }}
  )
}

const _fetchGeoNames = async (place) => {
  const placeParam = isNaN(place) ? 'placename=' + place : 'postalcode=' + place;
  const url = `https://cors-anywhere.herokuapp.com/http://api.geonames.org/postalCodeSearchJSON?${placeParam}&maxRows=10&username=${username}`;
  return await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },        
  }).then(response => response.json())
  .then(data => {
    console.log(data);
    const res = data.postalCodes[0];
    return [res.lat, res.lng, res.countryCode, res.placeName]
  })
};

const _darkSky = async (lat, long, time) => {
  // we build our data necessary for doing the fetch operation from weather api
  const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkskykey}/${lat},${long},${time}`;
  console.log(url);
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Request-Method': 'GET',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "localhost:9000",
      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    },        
  }).then(response => response.json())
  .then(data => {
    console.log("weather " + data.daily.data[0]);
    return data.daily.data[0];
  });
};

const _pixabay = async (image) => {
  // data necessary for doing the fetch operation from pixabay api
  const url = `https://cors-anywhere.herokuapp.com/https://pixabay.com/api/?key=${pixabaykey}&q=${image}`;
  console.log(url);
  return await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },        
  }).then(response => response.json())
  .then(data => {
    if (data.totalHits != 0) {
      console.log("image: " + data.hits[0].largeImageURL);
      return data.hits[0].largeImageURL;
    } else {
      console.log("default image: " + defaultImage);
      return defaultImage;
    }
  });
};

export {formHandler, removeData, refreshDisplay}
