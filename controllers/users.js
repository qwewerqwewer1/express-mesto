const UserSchema = require('../models/user');

const getUsers = (req, res) => {
  UserSchema.find({}).then((userData) => res.send(userData));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  UserSchema.findById(id).then((user) => res.send(user));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserSchema.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { createUser, getUserById, getUsers };
