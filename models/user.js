/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неверный формат',
    },
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlegth: 2,
    maxlegth: 30,
    required: true,
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
