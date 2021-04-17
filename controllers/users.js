const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports.getProfile = (req, res, next) => {
  UserSchema.findOne({ _id: req.users._id })
    // eslint-disable-next-line no-undef
    .then((user) = console.log(user))
    .then((user) => {
      // eslint-disable-next-line no-console
      console.log(req.user);
      if (!user) {
        throw (new NotFoundError(`Пользователь отсутствует с емайлом ${user}`));
      }
      res.send({ data: user });
    })
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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь отсутствует');
      }
      res.send(user);
    })
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
    .then((user) => res.status(201).send({ data: user.toJSON() }))
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

module.exports.updateAvatarUser = (req, res, next) => {
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
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
