let express = require('express');
let router = express.Router();
let fs = require('fs');
let http = require('http');
var DOMParser = require('xmldom').DOMParser;

var db = require('./sqlhandler.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Air Bonobono'
  });
});

router.get('/result', function(req, res, next){
  res.render('result', {
    title: 'Air Bonobono'
  });
})

router.post('/api', function (req, res1, next) {
  let receivedJson = req.body;

  const BigQuery = require('@google-cloud/bigquery');
  const bigquery = new BigQuery({                                                     
    projectId: 'gcp-hackathon18-icn-2910',
  });

  process.env.GOOGLE_APPLICATION_CREDENTIALS = './config/GCP_Hackathon_Korea_2910-5e0999b1ab4c.json';
  
  let conf = require('../config/config.json')
  let URL = `https://maps.googleapis.com/maps/api/place/textsearch/xml?query=${receivedJson.keyword}&location=${conf.basicLocation.lat},${conf.basicLocation.lng}&radius=${conf.basicRadius}&key=${conf.MapsAPIKey}`

  const request = require('request');

  request(URL, function (err, res2, body) {
    let doc = new DOMParser().parseFromString(body, 'text/xml');
    if(doc.getElementsByTagName('status')[0].childNodes[0].nodeValue == "ZERO_RESULTS"){
      res1.json({})
      return;
    }

    let location = doc.getElementsByTagName('geometry')[0].getElementsByTagName('location')[0];

    let result = {};
    result.lat = location.getElementsByTagName('lat')[0].childNodes[0].nodeValue;
    result.lng = location.getElementsByTagName('lng')[0].childNodes[0].nodeValue;

    const options = {

      query: `CREATE TEMP FUNCTION RADIANS(x FLOAT64) AS (ACOS(-1) * x / 180); SELECT primary_type, latitude, longitude FROM \`bigquery-public-data.chicago_crime.crime\` WHERE ( 6371 * acos( cos( RADIANS(${result.lat}) ) * cos( RADIANS( latitude ) ) * cos( RADIANS( longitude ) - RADIANS(${result.lng}) ) + sin( RADIANS(${result.lat}) ) * sin( RADIANS( latitude ) ) ) ) < 0.5 AND (primary_type="ROBBERY" OR primary_type="WEAPONS VIOLATION" OR primary_type="MOTOR VEHICLE THEFT" OR primary_type="ASSAULT" OR primary_type="HOMICIDE") LIMIT 500`,

      timeoutMs: 10000, // Time out after 10 seconds.
      useLegacySql: false, // Use standard SQL syntax for queries.
    };

    var rows2 =  db.query("SELECT name, thumbnail_url ,latitude, longitude, review_scores_rating FROM chicago_airbnb.airbnb WHERE ( 6371 * acos( cos( radians(" + result.lat + ") ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(" + result.lng + ") ) + sin( radians(" + result.lat + ") ) * sin( radians( latitude ) ) ) ) < 0.5")

    bigquery
      .query(options)
      .then(results => {
        const rows = results[0];
        let resultJSON = {};
        resultJSON.location = result;
        resultJSON.crimeData = rows;
        resultJSON.markData = rows2;
        res1.json(resultJSON);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  });
});

module.exports = router;