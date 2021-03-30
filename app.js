const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
const router = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/', (req, res) => {
  res.send(req.method);
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port`);
});
