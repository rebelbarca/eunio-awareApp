const csv = require('csv-parser');
const fs = require('fs');
var axios = require("axios");

function getCoods() {
  const addressArr = [];

  fs.createReadStream('FilteredFootTrafficCount.csv')
    .pipe(csv())
    .on('data', (row) => {
      addressArr.push(row.road_name);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      console.log(addressArr);
      var postalCode = 2000;
      for (i = 0; i < addressArr.length; i++) {
        (function(i) { 
          setTimeout(function() {
            const queryURL = "https://us1.locationiq.com/v1/search.php?key=e329d0577c126d&street=" + addressArr[i] + "&city=sydney&format=json"
            axios.get(queryURL)
            .then(function (response) {
            console.log(addressArr[i])
            console.log(response.data[0].lat)
            console.log(response.data[0].lon)
            }, function(error){
                console.log(error);
            });
            }, 1000*i);
          })(i);
      }
    });

  // const queryURL = "https://us1.locationiq.com/v1/search.php?key=e329d0577c126d&street=" + location + "&postalcode=2000&format=json"
  // return axios.get(queryURL)
  //   .then(function (response) {
  //     // console.log(response.data[0])
  //     console.log(response.data[0].lat)
  //     console.log(response.data[0].lon)
  //   });
};

getCoods();

