const express = require('express');

const mongoose = require('mongoose');

// const bodyParser = require('body-parser');

const userRouter = require('./routes/users');

const { PORT = 3000, BASE_PATH } = process.env;

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', userRouter);

app.listen(BASE_PATH, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port`);
});
