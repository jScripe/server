'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Here is your home page');
})

app.use('/api', require('./routes/api'));

// unknown endpoint
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(3000, () => {
  console.log('The server is listening on http://localhost:3000');
})
