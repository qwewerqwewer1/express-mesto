const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(BASE_PATH, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port`);
});
