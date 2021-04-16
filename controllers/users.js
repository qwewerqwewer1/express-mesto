const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const validator = require('validator');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const getProfile = (req, res, next) => {
  UserSchema.findOne({ _id: req.params._id })
    .then((user) => {
      if (!user) {
        throw (new NotFoundError('Пользователь отсутствует'));
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id');
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  UserSchema.find({})
    .then((userData) => res.send(userData))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { id } = req.params;
  UserSchema.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь отсутствует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id');
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => UserSchema.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
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

const updateInfoUser = (req, res, next) => {
  const { name, about } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь отсутствует');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((newAvatar) => {
      if (!newAvatar) {
        throw (new NotFoundError('Пользователь отсутствует'));
      } else {
        res.send({ data: newAvatar });
      }
    })
    .catch((err) => {
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Данные некоректны'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }); // Пейлоуд токена — зашифрованный в строку объект пользователя
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).send({ message: 'Успешная авторизация' });
    })
    .catch((err) => {
      if (err.message === 'Unauthorized') {
        next(new UnauthorizedError('Данные некоректны'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getProfile, getUsers, getUserById, createUser, updateInfoUser, updateAvatarUser, login,
};
