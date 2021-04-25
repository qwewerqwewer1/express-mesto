const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getProfile = (req, res, next) => {
  UserSchema.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Пользователь отсутствует в базе'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  UserSchema.find({})
    .then((userData) => res.send(userData))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  UserSchema.findById(id)
    .orFail(new NotFoundError('Пользователь отсутствует в базе'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    if (password.length < 8) {
      throw new BadRequestError('Минимум 8 символов');
    }
  } catch (err) {
    next(err);
  }
  bcrypt.hash(password, 10)
    .then((hash) => UserSchema.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => {
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Переданы невалидные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateInfoUser = (req, res, next) => {
  const { name, about } = req.body;
  UserSchema.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь отсутствует в базе'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Пользователь отсутствует в базе'))
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Данные некоректны'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      // eslint-disable-next-line no-console
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        next(new UnauthorizedError('Данные некоректны'));
      } else {
        next(err);
      }
    });
};
