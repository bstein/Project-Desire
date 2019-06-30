const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('some placeholder text :)');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port 3000');
});
