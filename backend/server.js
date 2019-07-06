const express = require('express');
const bodyParser = require('body-parser');
const config = require('./_config');

const app = express();

// Create parsers for interpreting req
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/api/addresses', (req, res) => {
  // Return a list of saved addresses
  res.send(JSON.stringify('[]'));

  // TODO
  // Query database for address
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port 3000');
});
