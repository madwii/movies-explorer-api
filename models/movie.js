const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String, required: true,
  },
  director: {
    type: String, required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number, required: true,
  },
  description: {
    type: String, required: true,
  },
  image: {
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат',
    },
    type: String,
    required: true,
  },
  trailer: {
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат',
    },
    type: String,
    required: true,
  },
  thumbnail: {
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Неверный формат',
    },
    type: String,
    required: true,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  movieId: {
    type: Number, required: true, unique: true,
  },
  nameRU: {
    type: String, required: true,
  },
  nameEN: {
    type: String, required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
