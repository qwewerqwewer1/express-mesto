const UserSchema = require('../models/user');

const getUsers = (req, res) => {
  UserSchema.find({})
    .then((userData) => res.send(userData))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стророне сервера' }));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  UserSchema.findById(id)
    .then((user) => {
      if (!user) {
        return (() => res.status(404).send({ message: 'Пользователь не найден!' }));
      }
      res.send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стророне сервера' }));
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
    .then((newUser) => res.status(200).send({ data: newUser }))
    .catch((error) => res.status(404).send({ message: error.message }));
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;

  UserSchema.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((newAvatar) => res.status(200).send({ data: newAvatar }))
    .catch((error) => res.status(404).send({ message: error.message }));
};

module.exports = {
  getUsers, getUserById, createUser, updateInfoUser, updateAvatarUser,
};
