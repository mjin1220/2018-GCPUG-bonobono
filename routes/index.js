var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/queryTest', function(req, res, next){
  const BigQuery = require('@google-cloud/bigquery');
  const bigquery = new BigQuery({
    projectId: 'gcp-hackathon18-icn-2910',
  });

  const options = {
    query: `select * from bigquery-public-data.chicago_crime.crime limit 1`,
    timeoutMs: 10000, // Time out after 10 seconds.
    useLegacySql: false, // Use standard SQL syntax for queries.
  };

  process.env.GOOGLE_APPLICATION_CREDENTIALS = './config/GCP_Hackathon_Korea_2910-5e0999b1ab4c.json';

  bigquery
    .query(options)
    .then(results => {
      const rows = results[0];
      console.log('Rows:');
      rows.forEach(row => console.log(row));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
});
module.exports = router;
