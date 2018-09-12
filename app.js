'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Here is your home page');
})

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
  next();
});

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
