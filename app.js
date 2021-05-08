require('dotenv').config();
const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const { handlerError } = require('./middlewares/handler-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
}).then(() => console.log('Успешное подключение к базе данных!'));

const app = express();
app.use(helmet());
app.use(cors()); // разрешаем кросс-доменные запросы

app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

// временное решение авторизации
// app.use((req, res, next) => {
//   req.user = {
//     _id: '60954083693f1d11d0e246ab',
//     // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use(router); // любой запрос предавай на корневой роутер

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(handlerError); // централизованный обработчик ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
