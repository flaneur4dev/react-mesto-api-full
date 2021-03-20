const express = require('express');
const mongoose = require('mongoose');
const { celebrate, errors } = require('celebrate');

const { createUser, login, logout } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { errorMessage, authJoi } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const app = express();

require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
	useUnifiedTopology: true
});

app.use(express.json());

app.use(requestLogger);

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': true,
    'Content-Security-Policy': 'default-src "self"; img-src *',
    'Referrer-Policy': 'no-referrer'
  });
  next()
})

app.options('*', (req, res) => res.status(200).end());

//crash-test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate(authJoi), createUser); 
app.post('/signin', celebrate(authJoi), login);
app.get('/signout', auth, logout);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res) => res.status(404).send({ message: errorMessage['404'] }));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  let { statusCode, name, message, code } = err;

  const isValidationError = /(MongoError|ValidationError)/.test(name);
  const isCastingError = /CastError/.test(name);

  if (!statusCode) statusCode = isValidationError ? 400 : isCastingError ? 404 : 500;

  if (isValidationError) message = errorMessage['400'];
  if (isCastingError) message = errorMessage['404'];
  if (code === 11000) {
    statusCode = 409;
    message = errorMessage[statusCode]
  };
  
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? errorMessage['500'] : message })
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}...`))
