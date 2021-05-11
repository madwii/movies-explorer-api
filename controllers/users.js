/* eslint-disable no-unused-vars */
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const NotUniqueEmailError = require('../errors/not-unique-email-err');
const UnAuthError = require('../errors/un-auth-err');

// получить текущего пользователя
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по заданному id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Пользователь по заданному id не найден'));
      } else {
        next(err);
      }
    });
};

// создание пользователя
const createUser = (req, res, next) => {
  const data = { ...req.body };
  if (!data.password) {
    throw new BadRequestError('Проверьте пароль');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: data.name,
      email: data.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ data: user.toJSON() });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new NotUniqueEmailError('Пользователь с таким электронным адресом уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// обновить данные пользователя
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Передан id в неверном формате');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new NotUniqueEmailError('Пользователь с таким электронным адресом уже существует'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      throw new UnAuthError('Неправильная почта или пароль');
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  login,
};
