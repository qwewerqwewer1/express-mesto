// SERVER'S FRAMEWORK
const express = require('express');
// SERVER'S FRAMEWORK ↓
const app = express();
const { PORT = 3000 } = process.env;
// DATABASE MONGO
const mongoose = require('mongoose');
// NPM BODYPARSER
const bodyParser = require('body-parser');
// ROUTES
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
// DATABASE MONGO ↓
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// NPM BODYPARSER ↓
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ROUTES ↓
app.post('/signin', login);
app.post('/signup', createUser);
// ROUTES ↓
app.use(auth);
// ROUTES ↓
app.use(router);
// NOT FOUND ROUTES*
app.use('*', router);
// ERROR-HANDLER!!!
app.use(errorHandler);
// SERVER'S__LISTENER
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port, server is up!!!`);
});
