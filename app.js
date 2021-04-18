// SERVER'S FRAMEWORK
const express = require('express');
// SERVER'S FRAMEWORK ↓
const app = express();
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
// ROUTES ↓
app.post('/signin', login);
app.post('/signup', createUser);
// ROUTES ↓
app.use(auth);
// NOT FOUND ROUTES*
app.use('*', router);
// ROUTES ↓
app.use(router);
// NPM CELEBRATE LIBRARY
app.use(errors());
// ERROR-HANDLER!!!
app.use(errorHandler);
// SERVER'S__LISTENER
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Work on ${PORT} port, server is up!!!`);
});
