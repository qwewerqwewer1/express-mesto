const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//                      Middleware
// Когда кто-то запросит любую информацию, мы захардкодим ему
// тестового юзера с этим ID от имени которого будут работать
// все пост запросы и пусть запрос идет себе дальше...
app.use((req, res, next) => {
  req.user = {
    _id: '606398f791432805a866b6d0',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port`);
});
