const UserSchema = require('../models/user');

const getUsers = (req, res) => {
  UserSchema.find({})
    .then((userData) => res.send(userData))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стророне сервера' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  UserSchema.findById(id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(500).send({ message: error.message });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserSchema.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};

const updateInfoUser = (req, res) => {
  const { name, about } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFound'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('NotFound'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateInfoUser, updateAvatarUser,
};
