const UserSchema = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserSchema.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
