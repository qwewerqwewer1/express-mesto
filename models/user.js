const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ваше имя'],
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: [true, 'Ваш род деятельности'],
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Обязательно укажите ссылку на вашу аватарку'],
  },
});

module.exports = mongoose.model('user', userSchema);
