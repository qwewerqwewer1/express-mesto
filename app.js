// SERVER'S FRAMEWORK
const express = require('express');
// NPM CORS DOTENV
require('dotenv').config();
// NPM CORS
const cors = require('cors');
// SERVER'S FRAMEWORK ↓
const app = express();
// NPM CORS ↓
app.use(cors(
  // {
  //   origin: 'http://black-box.nomoredomains.monster',
  //   optionsSuccessStatus: 200,
  // }
));
const { PORT = 3000 } = process.env;
// DATABASE MONGO
const mongoose = require('mongoose');
// NPM BODYPARSER
const bodyParser = require('body-parser');
// NPM CELEBRATE LIBRARY
const { errors } = require('celebrate');
// NPM ANTI-DDOS
const rateLimit = require('express-rate-limit');
// NPM ANTI-DDOS ↓
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// NPM HELMET
const helmet = require('helmet');
// ROUTES
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
// NPM WINSTON {Loggers}
const { requestLogger, errorLogger } = require('./middlewares/logger');

// DATABASE MONGO ↓
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// NPM BODYPARSER ↓
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// NPM ANTI-DDOS ↓
app.use(limiter);
// NPM HELMET ↓
app.use(helmet());
// NPM WINSTON {requestLogger} ↓
app.use(requestLogger);
// CRASH-TEST for REVIEWERS
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// ROUTES ↓
app.post('/signin', login);
app.post('/signup', createUser);
// ROUTES ↓
app.use(auth);
// ROUTES ↓
app.use(router);
// NOT FOUND ROUTES*
app.use('*', router);
// NPM WINSTON {errorLogger} ↑
app.use(errorLogger);
// NPM CELEBRATE LIBRARY ↓
app.use(errors());
// ERROR-HANDLER!!!
app.use(errorHandler);
// SERVER'S__LISTENER
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port, server is up!!!`);
});
