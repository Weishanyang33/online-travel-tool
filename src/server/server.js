const username = 'weishanyang33';
const darkskykey = 'b8519f2dce006c5143d9eb1e567ad8ae';
const pixabaykey = '15285794-42e8a95e71f4d973ba5e5e65a';
const defaultImage = "https://designmodo.com/wp-content/uploads/2010/09/CivilAircraft_005011.jpg";

// Setup empty JS object to act as endpoint for all routes
data = {}
data.trips = []
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const cors = require('cors');
const bodyParser = require('body-parser');
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());

const axios = require('axios');

// Initialize the main project folder
app.use(express.static('dist'));

const dotenv = require('dotenv');
dotenv.config();

const port = 3320;
// Spin up the server
const server = app.listen(port, () => {
  console.log(`running on location: ${port}`);
});

// Initialize all route with a callback function
// Callback function to complete GET '/all'
app.get('/getData', function (req, res) {
  res.send(data);
})

app.post('/deleteData', function (req, res) {
  index = req.body.index;
  console.log("index is " + index);
  data.trips.splice(index, 1);
  returnData = {}
  returnData.tripLength = data.trips.length;
  res.send(returnData );
})

app.get('/hi', function (req, res) {
  res.send('Hello world');
})

// Post Route
app.post('/addData', function (req, res) {
  console.log(req.body);
  data.trips.push(req.body)
  res.send(data);  
})