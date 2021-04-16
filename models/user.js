const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Имя не может состоять только из одной буквы'],
    maxLength: [30, 'Данные строки не могут превышать более 30 символов'],
    validate: {
      validator: (v) => /[А-ЯЁ][а-яё]+/.test(v),
      message: 'Имя доллжно быть на русском языке и начинаться с Большой буквы',
    },
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /^((http|https|ftp):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i.test(v),
      message: 'Имя доллжно быть на русском языке и начинаться с Большой буквы',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Минимум 8 символов'],
    validate: {
      validator: (v) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/.test(v),
    },
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
