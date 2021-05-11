/* eslint-disable no-shadow */
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

// возвращает сохраненные муви
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Не найдена карточка по заданному id');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      } else {
        movie.remove()
          .then(() => {
            res.status(200).send({ message: 'Фильм удален!' });
          });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Ошибка валидации данных'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
